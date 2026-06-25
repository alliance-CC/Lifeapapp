"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, BookOpen, Send, Star, Users, Smile, Target, Lightbulb, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

type Tab = "thanks" | "case"

const recipients = [
  { id: "1", name: "田中 太郎", dept: "営業部", color: "from-orange-400 to-orange-600" },
  { id: "2", name: "佐藤 花子", dept: "HR部", color: "from-zinc-300 to-zinc-400" },
  { id: "3", name: "鈴木 一郎", dept: "総務部", color: "from-zinc-400 to-zinc-500" },
  { id: "4", name: "山田 美咲", dept: "営業部", color: "from-amber-400 to-amber-600" },
  { id: "5", name: "伊藤 健太", dept: "技術部", color: "from-gray-400 to-gray-600" },
]

const thankCategories = [
  { id: "thanks", label: "感謝", icon: Heart, color: "text-orange-400" },
  { id: "cheer", label: "応援", icon: Star, color: "text-amber-400" },
  { id: "praise", label: "称賛", icon: Smile, color: "text-green-400" },
]

const caseCategories = [
  { id: "sales", label: "営業" },
  { id: "hr", label: "HR" },
  { id: "tech", label: "技術" },
  { id: "general", label: "総務" },
  { id: "service", label: "CS" },
]

const recentThanks = [
  { from: "佐藤 花子", to: "田中 太郎", category: "称賛", message: "先日のプレゼン、とても分かりやすくて参考になりました！次回も楽しみにしています。", time: "2時間前", exp: 50 },
  { from: "鈴木 一郎", to: "山田 美咲", category: "感謝", message: "急なお願いにも快く対応してくれてありがとう。本当に助かりました！", time: "5時間前", exp: 30 },
  { from: "山田 美咲", to: "伊藤 健太", category: "応援", message: "新プロジェクト頑張ってください！応援しています！", time: "1日前", exp: 20 },
]

const recentCases = [
  {
    author: "田中 太郎",
    dept: "営業部",
    category: "営業",
    title: "新規顧客獲得: 丁寧なヒアリングで成約率2倍",
    content: "相手の課題をしっかり把握することで、的確な提案ができ成約率が向上した事例。",
    result: "成約率: 従来比 +120%",
    likes: 24,
    time: "3時間前",
  },
  {
    author: "佐藤 花子",
    dept: "HR部",
    category: "HR",
    title: "入社オンボーディング改善: 離職率30%削減",
    content: "1on1頻度を増やしメンターをつけることで、入社後3ヶ月の定着率が大幅改善。",
    result: "離職率: -30%",
    likes: 18,
    time: "1日前",
  },
]

export default function ThanksPage() {
  const [tab, setTab] = useState<Tab>("thanks")
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [thankCategory, setThankCategory] = useState("thanks")
  const [message, setMessage] = useState("")
  const [points, setPoints] = useState(10)

  // Case study form
  const [caseTitle, setCaseTitle] = useState("")
  const [caseCategory, setCaseCategory] = useState("sales")
  const [caseContent, setCaseContent] = useState("")
  const [caseResult, setCaseResult] = useState("")

  const handleSendThanks = () => {
    if (!selectedRecipient || !message.trim()) {
      toast.error("送信先とメッセージを入力してください")
      return
    }
    const recipient = recipients.find((r) => r.id === selectedRecipient)
    toast.success(`${recipient?.name}さんにサンクスメッセージを送りました！ +${points} EXP 獲得`)
    setMessage("")
    setSelectedRecipient("")
  }

  const handlePostCase = () => {
    if (!caseTitle.trim() || !caseContent.trim()) {
      toast.error("タイトルと内容を入力してください")
      return
    }
    toast.success("事例を共有しました！ +100 EXP 獲得")
    setCaseTitle("")
    setCaseContent("")
    setCaseResult("")
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-orange-400" />
          サンクス & 事例共有
        </h1>
        <p className="text-white/50 text-sm mt-1">感謝を伝えよう・成功体験を共有しよう</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {([
          { key: "thanks" as Tab, label: "サンクスメッセージ", icon: Heart },
          { key: "case" as Tab, label: "事例共有", icon: BookOpen },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
              tab === key ? "text-white" : "text-white/50 hover:text-white/80"
            )}
          >
            {tab === key && (
              <motion.div
                layoutId="thanksTab"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "thanks" ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Send form */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4 text-orange-400" />
                  メッセージを送る
                </h3>

                {/* Recipient */}
                <div>
                  <label className="text-white/60 text-xs mb-2 block">送り先</label>
                  <div className="grid grid-cols-1 gap-2">
                    {recipients.map((r) => (
                      <motion.button
                        key={r.id}
                        onClick={() => setSelectedRecipient(r.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                          selectedRecipient === r.id
                            ? "border-orange-500/50 bg-orange-500/10"
                            : "border-white/10 bg-white/3 hover:bg-white/5"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{r.name}</p>
                          <p className="text-white/40 text-xs">{r.dept}</p>
                        </div>
                        {selectedRecipient === r.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-white/60 text-xs mb-2 block">カテゴリ</label>
                  <div className="flex gap-2">
                    {thankCategories.map(({ id, label, icon: Icon, color }) => (
                      <button
                        key={id}
                        onClick={() => setThankCategory(id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                          thankCategory === id
                            ? "border-orange-500/50 bg-orange-500/15 text-white"
                            : "border-white/10 text-white/50 hover:text-white/80"
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5", color)} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-white/60 text-xs mb-2 block">メッセージ</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="感謝の気持ちを伝えましょう..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                  <p className="text-white/30 text-xs mt-1 text-right">{message.length} / 200</p>
                </div>

                {/* Points */}
                <div>
                  <label className="text-white/60 text-xs mb-2 block">贈るポイント: <span className="text-orange-400 font-semibold">{points} pt</span></label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-white/30 text-xs mt-1">
                    <span>5pt</span><span>50pt</span>
                  </div>
                </div>

                <motion.button
                  onClick={handleSendThanks}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  送信する (+{points} EXP 獲得)
                </motion.button>
              </div>
            </div>

            {/* Recent thanks feed */}
            <div className="space-y-3">
              <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                最近のサンクス
              </h3>
              {recentThanks.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm font-medium">{t.from}</span>
                      <ChevronRight className="w-3 h-3 text-white/30" />
                      <span className="text-orange-400 text-sm font-medium">{t.to}</span>
                    </div>
                    <span className="text-white/30 text-xs">{t.time}</span>
                  </div>
                  <p className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 w-fit">{t.category}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{t.message}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-400 text-xs">+{t.exp} EXP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="case"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Case study form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-400" />
                事例を投稿する
              </h3>

              {/* Category */}
              <div>
                <label className="text-white/60 text-xs mb-2 block">部門カテゴリ</label>
                <div className="flex gap-2 flex-wrap">
                  {caseCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCaseCategory(c.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                        caseCategory === c.id
                          ? "border-orange-500/50 bg-orange-500/15 text-white"
                          : "border-white/10 text-white/50 hover:text-white/80"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-white/60 text-xs mb-2 block">タイトル</label>
                <input
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="例: 新規顧客獲得で成約率2倍を達成"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-white/60 text-xs mb-2 block">内容・取り組み</label>
                <textarea
                  value={caseContent}
                  onChange={(e) => setCaseContent(e.target.value)}
                  rows={4}
                  placeholder="どんな課題があり、どのように取り組みましたか？"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-orange-500/50 resize-none"
                />
              </div>

              {/* Result */}
              <div>
                <label className="text-white/60 text-xs mb-2 block flex items-center gap-1">
                  <Target className="w-3 h-3 text-orange-400" />
                  結果・成果
                </label>
                <input
                  value={caseResult}
                  onChange={(e) => setCaseResult(e.target.value)}
                  placeholder="例: 成約率 +20%、コスト削減 -15万円"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <motion.button
                onClick={handlePostCase}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen className="w-4 h-4" />
                事例を投稿する (+100 EXP 獲得)
              </motion.button>
            </div>

            {/* Case study feed */}
            <div className="space-y-4">
              <h3 className="text-white/60 text-sm font-medium">最近の共有事例</h3>
              {recentCases.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/8 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 mr-2">{c.category}</span>
                      <span className="text-white/30 text-xs">{c.time}</span>
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-sm">{c.title}</h4>
                  <p className="text-white/60 text-xs leading-relaxed">{c.content}</p>
                  {c.result && (
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Target className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <span className="text-green-400 text-xs font-medium">{c.result}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${recipients[0].color} flex items-center justify-center text-white text-xs font-bold`}>
                        {c.author[0]}
                      </div>
                      <span className="text-white/50 text-xs">{c.author} · {c.dept}</span>
                    </div>
                    <button className="flex items-center gap-1 text-white/40 hover:text-orange-400 transition-colors text-xs">
                      <Heart className="w-3.5 h-3.5" />
                      {c.likes}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
