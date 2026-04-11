import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/registro', '/recuperar', '/reset-password', '/contacto', '/nosotros', '/empleos'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Rutas protegidas de candidato
  const candidateRoutes = ['/dashboard'];
  const isCandidateRoute = candidateRoutes.some(route => pathname.startsWith(route));

  // Rutas protegidas de reclutador
  const recruiterRoutes = ['/recruiter'];
  const isRecruiterRoute = recruiterRoutes.some(route => pathname.startsWith(route));

  const isProtectedRoute = isCandidateRoute || isRecruiterRoute;

  if (isProtectedRoute && !isPublicRoute) {
    // Verificar si hay token en cookies o headers
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirigir a login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Aquí podríamos decodificar el token y verificar el rol
    // Para rutas de reclutador, asegurarse que sea reclutador o admin
    // Para rutas de candidato, asegurarse que sea candidato
    // Por ahora, asumimos que el token es válido basándonos en el servidor
    // El cliente también valida en el layout
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