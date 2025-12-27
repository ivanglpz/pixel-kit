import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type SessionPayload = {
  sub: string;
  exp: number;
};

const SESSION_COOKIE = "accessToken";
const AUTH_SECRET = process.env.AUTH_SECRET;
async function verifyJwt(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToArrayBuffer(signature),
      new TextEncoder().encode(`${header}.${payload}`)
    );

    if (!valid) return null;

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as SessionPayload;

    if (decodedPayload.exp * 1000 < Date.now()) return null;

    return decodedPayload;
  } catch {
    return null;
  }
}

const base64UrlToArrayBuffer = (value: string): ArrayBuffer => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isPrivateRoute = pathname.startsWith("/app");

  // Ruta privada sin token
  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && AUTH_SECRET) {
    const payload = await verifyJwt(token, AUTH_SECRET);

    // Token inválido
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Usuario autenticado → continuar
    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.sub);

    // Si está en login y ya está autenticado → redirigir
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return NextResponse.next({
      request: { headers },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
  ],
};
