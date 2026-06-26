"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star, Zap, Shield, Heart, Edit3, Palette, User, Shirt, Eye, Smile, Glasses,
  Shuffle, RotateCcw, Wand2, Loader2, CheckCircle2, ImagePlus, Sparkles, RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CharacterAvatar, type AvatarConfig, defaultAvatar } from "@/components/CharacterAvatar"
import { useTheme } from "@/contexts/ThemeContext"
import toast from "react-hot-toast"

// ─── Manual mode data ────────────────────────────────────────────────────────

const personalities = [
  { id: "cheerful", label: "明るい・元気", color: "from-orange-400 to-orange-600" },
  { id: "calm", label: "落ち着いた・知的", color: "from-zinc-300 to-zinc-500" },
  { id: "cool", label: "クール・カッコいい", color: "from-gray-400 to-slate-500" },
  { id: "gentle", label: "優しい・癒し系", color: "from-amber-400 to-amber-500" },
]

const faceShapes = [
  { id: 0, label: "標準" }, { id: 1, label: "丸顔" }, { id: 2, label: "面長" },
]

const skinTones = [
  { value: "#FCD9B6", label: "ライト" },
  { value: "#F2C29A", label: "ナチュラル" },
  { value: "#E0A878", label: "タン" },
  { value: "#C68642", label: "ブラウン" },
  { value: "#8D5524", label: "ダーク" },
]

const hairStyles = [
  { id: 0, label: "ショート" }, { id: 1, label: "ボブ" }, { id: 2, label: "ロング" },
  { id: 3, label: "ポニーテール" }, { id: 4, label: "ツインテール" },
  { id: 5, label: "ウェーブ" }, { id: 6, label: "お団子" }, { id: 7, label: "スパイキー" },
]

const hairColorPalette = [
  "#2b2320", "#3d2b1f", "#5c3a24", "#8B4513", "#a86d3c",
  "#c8a87a", "#d9c69e", "#ede3cf", "#f5f0e8", "#f97316",
  "#e0457b", "#8b5cf6", "#3b82f6", "#10b981", "#9ca3af", "#f8fafc",
]

const eyeStyles = [
  { id: 0, label: "ぱっちり" }, { id: 1, label: "クール" },
  { id: 2, label: "にっこり" }, { id: 3, label: "シャープ" },
]

const eyeColorPalette = [
  "#7a4a2b", "#5c3a24", "#3d2817", "#1f2937", "#3b6ea5",
  "#2e7d6b", "#6d4ca8", "#a8324a", "#b8860b", "#4b5563",
]

const eyebrowStyles = [
  { id: 0, label: "ソフト" }, { id: 1, label: "ストレート" }, { id: 2, label: "凛々しい" },
]

const mouthStyles = [
  { id: 0, label: "スマイル" }, { id: 1, label: "笑顔" },
  { id: 2, label: "ノーマル" }, { id: 3, label: "にゃっ" },
]

const outfitStyles = [
  { id: 0, label: "カジュアル" }, { id: 1, label: "フォーマル" },
  { id: 2, label: "スポーツ" }, { id: 3, label: "パーカー" }, { id: 4, label: "ブラウス" },
]

const outfitColorPalette = [
  "#f97316", "#fb923c", "#f59e0b", "#ef4444", "#ec4899",
  "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#171717",
  "#3f3f46", "#71717a", "#d4d4d8", "#f8fafc",
]

const accessories = [
  { id: 0, label: "なし" }, { id: 1, label: "メガネ" },
  { id: 2, label: "ピアス" }, { id: 3, label: "ヘアピン" },
]

type Section = "personality" | "face" | "hair" | "eyes" | "brows" | "mouth" | "outfit" | "extra"

const sectionConfig: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "personality", label: "性格", icon: User },
  { key: "face", label: "顔", icon: Palette },
  { key: "hair", label: "髪", icon: Edit3 },
  { key: "eyes", label: "目", icon: Eye },
  { key: "brows", label: "眉", icon: Smile },
  { key: "mouth", label: "口", icon: Smile },
  { key: "outfit", label: "服", icon: Shirt },
  { key: "extra", label: "小物", icon: Glasses },
]

// ─── AI mode data ────────────────────────────────────────────────────────────

const aiStyles = [
  { id: "pixar",     label: "ピクサー風",         emoji: "🎬" },
  { id: "ghibli",   label: "ジブリ風",           emoji: "🌿" },
  { id: "manga",    label: "漫画風",             emoji: "💬" },
  { id: "anime",    label: "アニメ風",           emoji: "✨" },
  { id: "chibi",    label: "ちびキャラ風",       emoji: "🐱" },
  { id: "game",     label: "ゲームアイコン風",   emoji: "🎮" },
  { id: "realistic",label: "リアル風",           emoji: "🖼️" },
  { id: "watercolor",label: "水彩画風",          emoji: "🎨" },
]

// ─── Shared sub-components ───────────────────────────────────────────────────

function Swatch({ color, active, onClick }: { color: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full border-2 transition-all",
        active ? "border-white scale-110 shadow-lg" : "border-white/20"
      )}
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
    />
  )
}

function OptionChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-xl border text-xs font-medium transition-all",
        active
          ? "border-orange-500/50 bg-orange-500/15 text-white"
          : "border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  )
}

function randInt(n: number) { return Math.floor(Math.random() * n) }
function pick<T>(arr: T[]): T { return arr[randInt(arr.length)] }

// ─── Page component ───────────────────────────────────────────────────────────

export default function CharacterPage() {
  const { theme, updateTheme } = useTheme()

  // Mode toggle
  const [mode, setMode] = useState<"manual" | "ai">("manual")

  // Manual mode state
  const [name, setName] = useState("ライフちゃん")
  const [activeSection, setActiveSection] = useState<Section>("personality")
  const [avatar, setAvatar] = useState<AvatarConfig>(defaultAvatar)

  // AI mode state
  const [aiStyle, setAiStyle] = useState("anime")
  const [aiDescription, setAiDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const updateAvatar = (partial: Partial<AvatarConfig>) =>
    setAvatar((prev) => ({ ...prev, ...partial }))

  const selectedPersonality = personalities.find((p) => p.id === avatar.personality)

  const randomize = () => {
    setAvatar({
      faceShape: randInt(3),
      skinTone: pick(skinTones).value,
      blush: Math.random() > 0.4,
      hairStyle: randInt(8),
      hairColor: pick(hairColorPalette),
      eyeStyle: randInt(4),
      eyeColor: pick(eyeColorPalette),
      eyebrowStyle: randInt(3),
      mouthStyle: randInt(4),
      outfitStyle: randInt(5),
      outfitColor: pick(outfitColorPalette),
      accessory: randInt(4),
      personality: pick(personalities).id,
    })
    toast.success("ランダム生成しました！", { icon: "🎲" })
  }

  const handleSaveManual = () => {
    updateTheme({ characterImage: null })
    toast.success("キャラクターを保存しました！ +30 EXP 獲得", { icon: "⭐" })
  }

  const generateAiCharacter = async () => {
    setIsGenerating(true)
    setGeneratedImage(null)
    setGenerationError(null)

    const apiKey =
      typeof window !== "undefined"
        ? localStorage.getItem("lifeup-ai-key") || localStorage.getItem("lifeup-openai-key") || ""
        : ""

    try {
      const res = await fetch("/api/generate-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: aiStyle, description: aiDescription, apiKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "生成に失敗しました")
      setGeneratedImage(data.url)
      toast.success("キャラクターを生成しました！", { icon: "✨" })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "生成に失敗しました"
      setGenerationError(msg)
      toast.error(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  const applyAiCharacter = () => {
    if (!generatedImage) return
    updateTheme({ characterImage: generatedImage })
    toast.success("AIキャラクターを設定しました！ +50 EXP 獲得", { icon: "🎉" })
  }

  // Which image to show in the preview panel
  const previewImage =
    mode === "ai" ? (generatedImage || theme.characterImage) : null
  const hasCharacterImage = !!theme.characterImage

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">キャラクター</h1>
          <p className="text-white/50 text-sm mt-1">あなただけのアバターを作ろう</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setMode("manual")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                mode === "manual"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <Palette className="w-3.5 h-3.5" />
              自分で作る
            </button>
            <button
              onClick={() => setMode("ai")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                mode === "ai"
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <Wand2 className="w-3.5 h-3.5" />
              AIで作る
            </button>
          </div>

          {mode === "manual" && (
            <>
              <motion.button
                onClick={randomize}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Shuffle className="w-4 h-4" />
                ランダム
              </motion.button>
              <motion.button
                onClick={() => { setAvatar(defaultAvatar); toast.success("リセットしました") }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <RotateCcw className="w-4 h-4" />
                リセット
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Character Preview ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center lg:sticky lg:top-6 self-start"
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {previewImage ? (
                  <motion.div
                    key="ai-image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <img
                      src={previewImage}
                      alt="AI generated character"
                      className="w-[200px] h-[200px] rounded-2xl object-cover border border-white/10"
                      style={{ filter: "drop-shadow(0 0 20px rgba(249,115,22,0.3))" }}
                    />
                  </motion.div>
                ) : mode === "ai" ? (
                  <motion.div
                    key="ai-placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-[200px] h-[200px] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-white/30"
                  >
                    <ImagePlus className="w-10 h-10" />
                    <span className="text-xs text-center">スタイルと説明を入力して<br />生成ボタンを押してください</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="svg-avatar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CharacterAvatar config={avatar} size={200} showGlow />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Level badge */}
            <div className="absolute bottom-6 -right-1 w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center border-2 border-white/20 shadow-lg z-10">
              <span className="text-white font-bold text-sm">24</span>
            </div>

            {/* AI badge when showing AI image */}
            {previewImage && (
              <div className="absolute top-2 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-1 border border-white/20 shadow-lg z-10">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="relative mb-2 w-full max-w-[240px]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold text-white text-center bg-transparent border-b border-white/20 focus:outline-none focus:border-orange-500/70 w-full px-2 pb-1"
            />
            <Edit3 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          </div>

          <div
            className={`px-3 py-1 rounded-full bg-gradient-to-r ${selectedPersonality?.color} text-white text-xs font-medium mb-6`}
          >
            {selectedPersonality?.label}
          </div>

          {/* Stats */}
          <div className="w-full space-y-3">
            {[
              { label: "レベル", value: 24, icon: Star, color: "from-orange-500 to-orange-600" },
              { label: "経験値", value: 86, icon: Zap, color: "from-orange-500 to-amber-500" },
              { label: "強さ", value: 72, icon: Shield, color: "from-zinc-400 to-zinc-500" },
              { label: "好感度", value: 95, icon: Heart, color: "from-amber-400 to-amber-500" },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <Icon className="w-3 h-3" />
                      {stat.label}
                    </span>
                    <span className="text-white/60">{stat.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Currently applied indicator */}
          {hasCharacterImage && (
            <div className="mt-4 w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-purple-300 text-xs">AIキャラクターが設定済み</span>
            </div>
          )}
        </motion.div>

        {/* ── Right: Manual Mode or AI Mode ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          {mode === "manual" ? (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Section tabs */}
              <div className="grid grid-cols-4 gap-1 bg-white/5 p-1 rounded-xl">
                {sectionConfig.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={cn(
                      "relative flex flex-col items-center gap-1 py-2 rounded-lg transition-colors text-xs",
                      activeSection === key ? "text-white" : "text-white/40 hover:text-white/70"
                    )}
                  >
                    {activeSection === key && (
                      <motion.div
                        layoutId="avatarSection"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>

              {/* Section content */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    {activeSection === "personality" && (
                      <div className="space-y-3">
                        <h3 className="text-white/70 text-sm font-medium">性格タイプ</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {personalities.map((p) => (
                            <motion.button
                              key={p.id}
                              onClick={() => updateAvatar({ personality: p.id })}
                              className={cn(
                                "p-3 rounded-xl border transition-all text-left",
                                avatar.personality === p.id
                                  ? "border-orange-500/50 bg-orange-500/10"
                                  : "border-white/10 hover:bg-white/5"
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`w-8 h-2 rounded-full bg-gradient-to-r ${p.color} mb-2`} />
                              <span className="text-white/80 text-xs font-medium">{p.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === "face" && (
                      <>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">輪郭</h3>
                          <div className="flex gap-2 flex-wrap">
                            {faceShapes.map((f) => (
                              <OptionChip key={f.id} label={f.label} active={avatar.faceShape === f.id} onClick={() => updateAvatar({ faceShape: f.id })} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">肌の色</h3>
                          <div className="flex gap-3 flex-wrap">
                            {skinTones.map((s) => (
                              <Swatch key={s.value} color={s.value} active={avatar.skinTone === s.value} onClick={() => updateAvatar({ skinTone: s.value })} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-white/70 text-sm">チーク（ほっぺ）</span>
                          <button
                            onClick={() => updateAvatar({ blush: !avatar.blush })}
                            className={cn("w-11 h-6 rounded-full transition-colors relative", avatar.blush ? "bg-orange-500" : "bg-white/15")}
                          >
                            <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" animate={{ left: avatar.blush ? 22 : 2 }} />
                          </button>
                        </div>
                      </>
                    )}

                    {activeSection === "hair" && (
                      <>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">髪型</h3>
                          <div className="grid grid-cols-4 gap-2">
                            {hairStyles.map((s) => (
                              <OptionChip key={s.id} label={s.label} active={avatar.hairStyle === s.id} onClick={() => updateAvatar({ hairStyle: s.id })} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">髪色</h3>
                          <div className="flex gap-2 flex-wrap">
                            {hairColorPalette.map((c) => (
                              <Swatch key={c} color={c} active={avatar.hairColor === c} onClick={() => updateAvatar({ hairColor: c })} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeSection === "eyes" && (
                      <>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">目の形</h3>
                          <div className="grid grid-cols-4 gap-2">
                            {eyeStyles.map((s) => (
                              <OptionChip key={s.id} label={s.label} active={avatar.eyeStyle === s.id} onClick={() => updateAvatar({ eyeStyle: s.id })} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">瞳の色</h3>
                          <div className="flex gap-2 flex-wrap">
                            {eyeColorPalette.map((c) => (
                              <Swatch key={c} color={c} active={avatar.eyeColor === c} onClick={() => updateAvatar({ eyeColor: c })} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeSection === "brows" && (
                      <div>
                        <h3 className="text-white/70 text-sm font-medium mb-2">眉の形</h3>
                        <div className="flex gap-2 flex-wrap">
                          {eyebrowStyles.map((s) => (
                            <OptionChip key={s.id} label={s.label} active={avatar.eyebrowStyle === s.id} onClick={() => updateAvatar({ eyebrowStyle: s.id })} />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === "mouth" && (
                      <div>
                        <h3 className="text-white/70 text-sm font-medium mb-2">口・表情</h3>
                        <div className="flex gap-2 flex-wrap">
                          {mouthStyles.map((s) => (
                            <OptionChip key={s.id} label={s.label} active={avatar.mouthStyle === s.id} onClick={() => updateAvatar({ mouthStyle: s.id })} />
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === "outfit" && (
                      <>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">服のスタイル</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {outfitStyles.map((s) => (
                              <OptionChip key={s.id} label={s.label} active={avatar.outfitStyle === s.id} onClick={() => updateAvatar({ outfitStyle: s.id })} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-white/70 text-sm font-medium mb-2">服の色</h3>
                          <div className="flex gap-2 flex-wrap">
                            {outfitColorPalette.map((c) => (
                              <Swatch key={c} color={c} active={avatar.outfitColor === c} onClick={() => updateAvatar({ outfitColor: c })} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeSection === "extra" && (
                      <div>
                        <h3 className="text-white/70 text-sm font-medium mb-2">アクセサリー</h3>
                        <div className="flex gap-2 flex-wrap">
                          {accessories.map((s) => (
                            <OptionChip key={s.id} label={s.label} active={avatar.accessory === s.id} onClick={() => updateAvatar({ accessory: s.id })} />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button
                onClick={handleSaveManual}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                変更を保存する
              </motion.button>
            </motion.div>
          ) : (
            /* ── AI Mode Panel ─────────────────────────────────────────── */
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Style selector */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <h3 className="text-white/80 text-sm font-semibold">スタイルを選択</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {aiStyles.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => setAiStyle(s.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-center transition-all",
                        aiStyle === s.id
                          ? "border-orange-500/60 bg-orange-500/15 text-white"
                          : "border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5"
                      )}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span className="text-xl leading-none">{s.emoji}</span>
                      <span className="text-[10px] font-medium leading-tight">{s.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Description input */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Edit3 className="w-4 h-4 text-orange-400" />
                  <h3 className="text-white/80 text-sm font-semibold">キャラクターの特徴</h3>
                </div>
                <textarea
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="例: 元気な女の子、オレンジ色の短い髪、青い瞳、笑顔が可愛い、スポーティな服を着ている"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 placeholder-white/25 text-sm focus:outline-none focus:border-orange-500/40 resize-none"
                />
                <p className="text-white/25 text-xs">
                  ヒント: 髪型・目の色・性格・服装など具体的に書くほど理想のキャラに近づきます
                </p>
              </div>

              {/* Generate button */}
              <motion.button
                onClick={generateAiCharacter}
                disabled={isGenerating}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all",
                  isGenerating
                    ? "bg-white/10 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 shadow-lg shadow-purple-500/30 hover:opacity-90"
                )}
                whileHover={isGenerating ? {} : { scale: 1.02 }}
                whileTap={isGenerating ? {} : { scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AIが生成中… しばらくお待ちください
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    AIでキャラクターを生成する
                  </>
                )}
              </motion.button>

              {/* Loading indicator */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.15s]" />
                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.3s]" />
                        <span className="text-purple-300 text-xs ml-1">DALL·E 3 が描いています…</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {generationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm"
                  >
                    <p className="font-medium mb-1">生成に失敗しました</p>
                    <p className="text-xs text-red-400/70">{generationError}</p>
                    <p className="text-xs text-red-400/50 mt-1">
                      設定ページ → AI設定 → APIキー設定 で Gemini または OpenAI のAPIキーを登録してください。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generated image preview + actions */}
              <AnimatePresence>
                {generatedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <h3 className="text-white/80 text-sm font-semibold">生成完了！</h3>
                      </div>
                      <button
                        onClick={generateAiCharacter}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        再生成
                      </button>
                    </div>

                    <div className="flex justify-center">
                      <img
                        src={generatedImage}
                        alt="Generated character"
                        className="w-48 h-48 rounded-2xl object-cover border border-white/10 shadow-xl"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(249,115,22,0.25))" }}
                      />
                    </div>

                    <motion.button
                      onClick={applyAiCharacter}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      このキャラを使う（OK）
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Currently applied AI character */}
              {!generatedImage && theme.characterImage && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 text-sm font-medium">現在のAIキャラクター</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={theme.characterImage}
                      alt="Current AI character"
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs">このキャラクターが設定されています</p>
                      <button
                        onClick={() => {
                          updateTheme({ characterImage: null })
                          toast.success("AIキャラクターをリセットしました")
                        }}
                        className="text-red-400/60 hover:text-red-400 text-xs mt-1 transition-colors"
                      >
                        削除してSVGアバターに戻す
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* API key hint */}
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-white/25 mt-0.5 flex-shrink-0" />
                <p className="text-white/25 text-xs">
                  APIキーが必要です。設定ページ → AI設定 → APIキー設定 で Gemini（推奨）または OpenAI のキーを登録してください。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
