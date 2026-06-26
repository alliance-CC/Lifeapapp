import { NextRequest, NextResponse } from "next/server"
import { callSheets, isSheetsConfigured } from "@/lib/sheets/client"
import { hashPassword, setSessionCookie } from "@/lib/sheets/auth"

export async function POST(request: NextRequest) {
  const { name, email, password, department, job_type } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードを入力してください" }, { status: 400 })
  }

  // デモモード: バックエンド未設定でもアプリを試せるようにする
  if (!isSheetsConfigured()) {
    await setSessionCookie("demo-user")
    return NextResponse.json({
      user: { id: "demo-user", name: name || "デモユーザー", email, role: "manager" },
      demo: true,
    })
  }

  try {
    const passwordHash = hashPassword(password)
    const result = await callSheets<{ user?: Record<string, unknown>; error?: string }>("signup", {
      name, email, passwordHash, department, job_type,
    })
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    if (!result.user) return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 })

    await setSessionCookie(String(result.user.id))
    return NextResponse.json({ user: result.user })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "登録に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
