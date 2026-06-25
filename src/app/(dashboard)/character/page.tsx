"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Zap, Shield, Heart, Sparkles, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"

const personalities = [
  { id: "cheerful", label: "明るい・元気", emoji: "😊", color: "from-yellow-400 to-orange-500" },
  { id: "calm", label: "落ち着いた・知的", emoji: "🧠", color: "from-blue-400 to-cyan-500" },
  { id: "cool", label: "クール・カッコいい", emoji: "😎", color: "from-gray-400 to-slate-500" },
  { id: "gentle", label: "優しい・癒し系", emoji: "🌸", color: "from-pink-400 to-rose-500" },
]

const hairColors = ["#1a1a1a", "#8B4513", "#FFD700", "#FF6B6B", "#4169E1", "#9370DB", "#FFFFFF"]
const outfitColors = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]

export default function CharacterPage() {
  const [name, setName] = useState("ライフちゃん")
  const [personality, setPersonality] = useState("cheerful")
  const [hairColor, setHairColor] = useState("#FFD700")
  const [outfitColor, setOutfitColor] = useState("#8b5cf6")

  const selectedPersonality = personalities.find((p) => p.id === personality)

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">キャラクター</h1>
        <p className="text-white/50 text-sm mt-1">あなただけのAIキャラクターをカスタマイズ</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center"
        >
          {/* Avatar */}
          <div className="relative mb-6">
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center text-7xl shadow-2xl border-4 border-white/10"
              style={{ background: `linear-gradient(135deg, ${hairColor}40, ${outfitColor}60)` }}
            >
              {selectedPersonality?.emoji}
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center border-2 border-white/20">
              <span className="text-white font-bold text-sm">24</span>
            </div>
            {/* Glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 40px ${outfitColor}40` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${selectedPersonality?.color} text-white text-xs font-medium mb-6`}>
            {selectedPersonality?.label}
          </div>

          {/* Stats */}
          <div className="w-full space-y-3">
            {[
              { label: "レベル", value: 24, max: 100, icon: Star, color: "from-yellow-500 to-orange-500" },
              { label: "経験値", value: 86, max: 100, icon: Zap, color: "from-violet-500 to-pink-500" },
              { label: "強さ", value: 72, max: 100, icon: Shield, color: "from-blue-500 to-cyan-500" },
              { label: "好感度", value: 95, max: 100, icon: Heart, color: "from-pink-500 to-rose-500" },
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

        {/* Customization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          {/* Name */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              キャラクター名
            </h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-all"
              placeholder="名前を入力..."
            />
          </div>

          {/* Personality */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              性格タイプ
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {personalities.map((p) => (
                <motion.button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border transition-all text-left",
                    personality === p.id
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-white/10 bg-white/3 hover:bg-white/5"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-white/80 text-xs">{p.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white/70 text-sm font-medium mb-3">髪の色</h3>
            <div className="flex gap-2 flex-wrap">
              {hairColors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setHairColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    hairColor === color ? "border-white scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>
          </div>

          {/* Outfit Color */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-white/70 text-sm font-medium mb-3">衣装の色</h3>
            <div className="flex gap-2 flex-wrap">
              {outfitColors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setOutfitColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    outfitColor === color ? "border-white scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </div>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-violet-500/30"
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
