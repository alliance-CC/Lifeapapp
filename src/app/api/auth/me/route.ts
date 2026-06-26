import { NextResponse } from "next/server"
import { callSheets, isSheetsConfigured } from "@/lib/sheets/client"
import { getSessionUserId } from "@/lib/sheets/auth"

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  // デモモード
  if (!isSheetsConfigured()) {
    return NextResponse.json({
      user: {
        id: "demo-user", name: "デモユーザー", email: "demo@lifeup.jp",
        role: "manager", department: "経営", job_type: "代表",
        level: 24, experience: 2860,
      },
    })
  }

  try {
    const result = await callSheets<{ user?: Record<string, unknown> | null }>("getUserById", { userId })
    return NextResponse.json({ user: result.user ?? null })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
