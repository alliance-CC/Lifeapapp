import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE = "lifeup_session"

// 認証不要のパス
const PUBLIC_PATHS = ["/login", "/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ルート・公開パス・APIは通す
  if (
    pathname === "/" ||
    pathname.startsWith("/api") ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  // セッションCookieが無ければログインへ
  // （署名の厳密な検証はNodeランタイムのAPIルート側で実施）
  const hasSession = request.cookies.has(SESSION_COOKIE)
  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
