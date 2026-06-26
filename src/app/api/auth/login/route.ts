import { NextRequest, NextResponse } from "next/server"
import { callSheets, isSheetsConfigured } from "@/lib/sheets/client"
import { verifyPassword, setSessionCookie } from "@/lib/sheets/auth"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードを入力してください" }, { status: 400 })
  }

  // デモモード
  if (!isSheetsConfigured()) {
    await setSessionCookie("demo-user")
    return NextResponse.json({
      user: { id: "demo-user", name: "デモユーザー", email, role: "manager" },
      demo: true,
    })
  }

  try {
    const result = await callSheets<{ user?: Record<string, unknown> | null }>("getUserByEmail", { email })
    const user = result.user
    if (!user) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが違います" }, { status: 401 })
    }

    const ok = verifyPassword(password, String(user.passwordHash || ""))
    if (!ok) {
      return NextResponse.json({ error: "メールアドレスまたはパスワードが違います" }, { status: 401 })
    }

    await setSessionCookie(String(user.id))
    // passwordHash を除いて返す
    const { passwordHash: _omit, ...safe } = user
    void _omit
    return NextResponse.json({ user: safe })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ログインに失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
