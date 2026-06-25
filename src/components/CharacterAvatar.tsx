"use client"

import { useId } from "react"

export type AvatarConfig = {
  faceShape: number
  skinTone: string
  blush: boolean
  hairStyle: number
  hairColor: string
  eyeStyle: number
  eyeColor: string
  eyebrowStyle: number
  mouthStyle: number
  outfitStyle: number
  outfitColor: string
  accessory: number
  personality: string
}

export const defaultAvatar: AvatarConfig = {
  faceShape: 0,
  skinTone: "#FCD9B6",
  blush: true,
  hairStyle: 0,
  hairColor: "#2b2320",
  eyeStyle: 0,
  eyeColor: "#7a4a2b",
  eyebrowStyle: 0,
  mouthStyle: 0,
  outfitStyle: 0,
  outfitColor: "#f97316",
  accessory: 0,
  personality: "cheerful",
}

/* ---------- color helpers ---------- */
function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function shade(hex: string, amt: number) {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const r = clamp(parseInt(full.slice(0, 2), 16) + amt)
  const g = clamp(parseInt(full.slice(2, 4), 16) + amt)
  const b = clamp(parseInt(full.slice(4, 6), 16) + amt)
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
}
function luminance(hex: string) {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

/* ---------- face shapes ---------- */
const faceShapes: Record<number, string> = {
  0: "M 120 48 C 158 48 176 78 176 112 C 176 150 152 188 120 192 C 88 188 64 150 64 112 C 64 78 82 48 120 48 Z",
  1: "M 120 50 C 163 50 181 86 179 116 C 177 146 150 183 120 185 C 90 183 63 146 61 116 C 59 86 77 50 120 50 Z",
  2: "M 120 46 C 153 46 171 78 169 110 C 167 153 146 193 120 197 C 94 193 73 153 71 110 C 69 78 87 46 120 46 Z",
}

/* ---------- hair ---------- */
function getHair(style: number, hairId: string, hi: string) {
  const fill = `url(#${hairId})`
  const hl = (d: string) => (
    <path d={d} fill="none" stroke={hi} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
  )
  switch (style) {
    case 1: // Bob
      return {
        back: (
          <g>
            <path
              d="M 54 152 C 50 80 84 44 120 44 C 156 44 190 80 186 152 C 184 168 178 178 170 182 L 168 110 C 168 86 150 70 120 70 C 90 70 72 86 72 110 L 70 182 C 62 178 56 168 54 152 Z"
              fill={fill}
            />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 72 98 C 76 70 98 62 120 62 C 142 62 164 70 168 98 C 160 86 150 88 140 98 C 132 86 128 86 121 98 C 114 86 108 88 100 98 C 90 88 80 88 72 98 Z"
              fill={fill}
            />
            {hl("M 92 72 Q 110 65 128 72")}
          </g>
        ),
      }
    case 2: // Long straight
      return {
        back: (
          <g>
            <path
              d="M 52 252 C 44 120 70 44 120 44 C 170 44 196 120 188 252 C 186 264 178 270 170 266 L 166 110 C 166 84 148 68 120 68 C 92 68 74 84 74 110 L 70 266 C 62 270 54 264 52 252 Z"
              fill={fill}
            />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 74 94 C 78 66 98 60 120 60 C 142 60 162 66 166 94 C 158 80 146 82 135 96 C 131 82 127 80 121 82 C 115 80 110 82 106 96 C 95 82 82 80 74 94 Z"
              fill={fill}
            />
            {hl("M 90 70 Q 105 64 118 68")}
          </g>
        ),
      }
    case 3: // Ponytail
      return {
        back: (
          <g>
            <path
              d="M 168 76 C 198 82 210 112 202 144 C 197 168 183 184 170 188 C 184 168 190 146 184 122 C 180 106 173 96 162 90 Z"
              fill={fill}
            />
            <path
              d="M 58 120 C 54 70 84 44 120 44 C 156 44 186 70 182 120 C 178 104 172 96 164 92 C 162 78 150 70 120 70 C 96 70 80 76 76 92 C 68 96 62 104 58 120 Z"
              fill={fill}
            />
            <ellipse cx={167} cy={82} rx={8} ry={6} fill={shade(hi, -60)} />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 74 92 C 80 70 98 62 120 62 C 142 62 160 70 166 92 C 156 82 146 86 138 96 C 132 84 126 84 121 94 C 116 84 108 86 102 96 C 92 86 84 84 74 92 Z"
              fill={fill}
            />
            {hl("M 92 70 Q 110 64 128 70")}
          </g>
        ),
      }
    case 4: // Twin tails
      return {
        back: (
          <g>
            <path
              d="M 60 116 C 40 130 33 162 42 192 C 46 206 56 214 65 216 C 56 197 54 175 61 152 C 64 138 67 126 71 118 Z"
              fill={fill}
            />
            <path
              d="M 180 116 C 200 130 207 162 198 192 C 194 206 184 214 175 216 C 184 197 186 175 179 152 C 176 138 173 126 169 118 Z"
              fill={fill}
            />
            <path
              d="M 58 120 C 54 70 84 44 120 44 C 156 44 186 70 182 120 C 178 104 172 96 164 92 C 162 78 150 70 120 70 C 96 70 80 76 76 92 C 68 96 62 104 58 120 Z"
              fill={fill}
            />
            <ellipse cx={66} cy={120} rx={7} ry={5} fill={shade(hi, -60)} />
            <ellipse cx={174} cy={120} rx={7} ry={5} fill={shade(hi, -60)} />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 74 92 C 80 70 98 62 120 62 C 142 62 160 70 166 92 C 156 82 146 86 138 96 C 132 84 126 84 121 94 C 116 84 108 86 102 96 C 92 86 84 84 74 92 Z"
              fill={fill}
            />
            {hl("M 92 70 Q 110 64 128 70")}
          </g>
        ),
      }
    case 5: // Wavy / curly
      return {
        back: (
          <g>
            <path
              d="M 52 202 C 44 100 76 44 120 44 C 164 44 196 100 188 202 C 184 190 176 198 170 186 C 176 172 172 152 178 142 C 170 152 166 140 168 126 C 160 96 144 72 120 72 C 96 72 80 96 72 126 C 74 140 70 152 62 142 C 68 152 64 172 70 186 C 64 198 56 190 52 202 Z"
              fill={fill}
            />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 72 98 C 76 68 98 60 120 60 C 142 60 164 68 168 98 C 162 90 156 98 148 100 C 152 90 146 86 140 96 C 144 86 136 84 130 96 C 126 84 118 86 116 96 C 112 84 104 86 100 98 C 96 90 90 92 84 100 C 84 92 80 90 72 98 Z"
              fill={fill}
            />
            {hl("M 92 72 Q 110 66 128 72")}
          </g>
        ),
      }
    case 6: // Updo / bun
      return {
        back: (
          <g>
            <path
              d="M 58 120 C 54 68 84 44 120 44 C 156 44 186 68 182 120 C 178 104 172 96 164 92 C 162 76 150 70 120 70 C 96 70 80 76 76 92 C 68 96 62 104 58 120 Z"
              fill={fill}
            />
            <circle cx={120} cy={42} r={20} fill={fill} />
            <path d="M 104 42 Q 120 50 136 42" fill="none" stroke={shade(hi, -70)} strokeWidth={2} opacity={0.5} />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 74 92 C 78 66 98 60 120 60 C 142 60 162 66 166 92 C 158 80 146 82 135 94 C 131 82 127 80 121 82 C 115 80 110 82 106 94 C 95 82 82 80 74 92 Z"
              fill={fill}
            />
            {hl("M 90 68 Q 105 62 120 66")}
          </g>
        ),
      }
    case 7: // Spiky
      return {
        back: (
          <g>
            <path
              d="M 56 118 C 52 70 60 38 78 34 C 74 52 84 50 92 38 C 92 56 104 54 108 40 C 112 58 122 56 124 42 C 130 60 140 58 142 44 C 148 62 160 58 162 44 C 180 50 188 78 184 118 C 180 104 172 96 164 92 C 162 78 150 70 120 70 C 96 70 80 76 76 92 C 68 96 60 104 56 118 Z"
              fill={fill}
            />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 74 96 C 78 74 96 64 120 64 C 144 64 162 74 166 96 C 158 80 156 92 146 96 C 150 78 142 80 138 96 C 134 78 126 80 124 96 C 120 78 112 82 110 96 C 106 80 98 82 96 96 C 90 82 82 84 74 96 Z"
              fill={fill}
            />
            {hl("M 92 72 Q 110 66 128 72")}
          </g>
        ),
      }
    default: // 0 Short
      return {
        back: (
          <g>
            <path
              d="M 56 120 C 52 70 82 44 120 44 C 158 44 188 70 184 120 C 180 104 174 96 166 92 C 164 76 150 70 120 70 C 90 70 76 76 74 92 C 66 96 60 104 56 120 Z"
              fill={fill}
            />
          </g>
        ),
        front: (
          <g>
            <path
              d="M 74 94 C 78 72 98 64 120 64 C 142 64 162 72 166 94 C 158 82 150 86 143 98 C 139 86 132 84 127 96 C 122 84 114 84 110 96 C 105 85 98 86 94 98 C 88 86 82 84 74 94 Z"
              fill={fill}
            />
            {hl("M 92 70 Q 110 64 130 70")}
          </g>
        ),
      }
  }
}

/* ---------- eyes (left eye, mirrored for right) ---------- */
function renderEye(style: number, eyeColor: string, irisId: string, skin: string) {
  const lash = "#241a15"
  const shadow = shade(skin, -30)
  switch (style) {
    case 1: // Cool / half-lidded
      return (
        <g>
          <ellipse cx={99} cy={127} rx={16} ry={11} fill="#fdfdff" />
          <circle cx={100} cy={126} r={10.5} fill={`url(#${irisId})`} />
          <circle cx={100} cy={126} r={4.8} fill="#1c140e" />
          <circle cx={95.5} cy={122} r={2.8} fill="#fff" />
          <path d="M 83 120 Q 99 113 116 120 Q 110 124 99 124 Q 88 124 83 120 Z" fill={shade(skin, 4)} />
          <path d="M 83 120 Q 99 113 116 120" fill="none" stroke={lash} strokeWidth={3} strokeLinecap="round" />
          <path d="M 85 116 Q 99 110 113 116" fill="none" stroke={shadow} strokeWidth={1} opacity={0.5} />
          <path d="M 86 137 Q 99 141 112 136" fill="none" stroke={shadow} strokeWidth={1.2} opacity={0.45} />
        </g>
      )
    case 2: // Happy closed
      return (
        <g>
          <path d="M 83 132 Q 99 117 115 132" fill="none" stroke={lash} strokeWidth={3.6} strokeLinecap="round" />
          <path d="M 88 137 Q 99 142 110 137" fill="none" stroke={lash} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
        </g>
      )
    case 3: // Sharp / tsurime
      return (
        <g>
          <ellipse cx={99} cy={126} rx={17} ry={12.5} fill="#fdfdff" />
          <circle cx={101} cy={126} r={10.5} fill={`url(#${irisId})`} />
          <circle cx={101} cy={126} r={4.8} fill="#1c140e" />
          <circle cx={96.5} cy={121.5} r={3} fill="#fff" />
          <circle cx={104} cy={131} r={1.5} fill="#fff" opacity={0.8} />
          <path d="M 82 126 Q 98 110 118 116" fill="none" stroke={lash} strokeWidth={3.6} strokeLinecap="round" />
          <path d="M 114 114 L 123 109" stroke={lash} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M 85 135 Q 99 140 112 134" fill="none" stroke={shadow} strokeWidth={1.2} opacity={0.45} />
        </g>
      )
    default: // 0 Round / open
      return (
        <g>
          <ellipse cx={99} cy={127} rx={17} ry={15.5} fill={shadow} opacity={0.22} />
          <ellipse cx={99} cy={126} rx={16} ry={15} fill="#fdfdff" />
          <circle cx={100} cy={127} r={11} fill={`url(#${irisId})`} />
          <circle cx={100} cy={127} r={5.4} fill="#1c140e" />
          <circle cx={95.5} cy={122} r={3.6} fill="#fff" />
          <circle cx={104} cy={132} r={1.8} fill="#fff" opacity={0.85} />
          <path d="M 82 120 Q 99 106 116 120" fill="none" stroke={lash} strokeWidth={3.6} strokeLinecap="round" />
          <path d="M 113 118 Q 119 119 121 124" fill="none" stroke={lash} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M 85 138 Q 99 143 113 137" fill="none" stroke={shadow} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
        </g>
      )
  }
}

function renderBrow(style: number, color: string) {
  switch (style) {
    case 1:
      return <path d="M 83 104 L 115 102" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    case 2:
      return <path d="M 83 108 L 99 100 L 115 106" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    default:
      return <path d="M 83 106 Q 99 98 115 105" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
  }
}

function renderMouth(style: number) {
  const lip = "#c46a52"
  switch (style) {
    case 1: // Open smile
      return (
        <g>
          <path d="M 108 162 Q 120 167 132 162 Q 128 181 120 182 Q 112 181 108 162 Z" fill="#9c4a4a" />
          <path d="M 110 163 Q 120 167 130 163 L 128 167 Q 120 169 112 167 Z" fill="#ffffff" />
          <ellipse cx={120} cy={177} rx={6.5} ry={3.6} fill="#e07a7a" />
          <path d="M 106 161 Q 120 166 134 161" fill="none" stroke={lip} strokeWidth={2.2} strokeLinecap="round" />
        </g>
      )
    case 2: // Neutral
      return <path d="M 110 166 Q 120 169 130 166" fill="none" stroke={lip} strokeWidth={2.2} strokeLinecap="round" />
    case 3: // Cat :3
      return <path d="M 109 164 Q 115 170 120 164 Q 125 170 131 164" fill="none" stroke={lip} strokeWidth={2.4} strokeLinecap="round" />
    default: // Smile
      return (
        <g>
          <path d="M 106 163 Q 120 174 134 163" fill="none" stroke={lip} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M 110 167 Q 120 172 130 167" fill="none" stroke={shade(lip, 45)} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
        </g>
      )
  }
}

function renderOutfit(style: number, color: string, skinFill: string) {
  const base = "M 34 300 L 39 246 Q 50 227 78 219 L 96 213 Q 108 224 120 224 Q 132 224 144 213 L 162 219 Q 190 227 201 246 L 206 300 Z"
  const rightShadow = "M 120 224 L 144 213 L 162 219 Q 190 227 201 246 L 206 300 L 120 300 Z"
  const dark = shade(color, -28)
  const light = shade(color, 25)
  let collar = null
  switch (style) {
    case 1: // Formal
      collar = (
        <g>
          <path d="M 102 218 L 90 244 L 110 240 Z" fill="#f4f4f5" />
          <path d="M 138 218 L 150 244 L 130 240 Z" fill="#f4f4f5" />
          <path d="M 113 222 L 120 222 L 127 222 L 123 262 L 120 268 L 117 262 Z" fill="#dc2626" />
          <rect x={150} y={250} width={11} height={9} rx={1.5} fill="#f4f4f5" opacity={0.7} />
        </g>
      )
      break
    case 2: // Sporty
      collar = (
        <g>
          <path d="M 100 218 L 120 236 L 140 218" fill="none" stroke="#ffffff" strokeWidth={2.6} opacity={0.6} />
          <path d="M 39 246 L 50 300 L 62 300 L 54 244 Z" fill="#ffffff" opacity={0.22} />
          <path d="M 201 246 L 190 300 L 178 300 L 186 244 Z" fill="#ffffff" opacity={0.22} />
          <text x={120} y={286} textAnchor="middle" fill="#ffffff" fontSize={26} fontWeight="bold" opacity={0.7} fontFamily="sans-serif">7</text>
        </g>
      )
      break
    case 3: // Hoodie
      collar = (
        <g>
          <path d="M 96 213 Q 120 234 144 213 Q 150 236 138 250 Q 120 258 102 250 Q 90 236 96 213 Z" fill={dark} />
          <path d="M 113 240 L 110 280" stroke="#e5e5e5" strokeWidth={2.4} strokeLinecap="round" />
          <path d="M 127 240 L 130 280" stroke="#e5e5e5" strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={110} cy={282} r={3} fill="#e5e5e5" />
          <circle cx={130} cy={282} r={3} fill="#e5e5e5" />
          <rect x={88} y={272} width={64} height={22} rx={4} fill={dark} opacity={0.5} />
        </g>
      )
      break
    case 4: // Blouse / dress
      collar = (
        <g>
          <path d="M 104 219 Q 120 232 136 219 Q 132 228 120 230 Q 108 228 104 219 Z" fill={light} opacity={0.7} />
          <circle cx={120} cy={244} r={2.4} fill={light} />
          <circle cx={120} cy={258} r={2.4} fill={light} />
          <circle cx={120} cy={272} r={2.4} fill={light} />
        </g>
      )
      break
    default: // Casual crew
      collar = <path d="M 100 219 Q 120 233 140 219" fill="none" stroke={dark} strokeWidth={3} strokeLinecap="round" />
  }
  return (
    <g>
      <path d={base} fill={color} />
      <path d={rightShadow} fill={dark} opacity={0.28} />
      <path d="M 39 246 Q 50 227 78 219 L 80 224 Q 56 232 46 250 Z" fill={light} opacity={0.3} />
      <rect x={108} y={206} width={24} height={20} fill={skinFill} />
      {collar}
    </g>
  )
}

interface CharacterAvatarProps {
  config: AvatarConfig
  size?: number
  showGlow?: boolean
  className?: string
}

export function CharacterAvatar({ config, size = 200, showGlow = true, className }: CharacterAvatarProps) {
  const uid = useId().replace(/:/g, "")
  const skinId = `skin-${uid}`
  const hairId = `hair-${uid}`
  const irisId = `iris-${uid}`
  const auraId = `aura-${uid}`

  const { faceShape, skinTone, blush, hairStyle, hairColor, eyeStyle, eyeColor, eyebrowStyle, mouthStyle, outfitStyle, outfitColor, accessory } = config

  const skinFill = `url(#${skinId})`
  const skinShadow = shade(skinTone, -26)
  const hairHi = shade(hairColor, 55)
  const browColor = luminance(hairColor) > 0.6 ? shade(hairColor, -55) : shade(hairColor, -8)
  const facePath = faceShapes[faceShape] ?? faceShapes[0]
  const hair = getHair(hairStyle, hairId, hairHi)

  // mirror helper: render content + mirrored copy across x=120
  const Mirror = ({ children }: { children: React.ReactNode }) => (
    <>
      {children}
      <g transform="translate(240,0) scale(-1,1)">{children}</g>
    </>
  )

  const eyeNode = renderEye(eyeStyle, eyeColor, irisId, skinTone)
  const browNode = renderBrow(eyebrowStyle, browColor)
  const earNode = (
    <g>
      <ellipse cx={64} cy={127} rx={9} ry={13} fill={skinFill} />
      <path d="M 60 119 Q 67 124 63 134" fill="none" stroke={skinShadow} strokeWidth={1.6} opacity={0.5} strokeLinecap="round" />
    </g>
  )
  const earringNode = accessory === 2 ? <circle cx={64} cy={139} r={2.8} fill="#f5c542" stroke="#caa02a" strokeWidth={0.6} /> : null
  const lensNode =
    accessory === 1 ? (
      <g>
        <circle cx={99} cy={126} r={19} fill="#ffffff" opacity={0.07} stroke="#2b2b2b" strokeWidth={2.4} />
        <path d="M 80 116 L 68 113" stroke="#2b2b2b" strokeWidth={2.4} strokeLinecap="round" />
      </g>
    ) : null
  const blushNode = blush ? <ellipse cx={80} cy={150} rx={12} ry={7} fill="#ff8a8a" opacity={0.32} /> : null

  return (
    <svg
      width={size}
      height={size * (300 / 240)}
      viewBox="0 0 240 300"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={skinId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(skinTone, 12)} />
          <stop offset="68%" stopColor={skinTone} />
          <stop offset="100%" stopColor={shade(skinTone, -16)} />
        </linearGradient>
        <linearGradient id={hairId} x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={shade(hairColor, 32)} />
          <stop offset="50%" stopColor={hairColor} />
          <stop offset="100%" stopColor={shade(hairColor, -24)} />
        </linearGradient>
        <radialGradient id={irisId} cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor={shade(eyeColor, 70)} />
          <stop offset="55%" stopColor={eyeColor} />
          <stop offset="100%" stopColor={shade(eyeColor, -55)} />
        </radialGradient>
        <radialGradient id={auraId} cx="50%" cy="62%" r="55%">
          <stop offset="0%" stopColor={outfitColor} stopOpacity={0.22} />
          <stop offset="100%" stopColor={outfitColor} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* aura */}
      {showGlow && <ellipse cx={120} cy={210} rx={120} ry={88} fill={`url(#${auraId})`} />}

      {/* back hair */}
      {hair.back}

      {/* body / outfit */}
      {renderOutfit(outfitStyle, outfitColor, skinFill)}

      {/* neck */}
      <path d="M 108 190 L 108 222 Q 120 230 132 222 L 132 190 Z" fill={skinFill} />
      <ellipse cx={120} cy={197} rx={19} ry={7} fill={skinShadow} opacity={0.35} />

      {/* ears (behind face) */}
      <Mirror>{earNode}</Mirror>

      {/* face */}
      <path d={facePath} fill={skinFill} />
      {/* right-side soft shading */}
      <path d="M 174 112 C 174 150 150 188 120 192 C 140 184 156 156 158 116 Z" fill={skinShadow} opacity={0.16} />
      {/* forehead shadow from hair */}
      <ellipse cx={120} cy={90} rx={44} ry={9} fill={skinShadow} opacity={0.2} />

      {/* blush */}
      <Mirror>{blushNode}</Mirror>

      {/* eyes */}
      <Mirror>{eyeNode}</Mirror>

      {/* eyebrows */}
      <Mirror>{browNode}</Mirror>

      {/* nose */}
      <path d="M 116 146 Q 120 153 124 147" fill="none" stroke={skinShadow} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />

      {/* mouth */}
      {renderMouth(mouthStyle)}

      {/* front hair (bangs over forehead) */}
      {hair.front}

      {/* accessories */}
      {accessory === 1 && (
        <>
          <Mirror>{lensNode}</Mirror>
          <path d="M 117 123 Q 120 120 123 123" fill="none" stroke="#2b2b2b" strokeWidth={2.2} strokeLinecap="round" />
        </>
      )}
      {accessory === 2 && <Mirror>{earringNode}</Mirror>}
      {accessory === 3 && (
        <g>
          {/* star hair clip on left bangs */}
          <path
            d="M 82 80 L 85 87 L 92 87 L 86 91 L 89 98 L 82 94 L 75 98 L 78 91 L 72 87 L 79 87 Z"
            fill="#f5c542"
            stroke="#caa02a"
            strokeWidth={0.6}
          />
        </g>
      )}
    </svg>
  )
}
