import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Allow public access to individual event pages
  if (path.match(/^\/events\/[^/]+$/)) {
    return NextResponse.next()
  }

  // Paths that require authentication
  const protectedPaths = [
    '/profile',
    '/events',
    '/create-event',
    '/favorites',
    '/search',
    '/events/[id]/customize'
  ]
  
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix))
  
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const payload = await verifyJWT(token)

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
    '/favorites',
    '/search',
  ],
}