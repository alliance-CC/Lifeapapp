"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Zap, Shield, Heart, Edit3, Palette, User, Shirt, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { CharacterAvatar, type AvatarConfig, defaultAvatar } from "@/components/CharacterAvatar"
import toast from "react-hot-toast"

const personalities = [
  { id: "cheerful", label: "明るい・元気", color: "from-orange-400 to-orange-600" },
  { id: "calm", label: "落ち着いた・知的", color: "from-zinc-300 to-zinc-500" },
  { id: "cool", label: "クール・カッコいい", color: "from-gray-400 to-slate-500" },
  { id: "gentle", label: "優しい・癒し系", color: "from-amber-400 to-amber-500" },
]

const skinTones = [
  { value: "#FDDBB4", label: "ライト" },
  { value: "#F5C5A3", label: "ナチュラル" },
  { value: "#E8A87C", label: "タン" },
  { value: "#C68642", label: "ブラウン" },
  { value: "#8D5524", label: "ダーク" },
]

const hairStyles = [
  { id: 0, label: "ショート" },
  { id: 1, label: "ボブ" },
  { id: 2, label: "ロング" },
  { id: 3, label: "ポニーテール" },
  { id: 4, label: "カーリー" },
]

const hairColorPalette = [
  "#171717", "#3d2b1f", "#6b3a2a", "#8B4513", "#a0522d",
  "#c8a87a", "#d4c5a0", "#e8dcc8", "#f5f0e8", "#f97316",
  "#ef4444", "#8b5cf6", "#3b82f6", "#FFFFFF",
]

const eyeStyles = [
  { id: 0, label: "ノーマル" },
  { id: 1, label: "ハッピー" },
  { id: 2, label: "クール" },
]

const outfitStyles = [
  { id: 0, label: "カジュアル" },
  { id: 1, label: "フォーマル" },
  { id: 2, label: "スポーツ" },
  { id: 3, label: "ユニフォーム" },
]

const outfitColorPalette = [
  "#f97316", "#fb923c", "#f59e0b", "#ef4444",
  "#8b5cf6", "#3b82f6", "#10b981", "#06b6d4",
  "#171717", "#3f3f46", "#71717a", "#d4d4d8",
]

type Section = "personality" | "skin" | "hair" | "eyes" | "outfit"

const sectionConfig: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "personality", label: "性格", icon: User },
  { key: "skin", label: "肌", icon: Palette },
  { key: "hair", label: "髪型", icon: Edit3 },
  { key: "eyes", label: "目", icon: Eye },
  { key: "outfit", label: "服装", icon: Shirt },
]

export default function CharacterPage() {
  const [name, setName] = useState("ライフちゃん")
  const [personality, setPersonality] = useState("cheerful")
  const [activeSection, setActiveSection] = useState<Section>("personality")
  const [avatar, setAvatar] = useState<AvatarConfig>(defaultAvatar)

  const updateAvatar = (partial: Partial<AvatarConfig>) => {
    setAvatar((prev) => ({ ...prev, ...partial }))
  }

  const selectedPersonality = personalities.find((p) => p.id === personality)

  const handleSave = () => {
    toast.success("キャラクターを保存しました！ +30 EXP 獲得", { icon: "⭐" })
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">キャラクター</h1>
        <p className="text-white/50 text-sm mt-1">あなただけのアバターを作ろう</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center"
        >
          {/* Avatar display */}
          <div className="relative mb-6">
            <motion.div
              className="relative"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <CharacterAvatar config={avatar} size={160} showGlow />
            </motion.div>

            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
              <span className="text-white font-bold text-sm">24</span>
            </div>

            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: `0 0 40px ${avatar.outfitColor}40` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Name */}
          <div className="relative mb-2">
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
              { label: "レベル", value: 24, max: 100, icon: Star, color: "from-orange-500 to-orange-600" },
              { label: "経験値", value: 86, max: 100, icon: Zap, color: "from-orange-500 to-amber-500" },
              { label: "強さ", value: 72, max: 100, icon: Shield, color: "from-zinc-400 to-zinc-500" },
              { label: "好感度", value: 95, max: 100, icon: Heart, color: "from-amber-400 to-amber-500" },
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Section tabs */}
          <div className="grid grid-cols-5 gap-1 bg-white/5 p-1 rounded-xl">
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
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-h-[240px]">
            {activeSection === "personality" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-white/70 text-sm font-medium">性格タイプを選ぶ</h3>
                <div className="grid grid-cols-2 gap-3">
                  {personalities.map((p) => (
                    <motion.button
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={cn(
                        "p-3 rounded-xl border transition-all text-left",
                        personality === p.id
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
              </motion.div>
            )}

            {activeSection === "skin" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-white/70 text-sm font-medium">肌の色</h3>
                <div className="flex gap-3 flex-wrap">
                  {skinTones.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateAvatar({ skinTone: s.value })}
                      className="flex flex-col items-center gap-1"
                    >
                      <motion.div
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          avatar.skinTone === s.value ? "border-white scale-110 shadow-lg" : "border-white/20"
                        )}
                        style={{ backgroundColor: s.value }}
                        whileHover={{ scale: 1.1 }}
                      />
                      <span className="text-white/40 text-xs">{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "hair" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <h3 className="text-white/70 text-sm font-medium mb-2">髪型</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {hairStyles.map((s) => (
                      <motion.button
                        key={s.id}
                        onClick={() => updateAvatar({ hairStyle: s.id })}
                        className={cn(
                          "py-2 rounded-lg border text-xs transition-all",
                          avatar.hairStyle === s.id
                            ? "border-orange-500/50 bg-orange-500/10 text-white"
                            : "border-white/10 text-white/40 hover:text-white/70"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white/70 text-sm font-medium mb-2">髪色</h3>
                  <div className="flex gap-2 flex-wrap">
                    {hairColorPalette.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => updateAvatar({ hairColor: color })}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          avatar.hairColor === color ? "border-white scale-110" : "border-white/20"
                        )}
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "eyes" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-white/70 text-sm font-medium">目のスタイル</h3>
                <div className="grid grid-cols-3 gap-3">
                  {eyeStyles.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => updateAvatar({ eyeStyle: s.id })}
                      className={cn(
                        "p-3 rounded-xl border transition-all",
                        avatar.eyeStyle === s.id
                          ? "border-orange-500/50 bg-orange-500/10"
                          : "border-white/10 hover:bg-white/5"
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Mini eye preview */}
                      <div className="flex justify-center gap-2 mb-2 h-6 items-center">
                        {s.id === 0 && (
                          <>
                            <div className="w-3 h-3.5 rounded-full bg-white/80" />
                            <div className="w-3 h-3.5 rounded-full bg-white/80" />
                          </>
                        )}
                        {s.id === 1 && (
                          <>
                            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M 1 8 Q 7 1 13 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M 1 8 Q 7 1 13 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                          </>
                        )}
                        {s.id === 2 && (
                          <>
                            <div className="w-4 h-2 rounded-full bg-white/80" />
                            <div className="w-4 h-2 rounded-full bg-white/80" />
                          </>
                        )}
                      </div>
                      <span className="text-white/70 text-xs">{s.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "outfit" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <h3 className="text-white/70 text-sm font-medium mb-2">服のスタイル</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {outfitStyles.map((s) => (
                      <motion.button
                        key={s.id}
                        onClick={() => updateAvatar({ outfitStyle: s.id })}
                        className={cn(
                          "py-2 rounded-xl border text-xs transition-all",
                          avatar.outfitStyle === s.id
                            ? "border-orange-500/50 bg-orange-500/10 text-white"
                            : "border-white/10 text-white/50 hover:text-white/80"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white/70 text-sm font-medium mb-2">服の色</h3>
                  <div className="flex gap-2 flex-wrap">
                    {outfitColorPalette.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => updateAvatar({ outfitColor: color })}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          avatar.outfitColor === color ? "border-white scale-110" : "border-white/20"
                        )}
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
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
