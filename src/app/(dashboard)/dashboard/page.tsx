"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  Users,
  Star,
  Coins,
  Flame,
  Award,
  ChevronRight,
  MessageCircle,
  Zap,
  Shield,
  Trophy,
  Crown,
} from "lucide-react"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const expData = [
  { day: "月", exp: 120 },
  { day: "火", exp: 380 },
  { day: "水", exp: 220 },
  { day: "木", exp: 450 },
  { day: "金", exp: 310 },
  { day: "土", exp: 180 },
  { day: "日", exp: 90 },
]

const rankingData = [
  { name: "田中 太郎", department: "営業部", exp: 2840, rank: "S", color: "from-orange-400 to-orange-600" },
  { name: "佐藤 花子", department: "HR部", exp: 2210, rank: "A", color: "from-zinc-300 to-zinc-400" },
  { name: "鈴木 一郎", department: "総務部", exp: 1980, rank: "A", color: "from-zinc-300 to-zinc-500" },
  { name: "山田 美咲", department: "営業部", exp: 1650, rank: "B", color: "from-gray-500 to-gray-600" },
]

const statsCards = [
  { label: "今月の経験値", value: "1,580 EXP", icon: Star, color: "from-orange-500 to-orange-600", change: "+12%" },
  { label: "総ラッピーコイン", value: "3,240 枚", icon: Coins, color: "from-orange-500 to-amber-500", change: "+8%" },
  { label: "連続ログイン", value: "15 日", icon: Flame, color: "from-orange-500 to-amber-600", change: "継続中" },
  { label: "今月のランク", value: "A ランク", icon: Award, color: "from-zinc-400 to-zinc-500", change: "維持中" },
]

const achievements = [
  { id: 1, icon: "🔥", label: "15日連続", unlocked: true },
  { id: 2, icon: "💬", label: "AI会話50回", unlocked: true },
  { id: 3, icon: "📊", label: "日報30日", unlocked: true },
  { id: 4, icon: "🏆", label: "月間TOP3", unlocked: false },
  { id: 5, icon: "⭐", label: "Sランク", unlocked: false },
  { id: 6, icon: "💎", label: "1万EXP", unlocked: false },
]

// Circular progress ring component
function LevelRing({ level, exp, maxExp, progress }: { level: number; exp: number; maxExp: number; progress: number }) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStrokeDashoffset(circumference * (1 - progress / 100))
    }, 300)
    return () => clearTimeout(timer)
  }, [circumference, progress])

  return (
    <div className="relative flex items-center justify-center">
      {/* Background particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-orange-400/60"
          style={{
            top: `${20 + Math.sin((i / 6) * Math.PI * 2) * 55}%`,
            left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 45}%`,
          }}
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <svg width="160" height="160" className="transform -rotate-90">
        {/* Track */}
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        {/* Progress */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="url(#expGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="expGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.div
          className="text-4xl font-black text-white"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {level}
        </motion.div>
        <div className="text-white/40 text-xs">LEVEL</div>
        <div className="mt-1">
          <motion.div
            className="text-orange-400 text-xs font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {progress}%
          </motion.div>
        </div>
      </div>

      {/* Level up button trigger (for demo) */}
      <button
        onClick={() => setShowLevelUp(true)}
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-orange-400/50 hover:text-orange-400 transition-colors whitespace-nowrap"
      >
        LV UP demo
      </button>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setShowLevelUp(false), 2500)}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: ["#f97316", "#fbbf24", "#fff", "#fb923c"][i % 4] }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            ))}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0.3, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <div className="text-8xl mb-4">⭐</div>
              <div className="text-5xl font-black text-white drop-shadow-2xl">LEVEL UP!</div>
              <div className="text-2xl text-orange-400 font-bold mt-2">Lv. {level} → Lv. {level + 1}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Rank badge component
function RankBadge({ rank, size = "md" }: { rank: string; size?: "sm" | "md" | "lg" }) {
  const rankConfig = {
    S: { gradient: "from-orange-400 via-amber-300 to-orange-600", glow: "shadow-orange-500/50", label: "S RANK" },
    A: { gradient: "from-zinc-200 via-white to-zinc-400", glow: "shadow-white/30", label: "A RANK" },
    B: { gradient: "from-zinc-400 via-zinc-300 to-zinc-600", glow: "shadow-zinc-400/30", label: "B RANK" },
    C: { gradient: "from-gray-500 via-gray-400 to-gray-600", glow: "shadow-gray-500/30", label: "C RANK" },
  }
  const config = rankConfig[rank as keyof typeof rankConfig] ?? rankConfig.C
  const sizeClasses = { sm: "text-sm px-2 py-0.5", md: "text-base px-3 py-1", lg: "text-3xl px-5 py-2" }

  return (
    <motion.div
      className={`bg-gradient-to-r ${config.gradient} ${sizeClasses[size]} rounded-lg font-black text-white shadow-lg ${config.glow} inline-block`}
      whileHover={{ scale: 1.05 }}
      animate={rank === "S" ? { boxShadow: ["0 0 10px #f97316", "0 0 25px #f97316", "0 0 10px #f97316"] } : {}}
      transition={rank === "S" ? { duration: 1.5, repeat: Infinity } : {}}
    >
      {config.label}
    </motion.div>
  )
}

export default function DashboardPage() {
  const currentExp = 2580
  const nextLevelExp = 3000
  const progress = Math.round((currentExp / nextLevelExp) * 100)

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
          <p className="text-white/50 text-sm mt-1">6月25日（水）2024</p>
        </div>
        <Link href="/chat">
          <motion.button
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg shadow-orange-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-4 h-4" />
            AIに話しかける
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-all"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">{card.change}</span>
              </div>
              <p className="text-white font-bold text-lg">{card.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{card.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exp Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              今週の経験値推移
            </h2>
            <span className="text-white/40 text-sm">今週合計: 1,750 EXP</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={expData}>
              <defs>
                <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#262626", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, color: "#fff" }}
              />
              <Area type="monotone" dataKey="exp" stroke="#f97316" strokeWidth={2.5} fill="url(#expGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Level Card - Gamified */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-600/20 to-amber-600/10 border border-orange-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          {/* Background sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-400/40"
              style={{ top: `${10 + i * 18}%`, left: `${5 + i * 22}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}

          <LevelRing level={24} exp={currentExp} maxExp={nextLevelExp} progress={progress} />

          <div className="mt-4 space-y-1 w-full">
            <div className="flex justify-between text-xs text-white/50">
              <span>{currentExp.toLocaleString()} EXP</span>
              <span>{nextLevelExp.toLocaleString()} EXP</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </div>
            <p className="text-orange-400 text-xs font-medium mt-2 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" />
              あと {(nextLevelExp - currentExp).toLocaleString()} EXP でLV UP!
            </p>
          </div>

          {/* Current rank badge */}
          <div className="mt-4">
            <RankBadge rank="A" size="md" />
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-400" />
            実績・バッジ
          </h2>
          <span className="text-white/40 text-sm">3 / 6 解放済み</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                ach.unlocked
                  ? "border-orange-500/30 bg-orange-500/10"
                  : "border-white/5 bg-white/3 opacity-40 grayscale"
              }`}
              whileHover={ach.unlocked ? { scale: 1.05, y: -2 } : {}}
            >
              <span className="text-2xl">{ach.icon}</span>
              <span className="text-white/70 text-xs text-center leading-tight">{ach.label}</span>
              {ach.unlocked && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-orange-400"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ranking Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            今月のランキング
          </h2>
          <Link href="/ranking" className="flex items-center gap-1 text-orange-400 text-sm hover:text-orange-300">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {rankingData.map((entry, i) => (
            <motion.div
              key={entry.name}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center justify-center w-7">
                {i === 0 ? (
                  <Crown className="w-5 h-5 text-orange-400" />
                ) : (
                  <span className="text-white/40 font-bold text-sm">{i + 1}</span>
                )}
              </div>
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${entry.color} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                {entry.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{entry.name}</p>
                <p className="text-white/40 text-xs">{entry.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">{entry.exp.toLocaleString()} EXP</span>
                <RankBadge rank={entry.rank} size="sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
