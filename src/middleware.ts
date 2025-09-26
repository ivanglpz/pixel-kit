import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const isPrivateRoute = pathname.startsWith("/app");

  // ✅ 1. Si es ruta privada (/app)
  if (isPrivateRoute) {
    if (!accessToken) {
      // No hay token → mandar a login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const isValid = await validateWithApi(accessToken, request);
    if (!isValid) {
      // Token inválido → mandar a login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Token válido → dejar pasar
    return NextResponse.next();
  }

  // ✅ 2. Si es ruta pública (cualquier cosa que no sea /app)
  if (accessToken) {
    const isValid = await validateWithApi(accessToken, request);
    if (isValid) {
      // Usuario logueado → redirigir al dashboard
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  // Público sin token o token inválido → dejar pasar
  return NextResponse.next();
}

// ✅ Función que valida el token con tu endpoint
async function validateWithApi(token: string, request: NextRequest) {
  try {
    console.log(
      `${request.nextUrl.origin}/api/users/me`,
      "`${request.nextUrl.origin}/api/users/me`"
    );

    const res = await fetch(`${request.nextUrl.origin}/api/users/me`, {
      method: "GET",
      headers: {
        authorization: token,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    console.log("✅ Usuario validado:", data.user.email);
    return true;
  } catch (err) {
    console.error("❌ Error validando con la API:", err);
    return false;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
  ],
};
