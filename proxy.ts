import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  if (pathname.startsWith('/admin')) {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login
    if (!token) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/login') {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      const url = new URL('/admin', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
