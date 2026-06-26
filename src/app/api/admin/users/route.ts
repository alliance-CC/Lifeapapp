import { NextRequest, NextResponse } from "next/server"
import { callSheets, isSheetsConfigured } from "@/lib/sheets/client"
import { getSessionUserId } from "@/lib/sheets/auth"

// ログイン中ユーザーのロールを取得
async function getRequestingUserRole(): Promise<string | null> {
  const userId = await getSessionUserId()
  if (!userId) return null
  if (!isSheetsConfigured()) return "manager" // デモモードは管理者扱い
  try {
    const result = await callSheets<{ user?: { role?: string } | null }>("getUserById", { userId })
    return result.user?.role ?? null
  } catch {
    return null
  }
}

// GET /api/admin/users — 管理者のみ: ユーザー一覧
export async function GET() {
  if (!isSheetsConfigured()) {
    return NextResponse.json({
      users: [
        { id: "demo-1", name: "管理者ユーザー", email: "manager@lifeup.jp", role: "manager", department: "経営", job_type: "代表" },
        { id: "demo-2", name: "田中 リーダー", email: "tanaka@lifeup.jp", role: "leader", department: "営業", job_type: "リーダー" },
        { id: "demo-3", name: "鈴木 一般",   email: "suzuki@lifeup.jp", role: "general", department: "営業", job_type: "スタッフ" },
        { id: "demo-4", name: "山田 一般",   email: "yamada@lifeup.jp", role: "general", department: "HR", job_type: "スタッフ" },
      ],
    })
  }

  const role = await getRequestingUserRole()
  if (role !== "manager") {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  try {
    const result = await callSheets<{ users?: unknown[] }>("listUsers")
    return NextResponse.json({ users: result.users ?? [] })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "取得に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// PATCH /api/admin/users — 管理者のみ: ロール変更
export async function PATCH(request: NextRequest) {
  const { userId, newRole } = (await request.json()) as { userId: string; newRole: string }
  if (!userId || !["manager", "leader", "general"].includes(newRole)) {
    return NextResponse.json({ error: "無効なリクエストです" }, { status: 400 })
  }

  if (!isSheetsConfigured()) {
    return NextResponse.json({ success: true })
  }

  const role = await getRequestingUserRole()
  if (role !== "manager") {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  try {
    const result = await callSheets<{ success?: boolean; error?: string }>("updateRole", { userId, newRole })
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "更新に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
