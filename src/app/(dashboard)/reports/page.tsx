"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Plus, ChevronDown, Bot, CheckCircle, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface Report {
  id: string
  date: string
  good: string
  bad: string
  badCause: string
  aiAdvice: string
  expEarned: number
}

const pastReports: Report[] = [
  {
    id: "1",
    date: "2024-06-24",
    good: "新規顧客へのプレゼンがうまくいった。顧客から高評価を得た。",
    bad: "書類の提出が遅れてしまった。",
    badCause: "タスク管理が不十分で優先順位を間違えた。",
    aiAdvice: "タスク管理について振り返る良い機会ですね。明日は朝一番に今日のタスクをリストアップして優先順位を決める習慣をつけてみましょう。",
    expEarned: 50,
  },
  {
    id: "2",
    date: "2024-06-23",
    good: "チームミーティングでアイデアを積極的に発言できた。",
    bad: "顧客への折り返し電話を忘れてしまった。",
    badCause: "メモを取らずに記憶に頼りすぎた。",
    aiAdvice: "顧客対応での失敗は次に活かすことが大切です。今日から電話メモシートを活用して、すべてのToDoを記録する習慣をつけましょう。",
    expEarned: 50,
  },
]

export default function ReportsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [good, setGood] = useState("")
  const [bad, setBad] = useState("")
  const [badCause, setBadCause] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!good.trim() || !bad.trim() || !badCause.trim()) {
      toast.error("すべての項目を入力してください")
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setIsCreating(false)
    setGood("")
    setBad("")
    setBadCause("")
    toast.success("日報を提出しました！ +50 EXP 獲得")
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-violet-400" />
            日報
          </h1>
          <p className="text-white/50 text-sm mt-1">1日の振り返りを記録しよう</p>
        </div>
        <motion.button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium px-4 py-2 rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          今日の日報
        </motion.button>
      </motion.div>

      {/* New Report Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-violet-500/20 rounded-2xl p-6 space-y-4 overflow-hidden"
          >
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4 text-violet-400" />
              本日の日報（{new Date().toLocaleDateString("ja-JP")}）
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-green-400 text-sm font-medium flex items-center gap-1 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  よかったこと
                </label>
                <textarea
                  value={good}
                  onChange={(e) => setGood(e.target.value)}
                  placeholder="今日うまくいったこと、達成できたことを書いてください..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-green-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-red-400 text-sm font-medium flex items-center gap-1 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  よくなかったこと
                </label>
                <textarea
                  value={bad}
                  onChange={(e) => setBad(e.target.value)}
                  placeholder="改善が必要なこと、失敗したことを書いてください..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-red-500/50 transition-all"
                />
              </div>

              <div>
                <label className="text-orange-400 text-sm font-medium mb-2 block">
                  よくなかった原因（必須）
                </label>
                <textarea
                  value={badCause}
                  onChange={(e) => setBadCause(e.target.value)}
                  placeholder="なぜそうなったのか、原因を自分なりに分析してください..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white/80 text-sm transition-all"
              >
                キャンセル
              </button>
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "AIがアドバイス中..." : "提出する (+50 EXP)"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past Reports */}
      <div className="space-y-3">
        <h2 className="text-white/50 text-sm font-medium">過去の日報</h2>
        {pastReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/3 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">
                  {new Date(report.date).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
                </p>
                <p className="text-white/40 text-xs truncate">{report.good}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full">+{report.expEarned} EXP</span>
                <motion.div animate={{ rotate: expandedId === report.id ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-white/40" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {expandedId === report.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                    <div>
                      <p className="text-green-400 text-xs font-medium mb-1">✓ よかったこと</p>
                      <p className="text-white/70 text-sm">{report.good}</p>
                    </div>
                    <div>
                      <p className="text-red-400 text-xs font-medium mb-1">✗ よくなかったこと</p>
                      <p className="text-white/70 text-sm">{report.bad}</p>
                    </div>
                    <div>
                      <p className="text-orange-400 text-xs font-medium mb-1">原因分析</p>
                      <p className="text-white/70 text-sm">{report.badCause}</p>
                    </div>
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 flex gap-3">
                      <Bot className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-violet-400 text-xs font-medium mb-1">AIアドバイス</p>
                        <p className="text-white/70 text-sm">{report.aiAdvice}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
