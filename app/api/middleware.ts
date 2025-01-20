import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '../../lib/jwt'

export function middleware(request: NextRequest) {
  // Paths that require authentication
  const protectedPaths = ['/profile', '/events', '/create-event']
  
  const path = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix))
  
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyJWT(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/events/:path*',
    '/create-event',
  ],
}