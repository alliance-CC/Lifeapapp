"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Zap, Shield, Heart, Edit3, Palette, User, Shirt, Eye, Smile, Glasses, Shuffle, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { CharacterAvatar, type AvatarConfig, defaultAvatar } from "@/components/CharacterAvatar"
import toast from "react-hot-toast"

const personalities = [
  { id: "cheerful", label: "明るい・元気", color: "from-orange-400 to-orange-600" },
  { id: "calm", label: "落ち着いた・知的", color: "from-zinc-300 to-zinc-500" },
  { id: "cool", label: "クール・カッコいい", color: "from-gray-400 to-slate-500" },
  { id: "gentle", label: "優しい・癒し系", color: "from-amber-400 to-amber-500" },
]

const faceShapes = [
  { id: 0, label: "標準" },
  { id: 1, label: "丸顔" },
  { id: 2, label: "面長" },
]

const skinTones = [
  { value: "#FCD9B6", label: "ライト" },
  { value: "#F2C29A", label: "ナチュラル" },
  { value: "#E0A878", label: "タン" },
  { value: "#C68642", label: "ブラウン" },
  { value: "#8D5524", label: "ダーク" },
]

const hairStyles = [
  { id: 0, label: "ショート" },
  { id: 1, label: "ボブ" },
  { id: 2, label: "ロング" },
  { id: 3, label: "ポニーテール" },
  { id: 4, label: "ツインテール" },
  { id: 5, label: "ウェーブ" },
  { id: 6, label: "お団子" },
  { id: 7, label: "スパイキー" },
]

const hairColorPalette = [
  "#2b2320", "#3d2b1f", "#5c3a24", "#8B4513", "#a86d3c",
  "#c8a87a", "#d9c69e", "#ede3cf", "#f5f0e8", "#f97316",
  "#e0457b", "#8b5cf6", "#3b82f6", "#10b981", "#9ca3af", "#f8fafc",
]

const eyeStyles = [
  { id: 0, label: "ぱっちり" },
  { id: 1, label: "クール" },
  { id: 2, label: "にっこり" },
  { id: 3, label: "シャープ" },
]

const eyeColorPalette = [
  "#7a4a2b", "#5c3a24", "#3d2817", "#1f2937", "#3b6ea5",
  "#2e7d6b", "#6d4ca8", "#a8324a", "#b8860b", "#4b5563",
]

const eyebrowStyles = [
  { id: 0, label: "ソフト" },
  { id: 1, label: "ストレート" },
  { id: 2, label: "凛々しい" },
]

const mouthStyles = [
  { id: 0, label: "スマイル" },
  { id: 1, label: "笑顔" },
  { id: 2, label: "ノーマル" },
  { id: 3, label: "にゃっ" },
]

const outfitStyles = [
  { id: 0, label: "カジュアル" },
  { id: 1, label: "フォーマル" },
  { id: 2, label: "スポーツ" },
  { id: 3, label: "パーカー" },
  { id: 4, label: "ブラウス" },
]

const outfitColorPalette = [
  "#f97316", "#fb923c", "#f59e0b", "#ef4444", "#ec4899",
  "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#171717",
  "#3f3f46", "#71717a", "#d4d4d8", "#f8fafc",
]

const accessories = [
  { id: 0, label: "なし" },
  { id: 1, label: "メガネ" },
  { id: 2, label: "ピアス" },
  { id: 3, label: "ヘアピン" },
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

function OptionChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-xl border text-xs font-medium transition-all",
        active ? "border-orange-500/50 bg-orange-500/15 text-white" : "border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  )
}

function randInt(n: number) {
  return Math.floor(Math.random() * n)
}
function pick<T>(arr: T[]): T {
  return arr[randInt(arr.length)]
}

export default function CharacterPage() {
  const [name, setName] = useState("ライフちゃん")
  const [activeSection, setActiveSection] = useState<Section>("personality")
  const [avatar, setAvatar] = useState<AvatarConfig>(defaultAvatar)

  const updateAvatar = (partial: Partial<AvatarConfig>) => setAvatar((prev) => ({ ...prev, ...partial }))

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

  const handleSave = () => {
    toast.success("キャラクターを保存しました！ +30 EXP 獲得", { icon: "⭐" })
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">キャラクター</h1>
          <p className="text-white/50 text-sm mt-1">あなただけのアバターを作ろう</p>
        </div>
        <div className="flex gap-2">
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
            onClick={() => {
              setAvatar(defaultAvatar)
              toast.success("リセットしました")
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw className="w-4 h-4" />
            リセット
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center lg:sticky lg:top-6 self-start"
        >
          <div className="relative mb-4">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <CharacterAvatar config={avatar} size={200} showGlow />
            </motion.div>
            {/* Level badge */}
            <div className="absolute bottom-6 -right-1 w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center border-2 border-white/20 shadow-lg z-10">
              <span className="text-white font-bold text-sm">24</span>
            </div>
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

          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${selectedPersonality?.color} text-white text-xs font-medium mb-6`}>
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
        </motion.div>

        {/* Customization Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
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
                            avatar.personality === p.id ? "border-orange-500/50 bg-orange-500/10" : "border-white/10 hover:bg-white/5"
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
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            変更を保存する
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
