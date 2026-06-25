"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  Star,
  Coins,
  Flame,
  Award,
  ChevronRight,
  MessageCircle
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
  { name: "田中 太郎", department: "営業部", exp: 2840, rank: "S", color: "from-yellow-400 to-orange-500" },
  { name: "佐藤 花子", department: "HR部", exp: 2210, rank: "A", color: "from-violet-400 to-purple-500" },
  { name: "鈴木 一郎", department: "総務部", exp: 1980, rank: "A", color: "from-blue-400 to-cyan-500" },
  { name: "山田 美咲", department: "営業部", exp: 1650, rank: "B", color: "from-green-400 to-emerald-500" },
]

const statsCards = [
  { label: "今月の経験値", value: "1,580 EXP", icon: Star, color: "from-yellow-500 to-orange-500", change: "+12%" },
  { label: "総ラッピーコイン", value: "3,240 枚", icon: Coins, color: "from-violet-500 to-pink-500", change: "+8%" },
  { label: "連続ログイン", value: "15 日", icon: Flame, color: "from-red-500 to-orange-500", change: "継続中" },
  { label: "今月のランク", value: "A ランク", icon: Award, color: "from-blue-500 to-cyan-500", change: "維持中" },
]

export default function DashboardPage() {
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
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg shadow-violet-500/30"
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
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">{card.change}</span>
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
              <TrendingUp className="w-5 h-5 text-violet-400" />
              今週の経験値推移
            </h2>
            <span className="text-white/40 text-sm">今週合計: 1,750 EXP</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={expData}>
              <defs>
                <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1635", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8, color: "#fff" }}
              />
              <Area type="monotone" dataKey="exp" stroke="#8b5cf6" strokeWidth={2} fill="url(#expGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 border border-violet-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
            <span className="text-3xl font-bold text-white">24</span>
          </div>
          <p className="text-white/50 text-sm">現在のレベル</p>
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>現在 2,580 EXP</span>
              <span>次 3,000 EXP</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "86%" }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-violet-400 text-xs mt-2">レベルアップまで 420 EXP</p>
          </div>
        </motion.div>
      </div>

      {/* Ranking Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            今月のランキング
          </h2>
          <Link href="/ranking" className="flex items-center gap-1 text-violet-400 text-sm hover:text-violet-300">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {rankingData.map((entry, i) => (
            <motion.div
              key={entry.name}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <span className="text-white/40 w-6 text-center font-bold">{i + 1}</span>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${entry.color} flex items-center justify-center text-white text-xs font-bold`}>
                {entry.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{entry.name}</p>
                <p className="text-white/40 text-xs">{entry.department}</p>
              </div>
              <span className="text-white/60 text-sm">{entry.exp.toLocaleString()} EXP</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${entry.color} text-white`}>
                {entry.rank}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
