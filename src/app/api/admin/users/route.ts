import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/client"

async function getRequestingUserRole(): Promise<string | null> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    return data?.role ?? null
  } catch {
    return null
  }
}

// GET /api/admin/users — manager only: list all users
export async function GET() {
  if (!isSupabaseConfigured()) {
    // Demo mode: return sample data
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
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("profiles")
      .select("id, name, email, role, department, job_type, avatar_url, created_at")
      .order("created_at", { ascending: true })

    if (error) throw error
    return NextResponse.json({ users: data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "取得に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// PATCH /api/admin/users — manager only: update a user's role
export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true })
  }

  const role = await getRequestingUserRole()
  if (role !== "manager") {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 })
  }

  const { userId, newRole } = await request.json() as { userId: string; newRole: string }
  if (!userId || !["manager", "leader", "general"].includes(newRole)) {
    return NextResponse.json({ error: "無効なリクエストです" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    // Prevent demoting the last manager
    if (newRole !== "manager") {
      const { count } = await admin
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "manager")
      if ((count ?? 0) <= 1) {
        const { data: target } = await admin.from("profiles").select("role").eq("id", userId).single()
        if (target?.role === "manager") {
          return NextResponse.json(
            { error: "最後の管理者アカウントの権限を変更することはできません" },
            { status: 400 }
          )
        }
      }
    }

    const { error } = await admin
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "更新に失敗しました"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
