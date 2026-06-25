"use client"

export type AvatarConfig = {
  skinTone: string
  hairStyle: number
  hairColor: string
  eyeStyle: number
  outfitStyle: number
  outfitColor: string
  personality: string
}

export const defaultAvatar: AvatarConfig = {
  skinTone: "#FDDBB4",
  hairStyle: 0,
  hairColor: "#171717",
  eyeStyle: 0,
  outfitStyle: 0,
  outfitColor: "#f97316",
  personality: "cheerful",
}

const hairPaths: Record<number, (color: string) => React.ReactNode> = {
  0: (c) => (
    // Short buzz cut
    <g>
      <path d="M 48 112 Q 48 50 100 50 Q 152 50 152 112 Q 150 88 100 84 Q 50 88 48 112 Z" fill={c} />
      <path d="M 50 108 Q 48 95 48 112 Q 52 105 56 102" fill={c} />
      <path d="M 150 108 Q 152 95 152 112 Q 148 105 144 102" fill={c} />
    </g>
  ),
  1: (c) => (
    // Medium bob
    <g>
      <path d="M 43 118 Q 40 85 48 65 Q 60 44 100 42 Q 140 44 152 65 Q 160 85 157 118 Q 154 140 148 152 Q 132 162 116 163 L 100 164 L 84 163 Q 68 162 52 152 Q 46 140 43 118 Z" fill={c} />
    </g>
  ),
  2: (c) => (
    // Long straight
    <g>
      <path d="M 43 118 Q 38 78 48 58 Q 60 38 100 36 Q 140 38 152 58 Q 162 78 157 118 L 155 210 Q 148 218 140 216 L 138 168 Q 120 170 100 170 Q 80 170 62 168 L 60 216 Q 52 218 45 210 Z" fill={c} />
      {/* Front hair fringe */}
      <path d="M 60 85 Q 72 78 88 80 Q 94 88 88 95 Q 78 90 68 92 Z" fill={c} />
      <path d="M 140 85 Q 128 78 112 80 Q 106 88 112 95 Q 122 90 132 92 Z" fill={c} />
    </g>
  ),
  3: (c) => (
    // Ponytail
    <g>
      {/* Main top */}
      <path d="M 50 105 Q 50 50 100 50 Q 150 50 150 105 Q 148 82 100 78 Q 52 82 50 105 Z" fill={c} />
      {/* Side pieces */}
      <path d="M 50 105 Q 46 120 48 135 Q 52 145 55 148" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" />
      <path d="M 150 105 Q 154 120 152 135 Q 148 145 145 148" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" />
      {/* Ponytail tie + tail */}
      <circle cx="148" cy="88" r="6" fill={c} />
      <path d="M 150 88 Q 168 90 172 105 Q 175 122 165 132 Q 158 138 150 130" fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" />
      <circle cx="148" cy="88" r="5" fill="#fff" opacity="0.3" />
    </g>
  ),
  4: (c) => (
    // Curly / wavy
    <g>
      <path d="M 44 105 Q 40 80 44 62 Q 50 42 68 38 Q 84 34 100 34 Q 116 34 132 38 Q 150 42 156 62 Q 160 80 156 105 Q 152 78 146 68 Q 136 54 120 50 Q 110 47 100 47 Q 90 47 80 50 Q 64 54 54 68 Q 48 78 44 105 Z" fill={c} />
      {/* Curls on sides */}
      <ellipse cx="44" cy="112" rx="12" ry="10" fill={c} />
      <ellipse cx="156" cy="112" rx="12" ry="10" fill={c} />
      <ellipse cx="40" cy="128" rx="10" ry="9" fill={c} />
      <ellipse cx="160" cy="128" rx="10" ry="9" fill={c} />
      <ellipse cx="46" cy="142" rx="9" ry="8" fill={c} />
      <ellipse cx="154" cy="142" rx="9" ry="8" fill={c} />
      {/* Top curls */}
      <ellipse cx="75" cy="42" rx="14" ry="12" fill={c} />
      <ellipse cx="100" cy="37" rx="16" ry="13" fill={c} />
      <ellipse cx="125" cy="42" rx="14" ry="12" fill={c} />
    </g>
  ),
}

const eyePaths: Record<number, (skin: string) => React.ReactNode> = {
  0: () => (
    // Normal eyes
    <g>
      <ellipse cx="82" cy="108" rx="7" ry="7.5" fill="#1a1a2e" />
      <ellipse cx="118" cy="108" rx="7" ry="7.5" fill="#1a1a2e" />
      <circle cx="84" cy="106" r="2.5" fill="white" />
      <circle cx="120" cy="106" r="2.5" fill="white" />
    </g>
  ),
  1: () => (
    // Happy eyes (arcs)
    <g>
      <path d="M 75 112 Q 82 104 89 112" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 111 112 Q 118 104 125 112" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  2: () => (
    // Cool eyes (half-closed)
    <g>
      <ellipse cx="82" cy="110" rx="7.5" ry="5" fill="#1a1a2e" />
      <ellipse cx="118" cy="110" rx="7.5" ry="5" fill="#1a1a2e" />
      <path d="M 74 107 Q 82 104 90 107" stroke="#1a1a2e" strokeWidth="2.5" fill="none" />
      <path d="M 110 107 Q 118 104 126 107" stroke="#1a1a2e" strokeWidth="2.5" fill="none" />
      <circle cx="84" cy="110" r="2" fill="white" />
      <circle cx="120" cy="110" r="2" fill="white" />
    </g>
  ),
}

const outfitPaths: Record<number, (color: string, skin: string) => React.ReactNode> = {
  0: (c, skin) => (
    // Casual top
    <g>
      <path d="M 28 240 L 32 175 Q 50 160 100 158 Q 150 160 168 175 L 172 240 Z" fill={c} />
      <path d="M 32 175 Q 28 185 30 200 L 35 200 Q 36 185 40 178 Z" fill={c} opacity="0.7" />
      <path d="M 168 175 Q 172 185 170 200 L 165 200 Q 164 185 160 178 Z" fill={c} opacity="0.7" />
      <rect x="88" y="158" width="24" height="22" rx="2" fill={skin} />
      {/* Collar */}
      <path d="M 88 168 Q 100 175 112 168" fill="none" stroke={c} strokeWidth="3" opacity="0.6" />
    </g>
  ),
  1: (c, skin) => (
    // Formal shirt/blazer
    <g>
      <path d="M 28 240 L 32 175 Q 50 160 100 158 Q 150 160 168 175 L 172 240 Z" fill={c} />
      <rect x="88" y="158" width="24" height="22" rx="2" fill={skin} />
      {/* Lapels */}
      <path d="M 88 168 L 82 180 L 100 178 Z" fill="white" opacity="0.9" />
      <path d="M 112 168 L 118 180 L 100 178 Z" fill="white" opacity="0.9" />
      {/* Tie */}
      <path d="M 97 178 L 100 178 L 103 178 L 102 210 L 100 215 L 98 210 Z" fill="#ef4444" opacity="0.8" />
      {/* Pocket square */}
      <rect x="125" y="182" width="10" height="8" rx="1" fill="white" opacity="0.6" />
    </g>
  ),
  2: (c, skin) => (
    // Sporty jersey
    <g>
      <path d="M 28 240 L 32 175 Q 50 160 100 158 Q 150 160 168 175 L 172 240 Z" fill={c} />
      <rect x="88" y="158" width="24" height="22" rx="2" fill={skin} />
      {/* Stripes */}
      <path d="M 32 175 L 38 220 L 48 220 L 45 175 Z" fill="white" opacity="0.25" />
      <path d="M 168 175 L 162 220 L 152 220 L 155 175 Z" fill="white" opacity="0.25" />
      {/* Number */}
      <text x="100" y="210" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" opacity="0.7" fontFamily="sans-serif">7</text>
      {/* V-neck */}
      <path d="M 88 168 L 100 180 L 112 168" fill="none" stroke="white" strokeWidth="2.5" opacity="0.5" />
    </g>
  ),
  3: (c, skin) => (
    // Uniform/work jacket
    <g>
      <path d="M 28 240 L 32 175 Q 50 160 100 158 Q 150 160 168 175 L 172 240 Z" fill={c} />
      <rect x="88" y="158" width="24" height="22" rx="2" fill={skin} />
      {/* Buttons */}
      <circle cx="100" cy="185" r="3" fill="white" opacity="0.6" />
      <circle cx="100" cy="198" r="3" fill="white" opacity="0.6" />
      <circle cx="100" cy="211" r="3" fill="white" opacity="0.6" />
      {/* Badge */}
      <rect x="60" y="180" width="20" height="15" rx="2" fill="white" opacity="0.3" />
      <rect x="62" y="182" width="16" height="11" rx="1" fill={c} opacity="0.5" />
    </g>
  ),
}

interface CharacterAvatarProps {
  config: AvatarConfig
  size?: number
  showGlow?: boolean
  className?: string
}

export function CharacterAvatar({ config, size = 160, showGlow = true, className }: CharacterAvatarProps) {
  const { skinTone, hairStyle, hairColor, eyeStyle, outfitStyle, outfitColor } = config

  const hairRenderer = hairPaths[hairStyle] ?? hairPaths[0]
  const eyeRenderer = eyePaths[eyeStyle] ?? eyePaths[0]
  const outfitRenderer = outfitPaths[outfitStyle] ?? outfitPaths[0]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* Glow aura */}
      {showGlow && (
        <defs>
          <radialGradient id={`aura-${outfitColor.replace("#", "")}`} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={outfitColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={outfitColor} stopOpacity="0" />
          </radialGradient>
        </defs>
      )}
      {showGlow && (
        <ellipse cx="100" cy="200" rx="90" ry="60" fill={`url(#aura-${outfitColor.replace("#", "")})`} />
      )}

      {/* Hair back layer */}
      {hairRenderer(hairColor)}

      {/* Outfit / body */}
      {outfitRenderer(outfitColor, skinTone)}

      {/* Neck */}
      <rect x="88" y="154" width="24" height="18" rx="3" fill={skinTone} />

      {/* Head */}
      <circle cx="100" cy="108" r="54" fill={skinTone} />

      {/* Cheek blush */}
      <ellipse cx="76" cy="120" rx="11" ry="7" fill="#f9a8d4" opacity="0.3" />
      <ellipse cx="124" cy="120" rx="11" ry="7" fill="#f9a8d4" opacity="0.3" />

      {/* Eyes */}
      {eyeRenderer(skinTone)}

      {/* Eyebrows */}
      <path d="M 74 99 Q 82 94 90 99" stroke="#444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 110 99 Q 118 94 126 99" stroke="#444" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <path d="M 98 114 Q 100 118 102 114" stroke={skinTone === "#FDDBB4" ? "#d4956a" : "#b07850"} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Mouth smile */}
      <path d="M 88 124 Q 100 132 112 124" stroke="#c2856a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
