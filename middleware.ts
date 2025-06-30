import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // 1. Define public and protected routes
  const publicRoutes = ['/login', '/signup', '/api/public'];
  const protectedRoutes = ['/dashboard', '/profile', '/api/secure'];

  // 2. Skip middleware for API routes if needed
  if (path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }

  // 3. Handle public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 4. Protect private routes
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify token and refresh cookie
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      
      const response = NextResponse.next();
      // Refresh cookie expiry on each request
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/',
      });

      // Pass user ID to routes
      request.headers.set('x-user-id', decoded.userId);
      
      return response;
    } catch (error) {
         console.error('Authentication error:', error instanceof Error ? error.message : String(error));
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// 5. Configure which paths trigger middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};