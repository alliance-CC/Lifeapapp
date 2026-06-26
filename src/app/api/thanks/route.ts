import { NextRequest, NextResponse } from "next/server"
import { callSheets, isSheetsConfigured } from "@/lib/sheets/client"
import { getSessionUserId } from "@/lib/sheets/auth"

// GET /api/thanks — サンクス & 事例の一覧
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "thanks"
  if (!isSheetsConfigured()) return NextResponse.json({ items: [] })

  try {
    if (type === "case") {
      const result = await callSheets<{ cases?: unknown[] }>("listCases")
      return NextResponse.json({ items: result.cases ?? [] })
    }
    const result = await callSheets<{ thanks?: unknown[] }>("listThanks")
    return NextResponse.json({ items: result.thanks ?? [] })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "取得に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// POST /api/thanks — サンクスメッセージ or 事例共有を送信
export async function POST(request: NextRequest) {
  const body = await request.json()
  const userId = await getSessionUserId()

  if (!isSheetsConfigured()) {
    return NextResponse.json({ success: true, demo: true })
  }
  if (!userId) return NextResponse.json({ error: "未ログインです" }, { status: 401 })

  try {
    const me = await callSheets<{ user?: { name?: string } | null }>("getUserById", { userId })
    const fromName = me.user?.name ?? ""

    if (body.type === "case") {
      const result = await callSheets<{ case?: unknown; error?: string }>("addCase", {
        userId, userName: fromName,
        category: body.category, title: body.title,
        content: body.content, result: body.result ?? "",
      })
      if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
      return NextResponse.json({ item: result.case })
    }

    const result = await callSheets<{ thanks?: unknown; error?: string }>("addThanks", {
      fromUserId: userId, fromName,
      toUserId: body.toUserId ?? "", toName: body.toName ?? "",
      category: body.category, message: body.message,
      points: body.points ?? 0,
    })
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ item: result.thanks })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "送信に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
