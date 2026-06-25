"use client"

import { motion } from "framer-motion"
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const coinHistory = [
  { month: "1月", coins: 150 },
  { month: "2月", coins: 280 },
  { month: "3月", coins: 220 },
  { month: "4月", coins: 380 },
  { month: "5月", coins: 340 },
  { month: "6月", coins: 420 },
]

const transactions = [
  { id: 1, reason: "月間目標達成ボーナス", amount: +200, date: "2024-06-20", type: "earn" },
  { id: 2, reason: "日報提出", amount: +10, date: "2024-06-19", type: "earn" },
  { id: 3, reason: "サンクスメッセージ受信", amount: +15, date: "2024-06-18", type: "earn" },
  { id: 4, reason: "事例共有投稿", amount: +20, date: "2024-06-17", type: "earn" },
  { id: 5, reason: "社内ショップ利用", amount: -100, date: "2024-06-15", type: "spend" },
  { id: 6, reason: "新規顧客獲得ボーナス", amount: +150, date: "2024-06-10", type: "earn" },
]

export default function CoinsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          ラッピーコイン
        </h1>
        <p className="text-white/50 text-sm mt-1">社内通貨の残高と履歴</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/20 rounded-2xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-lg shadow-yellow-500/30"
        >
          <Coins className="w-10 h-10 text-white" />
        </motion.div>
        <p className="text-white/60 text-sm mb-1">現在の残高</p>
        <p className="text-5xl font-bold text-white mb-1">3,240</p>
        <p className="text-yellow-400 text-sm">ラッピーコイン</p>
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-white/10">
          <div>
            <p className="text-white font-bold text-xl">8,420</p>
            <p className="text-white/40 text-xs">累計獲得</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-white font-bold text-xl">5,180</p>
            <p className="text-white/40 text-xs">累計使用</p>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          月間獲得推移
        </h2>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={coinHistory}>
            <defs>
              <linearGradient id="coinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1a1635", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, color: "#fff" }} />
            <Area type="monotone" dataKey="coins" stroke="#f59e0b" strokeWidth={2} fill="url(#coinGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-violet-400" />
          取引履歴
        </h2>
        <div className="space-y-2">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-all"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === "earn" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                {tx.type === "earn" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm">{tx.reason}</p>
                <p className="text-white/30 text-xs">{new Date(tx.date).toLocaleDateString("ja-JP")}</p>
              </div>
              <span className={`font-bold text-sm ${tx.type === "earn" ? "text-green-400" : "text-red-400"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
