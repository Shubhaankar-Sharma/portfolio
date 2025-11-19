import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Handle reading subdomain
  if (hostname === 'reading.shubhaankar.com' || hostname === 'reading.spongeboi.com') {
    const url = request.nextUrl.clone()
    const response = NextResponse.next()

    // Set a header to indicate standalone mode
    response.headers.set('x-standalone-mode', 'true')

    // If already on /reading path, continue with the header
    if (url.pathname.startsWith('/reading')) {
      return response
    }

    // Rewrite root to /reading
    if (url.pathname === '/') {
      url.pathname = '/reading'
      const rewriteResponse = NextResponse.rewrite(url)
      rewriteResponse.headers.set('x-standalone-mode', 'true')
      return rewriteResponse
    }

    // Rewrite any other path under /reading
    url.pathname = `/reading${url.pathname}`
    const rewriteResponse = NextResponse.rewrite(url)
    rewriteResponse.headers.set('x-standalone-mode', 'true')
    return rewriteResponse
  }

  // Handle cv subdomain
  if (hostname === 'cv.shubhaankar.com' || hostname === 'cv.spongeboi.com') {
    const url = request.nextUrl.clone()

    if (url.pathname === '/') {
      url.pathname = '/cv'
      return NextResponse.rewrite(url)
    }

    if (!url.pathname.startsWith('/cv')) {
      url.pathname = `/cv${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
