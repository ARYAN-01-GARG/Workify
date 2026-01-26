import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, origin } = nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', origin));
  }

  if (pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', origin));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'] };
