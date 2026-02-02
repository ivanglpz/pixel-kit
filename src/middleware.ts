import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "accessToken";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const redirectToLogin = (request: NextRequest): NextResponse => {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isPrivateRoute = pathname.startsWith("/app");

  // Sin token: permite acceso a rutas públicas
  if (!token) {
    return isPrivateRoute ? redirectToLogin(request) : NextResponse.next();
  }

  try {
    // Verifica el JWT con jose
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Si está logueado y va a /login, redirecciona a /app
    if (pathname === "/login" || pathname === "/") {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Pasa datos del usuario en los headers
    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload.sub as string);
    if (payload.email) {
      headers.set("x-user-email", payload.email as string);
    }

    return NextResponse.next({
      request: { headers },
    });
  } catch (error) {
    // Token inválido o expirado
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
  ],
};
