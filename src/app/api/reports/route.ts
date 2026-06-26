import { NextRequest, NextResponse } from "next/server"
import { callSheets, isSheetsConfigured } from "@/lib/sheets/client"
import { getSessionUserId } from "@/lib/sheets/auth"

// GET /api/reports — 自分の日報一覧
export async function GET() {
  const userId = await getSessionUserId()
  if (!isSheetsConfigured()) return NextResponse.json({ reports: [] })
  if (!userId) return NextResponse.json({ error: "未ログインです" }, { status: 401 })

  try {
    const result = await callSheets<{ reports?: unknown[] }>("listReports", { userId })
    return NextResponse.json({ reports: result.reports ?? [] })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "取得に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// POST /api/reports — 日報を提出
export async function POST(request: NextRequest) {
  const { good, bad, badCause, aiAdvice } = await request.json()
  const userId = await getSessionUserId()

  if (!isSheetsConfigured()) {
    return NextResponse.json({ report: { id: "demo", expEarned: 50 }, demo: true })
  }
  if (!userId) return NextResponse.json({ error: "未ログインです" }, { status: 401 })

  try {
    const me = await callSheets<{ user?: { name?: string } | null }>("getUserById", { userId })
    const result = await callSheets<{ report?: unknown; error?: string }>("addReport", {
      userId,
      userName: me.user?.name ?? "",
      date: new Date().toISOString().slice(0, 10),
      good, bad, badCause, aiAdvice: aiAdvice ?? "", expEarned: 50,
    })
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ report: result.report })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "提出に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
