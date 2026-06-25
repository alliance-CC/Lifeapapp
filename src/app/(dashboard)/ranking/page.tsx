"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Crown, Medal, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const rankColors = {
  S: "from-orange-400 to-orange-600",
  A: "from-zinc-200 to-zinc-400",
  B: "from-zinc-400 to-zinc-500",
  C: "from-gray-500 to-gray-600",
  D: "from-gray-600 to-gray-700",
}

const rankingData = [
  { rank: 1, name: "田中 太郎", dept: "営業部", level: 42, exp: 15840, monthlyExp: 2840, rankBadge: "S", trend: "up" },
  { rank: 2, name: "佐藤 花子", dept: "HR部", level: 38, exp: 13210, monthlyExp: 2210, rankBadge: "A", trend: "up" },
  { rank: 3, name: "鈴木 一郎", dept: "総務部", level: 35, exp: 11980, monthlyExp: 1980, rankBadge: "A", trend: "same" },
  { rank: 4, name: "山田 美咲", dept: "営業部", level: 31, exp: 9650, monthlyExp: 1650, rankBadge: "B", trend: "up" },
  { rank: 5, name: "伊藤 健太", dept: "技術部", level: 28, exp: 8420, monthlyExp: 1420, rankBadge: "B", trend: "down" },
  { rank: 6, name: "渡辺 えりか", dept: "営業部", level: 25, exp: 7100, monthlyExp: 1100, rankBadge: "B", trend: "up" },
  { rank: 7, name: "中村 大輔", dept: "HR部", level: 22, exp: 5890, monthlyExp: 890, rankBadge: "C", trend: "down" },
  { rank: 8, name: "小林 真由", dept: "総務部", level: 19, exp: 4650, monthlyExp: 650, rankBadge: "C", trend: "same" },
  { rank: 9, name: "加藤 武史", dept: "技術部", level: 15, exp: 3200, monthlyExp: 420, rankBadge: "D", trend: "up" },
  { rank: 10, name: "吉田 里奈", dept: "営業部", level: 12, exp: 2100, monthlyExp: 210, rankBadge: "D", trend: "same" },
]

export default function RankingPage() {
  const [view, setView] = useState<"monthly" | "total">("monthly")

  const top3 = rankingData.slice(0, 3)
  const rest = rankingData.slice(3)

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-orange-400" />
          ランキング
        </h1>
        <p className="text-white/50 text-sm mt-1">2024年6月 月間ランキング</p>
      </motion.div>

      {/* Tab */}
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
        {(["monthly", "total"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm transition-all",
              view === v ? "bg-orange-600 text-white font-medium" : "text-white/50 hover:text-white/80"
            )}
          >
            {v === "monthly" ? "今月" : "累計"}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-end justify-center gap-4 py-6"
      >
        {/* 2nd */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xl mb-2 border-2 border-gray-400/50">
            {top3[1].name[0]}
          </div>
          <p className="text-white text-xs font-medium text-center w-20 truncate">{top3[1].name}</p>
          <p className="text-white/40 text-xs">{top3[1].monthlyExp.toLocaleString()} EXP</p>
          <div className="w-20 h-20 bg-gray-500/20 border border-gray-500/30 rounded-t-xl mt-2 flex items-end justify-center pb-2">
            <Medal className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* 1st */}
        <div className="flex flex-col items-center -mb-0">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl mb-2 border-4 border-orange-400/50 shadow-lg shadow-orange-500/30"
          >
            {top3[0].name[0]}
          </motion.div>
          <Crown className="w-5 h-5 text-orange-400 mb-1" />
          <p className="text-white text-sm font-bold text-center">{top3[0].name}</p>
          <p className="text-orange-400 text-xs">{top3[0].monthlyExp.toLocaleString()} EXP</p>
          <div className="w-24 h-28 bg-orange-500/20 border border-orange-500/30 rounded-t-xl mt-2 flex items-end justify-center pb-2">
            <Trophy className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        {/* 3rd */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-lg mb-2 border-2 border-gray-500/50">
            {top3[2].name[0]}
          </div>
          <p className="text-white text-xs font-medium text-center w-20 truncate">{top3[2].name}</p>
          <p className="text-white/40 text-xs">{top3[2].monthlyExp.toLocaleString()} EXP</p>
          <div className="w-16 h-14 bg-gray-600/20 border border-gray-600/30 rounded-t-xl mt-2 flex items-end justify-center pb-2">
            <Medal className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Rest of ranking */}
      <div className="space-y-2">
        {rest.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/8 transition-all"
          >
            <span className="w-6 text-center text-white/40 font-bold">{entry.rank}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-bold">
              {entry.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{entry.name}</p>
              <p className="text-white/40 text-xs">{entry.dept} · Lv.{entry.level}</p>
            </div>
            <span className="text-white/60 text-sm">{entry.monthlyExp.toLocaleString()} EXP</span>
            <div className="flex items-center gap-2">
              {entry.trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
              {entry.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
              {entry.trend === "same" && <Minus className="w-4 h-4 text-white/30" />}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${rankColors[entry.rankBadge as keyof typeof rankColors]} text-white`}>
                {entry.rankBadge}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
