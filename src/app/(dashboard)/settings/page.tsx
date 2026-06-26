"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Palette,
  Image,
  X,
  Check,
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

const accentPresets = [
  { color: "#f97316", label: "オレンジ" },
  { color: "#ef4444", label: "レッド" },
  { color: "#8b5cf6", label: "パープル" },
  { color: "#3b82f6", label: "ブルー" },
  { color: "#10b981", label: "グリーン" },
  { color: "#f59e0b", label: "アンバー" },
]

const bgPresets = [
  { id: "none", label: "なし", gradient: "from-[#171717] via-[#262626] to-[#0a0a0a]" },
  { id: "circuit", label: "サイバー", gradient: "from-[#0a0a1a] via-[#0f172a] to-[#0a0a0a]" },
  { id: "forest", label: "フォレスト", gradient: "from-[#0a1a0a] via-[#0f2a15] to-[#0a0a0a]" },
  { id: "sunset", label: "サンセット", gradient: "from-[#1a0a0a] via-[#2a1505] to-[#0a0a0a]" },
]

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
      { icon: Key, label: "APIキー設定", desc: "Gemini（推奨）/ OpenAI APIキーを登録。キャラAI生成にも使用" },
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
]

export default function SettingsPage() {
  const { theme, updateTheme } = useTheme()
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("lifeup-ai-key") || localStorage.getItem("lifeup-openai-key") || ""
    return ""
  })
  const [showApiInput, setShowApiInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ファイルサイズは5MB以下にしてください")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      updateTheme({ bgImage: result })
      toast.success("背景画像を設定しました")
    }
    reader.readAsDataURL(file)
  }, [updateTheme])

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-400" />
          設定
        </h1>
        <p className="text-white/50 text-sm mt-1">アプリの各種設定を管理</p>
      </motion.div>

      {/* Design Customization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-white/40 text-xs font-medium uppercase tracking-wider px-1">デザインカスタマイズ</h2>

        {/* Accent Color */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.accentColor + "30", border: `1px solid ${theme.accentColor}40` }}>
              <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
            </div>
            <div>
              <p className="text-white text-sm font-medium">アクセントカラー</p>
              <p className="text-white/40 text-xs">UIのテーマカラーを変更</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {accentPresets.map((p) => (
              <button
                key={p.color}
                onClick={() => {
                  updateTheme({ accentColor: p.color })
                  toast.success(`${p.label}に変更しました`)
                }}
                className="flex flex-col items-center gap-1.5"
              >
                <motion.div
                  className={cn(
                    "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all",
                    theme.accentColor === p.color ? "border-white scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: p.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  {theme.accentColor === p.color && <Check className="w-4 h-4 text-white" />}
                </motion.div>
                <span className="text-white/40 text-xs">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Image */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center">
              <Image className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">背景画像</p>
              <p className="text-white/40 text-xs">カスタム背景を設定（最大5MB）</p>
            </div>
          </div>

          {/* Current background preview */}
          <div className="relative h-20 rounded-xl overflow-hidden border border-white/10">
            {theme.bgImage ? (
              <>
                <img src={theme.bgImage} alt="background" className="w-full h-full object-cover" style={{ opacity: theme.bgOpacity }} />
                <div className="absolute inset-0 bg-[#171717]" style={{ opacity: 1 - theme.bgOpacity }} />
                <button
                  onClick={() => {
                    updateTheme({ bgImage: null })
                    toast.success("背景画像を削除しました")
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/60 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#171717] via-[#262626] to-[#0a0a0a] flex items-center justify-center">
                <span className="text-white/20 text-xs">デフォルト背景</span>
              </div>
            )}
          </div>

          {/* Opacity slider */}
          {theme.bgImage && (
            <div>
              <label className="text-white/60 text-xs mb-2 block">
                背景の透明度: <span className="text-orange-400">{Math.round(theme.bgOpacity * 100)}%</span>
              </label>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={theme.bgOpacity}
                onChange={(e) => updateTheme({ bgOpacity: Number(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex gap-2">
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              画像をアップロード
            </motion.button>
            {theme.bgImage && (
              <motion.button
                onClick={() => {
                  updateTheme({ bgImage: null })
                  toast.success("背景を削除しました")
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm"
                whileHover={{ scale: 1.02 }}
              >
                削除
              </motion.button>
            )}
          </div>
        </div>

        {/* Glass Intensity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center">
              <Moon className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">ガラスエフェクト</p>
              <p className="text-white/40 text-xs">カードのすりガラス効果の強さ</p>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={theme.glassIntensity}
            onChange={(e) => updateTheme({ glassIntensity: Number(e.target.value) })}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-white/30 text-xs">
            <span>クリア</span><span>フロスト</span>
          </div>
        </div>
      </motion.div>

      {/* Other settings */}
      <div className="space-y-6">
        {settingSections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + si * 0.1 }}
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
                    <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-orange-400" />
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

            {section.title === "AI設定" && (
              <AnimatePresence>
                {showApiInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 bg-white/5 border border-orange-500/20 rounded-xl p-4 space-y-3 overflow-hidden"
                  >
                    <p className="text-white/70 text-sm font-medium">APIキーを入力</p>
                    <p className="text-white/40 text-xs">Gemini（AIza...）または OpenAI（sk-...）のキーに対応。キー種別は自動判定されます。</p>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIza... または sk-..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50"
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
                          localStorage.setItem("lifeup-ai-key", apiKey)
                          toast.success("APIキーを保存しました")
                          setShowApiInput(false)
                        }}
                        className="flex-1 py-2 rounded-lg bg-orange-600 text-white text-sm"
                        whileHover={{ scale: 1.02 }}
                      >
                        保存
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-center text-white/20 text-xs pt-4">
        LifeUp App v1.0.0 · © 2024 株式会社ライフアップ
      </p>
    </div>
  )
}
