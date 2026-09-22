import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() || '';
  const { pathname, searchParams } = request.nextUrl;

  // Intercept requests from the old domain lux-auto.xyz or for testing with ?demo_error=1
  const isOldDomain = host.includes('lux-auto.xyz');
  const isTestingMode = searchParams.has('demo_error');

  if (isOldDomain || isTestingMode) {
    // Exclude Next.js internals, static files, and api routes if needed
    if (
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      !pathname.includes('.') &&
      pathname !== '/domain-suspended'
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/domain-suspended';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files with extensions and _next
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
