"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  MessageCircle,
  Star,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  Coins,
  Menu,
  Sparkles,
  Heart,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useProfile } from "@/contexts/ProfileContext"

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/chat", label: "AIチャット", icon: MessageCircle },
  { href: "/thanks", label: "サンクス & 事例", icon: Heart },
  { href: "/character", label: "キャラクター", icon: Star },
  { href: "/ranking", label: "ランキング", icon: BarChart3 },
  { href: "/coins", label: "ラッピーコイン", icon: Coins },
  { href: "/reports", label: "日報", icon: FileText },
  { href: "/shifts", label: "シフト", icon: Calendar },
  { href: "/settings", label: "設定", icon: Settings },
]

const adminItem = { href: "/admin", label: "ユーザー管理", icon: ShieldCheck }

interface SidebarProps {
  accentColor?: string
}

export function Sidebar({ accentColor = "#f97316" }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isManager, profile } = useProfile()

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    toast.success("ログアウトしました")
    router.push("/login")
  }

  const renderNavItem = (item: { href: string; label: string; icon: React.ElementType }, isAdmin = false) => {
    const Icon = item.icon
    const active = pathname === item.href
    return (
      <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
        <motion.div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
            active ? "border" : "hover:bg-white/5"
          )}
          style={
            active
              ? {
                  background: isAdmin ? "rgba(249,115,22,0.12)" : `${accentColor}18`,
                  borderColor: isAdmin ? "rgba(249,115,22,0.35)" : `${accentColor}40`,
                }
              : {}
          }
          whileHover={{ x: 2 }}
        >
          <Icon
            className={cn("w-5 h-5 flex-shrink-0 transition-colors",
              active
                ? isAdmin ? "text-orange-400" : ""
                : "text-white/50 group-hover:text-white/80"
            )}
            style={active && !isAdmin ? { color: accentColor } : {}}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className={cn(
                  "text-sm whitespace-nowrap",
                  active ? "text-white font-medium" : "text-white/60 group-hover:text-white/90"
                )}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {active && (
            <motion.div
              className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: isAdmin ? "#f97316" : accentColor }}
              layoutId="activeIndicator"
            />
          )}
        </motion.div>
      </Link>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="font-bold text-white text-lg whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
            >
              LifeUp
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => renderNavItem(item))}

        {/* Manager-only admin link */}
        {isManager && (
          <>
            {!collapsed && (
              <div className="px-3 pt-3 pb-1">
                <p className="text-white/20 text-[10px] font-medium uppercase tracking-wider">管理者</p>
              </div>
            )}
            {collapsed && <div className="h-2" />}
            {renderNavItem(adminItem, true)}
          </>
        )}
      </nav>

      {/* Profile info + Logout */}
      <div className="p-2 space-y-1 border-t border-white/5">
        {/* Current user info (expanded only) */}
        <AnimatePresence>
          {!collapsed && profile && (
            <motion.div
              className="px-3 py-2 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/60 text-xs font-medium truncate">{profile.name}</p>
              <p className="text-white/25 text-[10px] truncate">{profile.email}</p>
              {profile.role === "manager" && (
                <span className="text-[10px] text-orange-400/70 font-medium">管理者</span>
              )}
              {profile.role === "leader" && (
                <span className="text-[10px] text-blue-400/70 font-medium">リーダー</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="text-sm whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                ログアウト
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col bg-[#171717]/80 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0"
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center z-10 shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft className="w-3 h-3 text-white" />
          </motion.div>
        </button>
        <SidebarContent />
      </motion.aside>

      {/* Mobile FAB */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`, boxShadow: `0 4px 20px ${accentColor}40` }}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#171717] border-r border-white/10 z-50 p-4"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
