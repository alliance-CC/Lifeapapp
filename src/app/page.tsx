"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'logo' | 'character' | 'tagline' | 'done'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('character'), 800)
    const t2 = setTimeout(() => setPhase('tagline'), 1800)
    const t3 = setTimeout(() => setPhase('done'), 3200)
    const t4 = setTimeout(() => router.push('/login'), 3800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [router])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#171717] via-[#262626] to-[#0a0a0a]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-orange-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Company Logo */}
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className="relative z-10 flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            {/* Character Image Area */}
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase !== 'logo' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-amber-500 p-1 shadow-2xl shadow-orange-500/50">
                <div className="w-full h-full rounded-full bg-[#171717] flex items-center justify-center overflow-hidden">
                  {/* Character image placeholder - user will add image to /public/character.png */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/character.png"
                      alt="ライフアップキャラクター"
                      fill
                      className="object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    {/* Fallback character placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border-2 border-dashed border-orange-400/30"
                      />
                      <span className="text-6xl">🌟</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-orange-500/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-amber-500/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>

            {/* Company name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                animate={{ opacity: 1 }}
              >
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  LifeUp
                </span>
                <span className="text-white/80 text-xl ml-2">App</span>
              </motion.h1>

              <AnimatePresence>
                {phase === 'tagline' && (
                  <motion.p
                    className="text-white/60 text-sm md:text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    あなたの成長を、もっと楽しく。
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom brand */}
      <motion.p
        className="absolute bottom-8 text-white/30 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © 2024 株式会社ライフアップ
      </motion.p>
    </div>
  )
}
