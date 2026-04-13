import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/registro', '/recuperar', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/recruiter'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isPublicRoute) {
    // Verificar si hay token en cookies o headers
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirigir a login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Aquí podríamos validar el token, pero por simplicidad, asumimos que si existe, es válido
    // En producción, validar con el backend
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};