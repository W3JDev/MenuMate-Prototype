import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For demo purposes, we'll allow all access to the admin portal
  // In a real application, you would check for authentication here
  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}

