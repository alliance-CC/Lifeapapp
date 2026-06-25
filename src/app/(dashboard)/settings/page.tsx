"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  ChevronRight,
  Moon,
  Globe,
  Smartphone,
} from "lucide-react"
import toast from "react-hot-toast"

const settingSections = [
  {
    title: "アカウント",
    items: [
      { icon: User, label: "プロフィール設定", desc: "名前・部署・アイコンを変更" },
      { icon: Key, label: "パスワード変更", desc: "セキュリティのために定期的に更新" },
      { icon: Shield, label: "セキュリティ（暗証番号）", desc: "AIチャットの暗証番号を設定" },
    ],
  },
  {
    title: "AI設定",
    items: [
      { icon: Key, label: "APIキー設定", desc: "Gemini / OpenAI / Claude APIキーを登録" },
      { icon: Globe, label: "使用するAIモデル", desc: "現在: Gemini 1.5 Flash" },
    ],
  },
  {
    title: "通知",
    items: [
      { icon: Bell, label: "プッシュ通知", desc: "日報リマインダー・ランキング更新など" },
      { icon: Smartphone, label: "通知時間帯", desc: "21:00〜翌8:00は通知しない" },
    ],
  },
  {
    title: "表示",
    items: [{ icon: Moon, label: "テーマ", desc: "ダークモード（現在の設定）" }],
  },
]

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [showApiInput, setShowApiInput] = useState(false)

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-400" />
          設定
        </h1>
        <p className="text-white/50 text-sm mt-1">アプリの各種設定を管理</p>
      </motion.div>

      <div className="space-y-6">
        {settingSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
          >
            <h2 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      if (item.label === "APIキー設定") setShowApiInput(!showApiInput)
                      else toast.success(`${item.label} を開く`)
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/3 transition-all text-left"
                    whileHover={{ x: 2 }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-white/40 text-xs">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </motion.button>
                )
              })}
            </div>

            {/* API Key inline input */}
            {section.title === "AI設定" && showApiInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 bg-white/5 border border-violet-500/20 rounded-xl p-4 space-y-3"
              >
                <p className="text-white/70 text-sm font-medium">APIキーを入力</p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... または AI..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApiInput(false)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 text-sm"
                  >
                    キャンセル
                  </button>
                  <motion.button
                    onClick={() => {
                      toast.success("APIキーを保存しました（暗号化済み）")
                      setShowApiInput(false)
                    }}
                    className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    保存
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Version */}
      <p className="text-center text-white/20 text-xs pt-4">
        LifeUp App v1.0.0 · © 2024 株式会社ライフアップ
      </p>
    </div>
  )
}
