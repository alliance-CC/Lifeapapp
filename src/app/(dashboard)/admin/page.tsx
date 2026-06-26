"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck, Users, ChevronDown, Check, AlertCircle, Loader2, RefreshCw, Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile, type UserRole } from "@/contexts/ProfileContext"
import toast from "react-hot-toast"

type UserEntry = {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  job_type: string
  avatar_url?: string | null
}

const roleConfig: Record<UserRole, { label: string; color: string; bg: string; border: string }> = {
  manager: { label: "管理者", color: "text-orange-300", bg: "bg-orange-500/15", border: "border-orange-500/30" },
  leader:  { label: "リーダー", color: "text-blue-300",   bg: "bg-blue-500/15",   border: "border-blue-500/30"   },
  general: { label: "一般",   color: "text-white/50",    bg: "bg-white/5",       border: "border-white/10"      },
}

function RoleBadge({ role }: { role: UserRole }) {
  const c = roleConfig[role]
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", c.color, c.bg, c.border)}>
      {c.label}
    </span>
  )
}

function RoleDropdown({
  userId, currentRole, onUpdate,
}: { userId: string; currentRole: UserRole; onUpdate: (id: string, role: UserRole) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const roles: UserRole[] = ["manager", "leader", "general"]

  const handleSelect = async (role: UserRole) => {
    if (role === currentRole) { setOpen(false); return }
    setSaving(true)
    setOpen(false)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole: role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onUpdate(userId, role)
      toast.success(`権限を「${roleConfig[role].label}」に変更しました`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "変更に失敗しました")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={saving}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm transition-all",
          roleConfig[currentRole].color, roleConfig[currentRole].bg, roleConfig[currentRole].border,
          "hover:opacity-80"
        )}
      >
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <>
            <span>{roleConfig[currentRole].label}</span>
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 z-20 bg-[#1f1f1f] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[120px]"
            >
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleSelect(r)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                    r === currentRole ? "bg-white/5" : "hover:bg-white/5",
                    roleConfig[r].color
                  )}
                >
                  <span>{roleConfig[r].label}</span>
                  {r === currentRole && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminPage() {
  const { isManager, loading: profileLoading } = useProfile()
  const [users, setUsers] = useState<UserEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUsers(data.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!profileLoading) fetchUsers()
  }, [profileLoading, fetchUsers])

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
  }

  const counts = {
    manager: users.filter((u) => u.role === "manager").length,
    leader:  users.filter((u) => u.role === "leader").length,
    general: users.filter((u) => u.role === "general").length,
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
      </div>
    )
  }

  if (!isManager) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-white font-semibold text-lg">アクセス権限がありません</p>
        <p className="text-white/40 text-sm">このページは管理者のみ閲覧できます</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
            ユーザー管理
          </h1>
          <p className="text-white/50 text-sm mt-1">アカウントの権限を管理できます（管理者専用）</p>
        </div>
        <motion.button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          更新
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { key: "manager" as UserRole, icon: Crown, label: "管理者" },
          { key: "leader"  as UserRole, icon: ShieldCheck, label: "リーダー" },
          { key: "general" as UserRole, icon: Users, label: "一般" },
        ]).map(({ key, icon: Icon, label }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white/5 border rounded-2xl p-4 flex items-center gap-3",
              roleConfig[key].border
            )}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", roleConfig[key].bg)}>
              <Icon className={cn("w-5 h-5", roleConfig[key].color)} />
            </div>
            <div>
              <p className="text-white font-bold text-xl">{counts[key]}</p>
              <p className="text-white/40 text-xs">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-white/40" />
          <h2 className="text-white/40 text-xs font-medium uppercase tracking-wider">
            メンバー一覧 ({users.length}名)
          </h2>
        </div>

        {loading ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors"
              >
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0",
                  user.role === "manager" ? "bg-orange-500/20 text-orange-300" :
                  user.role === "leader"  ? "bg-blue-500/20 text-blue-300" :
                  "bg-white/10 text-white/60"
                )}>
                  {user.name ? user.name.charAt(0) : "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm truncate">{user.name || "（名前なし）"}</p>
                    {user.role === "manager" && (
                      <Crown className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                  {user.department && (
                    <p className="text-white/30 text-xs">{user.department}{user.job_type ? ` · ${user.job_type}` : ""}</p>
                  )}
                </div>

                {/* Role selector */}
                <div className="flex-shrink-0">
                  <RoleDropdown
                    userId={user.id}
                    currentRole={user.role}
                    onUpdate={handleRoleUpdate}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Note */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-4 text-white/25 text-xs space-y-1">
        <p className="font-medium text-white/40">権限について</p>
        <p>・<span className="text-orange-300/60">管理者</span>: ユーザー管理・全機能にアクセス可能</p>
        <p>・<span className="text-blue-300/60">リーダー</span>: チーム管理・承認機能にアクセス可能</p>
        <p>・<span className="text-white/40">一般</span>: 標準機能のみ使用可能</p>
        <p className="mt-2 text-white/20">※ 最後の管理者アカウントの権限は変更できません</p>
      </div>
    </div>
  )
}
