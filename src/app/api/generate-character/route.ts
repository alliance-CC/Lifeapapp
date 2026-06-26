import { NextRequest, NextResponse } from "next/server"

const stylePrompts: Record<string, string> = {
  pixar: "Pixar 3D CGI animation style, highly detailed character, vibrant colors, soft warm lighting, rendered",
  ghibli: "Studio Ghibli anime art style, hand-drawn watercolor, gentle whimsical atmosphere, detailed background",
  manga: "Japanese manga style, clean expressive line art with screen tones, professional shojo or shonen quality",
  anime: "modern Japanese anime art style, colorful vivid palette, detailed cel shading, professional quality",
  chibi: "super cute chibi character, tiny body oversized head, huge sparkly eyes, kawaii style, pastel colors",
  game: "mobile RPG game character icon, vibrant saturated colors, dynamic heroic pose, fantasy style, detailed armor or outfit",
  realistic: "semi-realistic digital painting, painterly textures, professional character concept art, detailed lighting",
  watercolor: "soft watercolor illustration, pastel dreamy colors, loose expressive brushstrokes, artistic",
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
// Try the dedicated Imagen models first, then fall back to Gemini's native
// image generation. Model availability differs by account/region, so we try a
// few in order and use the first that succeeds.
const GEMINI_IMAGEN_MODELS = ["imagen-3.0-generate-002", "imagen-3.0-generate-001"]
const GEMINI_FLASH_IMAGE_MODELS = [
  "gemini-2.0-flash-preview-image-generation",
  "gemini-2.0-flash-exp-image-generation",
]

type GenResult = { dataUrl: string } | { error: string; status: number }

async function generateWithGemini(key: string, prompt: string): Promise<GenResult> {
  let lastError = "Geminiでの画像生成に失敗しました"
  let lastStatus = 502

  // 1) Imagen (predict endpoint)
  for (const model of GEMINI_IMAGEN_MODELS) {
    try {
      const res = await fetch(`${GEMINI_BASE}/${model}:predict?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const pred = data?.predictions?.[0]
        const b64 = pred?.bytesBase64Encoded
        const mime = pred?.mimeType || "image/png"
        if (b64) return { dataUrl: `data:${mime};base64,${b64}` }
      } else {
        const err = await res.json().catch(() => null)
        lastError = err?.error?.message || lastError
        lastStatus = res.status
        // 404 = model not available for this key, try the next candidate
        if (res.status !== 404 && res.status !== 400) break
      }
    } catch {
      // network error, try next model
    }
  }

  // 2) Gemini native image generation (generateContent endpoint)
  for (const model of GEMINI_FLASH_IMAGE_MODELS) {
    try {
      const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const parts = data?.candidates?.[0]?.content?.parts || []
        const imgPart = parts.find((p: { inlineData?: { data?: string } }) => p?.inlineData?.data)
        const b64 = imgPart?.inlineData?.data
        const mime = imgPart?.inlineData?.mimeType || "image/png"
        if (b64) return { dataUrl: `data:${mime};base64,${b64}` }
      } else {
        const err = await res.json().catch(() => null)
        lastError = err?.error?.message || lastError
        lastStatus = res.status
        if (res.status !== 404 && res.status !== 400) break
      }
    } catch {
      // network error, try next model
    }
  }

  return { error: lastError, status: lastStatus }
}

async function generateWithOpenAI(key: string, prompt: string): Promise<GenResult> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
      quality: "standard",
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    return { error: err?.error?.message || "画像生成に失敗しました", status: res.status }
  }
  const data = await res.json()
  const b64 = data?.data?.[0]?.b64_json
  if (!b64) return { error: "画像データを取得できませんでした", status: 502 }
  return { dataUrl: `data:image/png;base64,${b64}` }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { style, description, apiKey, provider } = body as {
      style?: string
      description?: string
      apiKey?: string
      provider?: "gemini" | "openai"
    }

    // Resolve key + provider. OpenAI keys start with "sk-"; everything else
    // (Google AI Studio keys start with "AIza") is treated as Gemini.
    const clientKey = (apiKey || "").trim()
    const isOpenAiKey = clientKey.startsWith("sk-")
    const resolvedProvider =
      provider || (isOpenAiKey ? "openai" : "gemini")

    const key =
      resolvedProvider === "openai"
        ? process.env.OPENAI_API_KEY || clientKey
        : process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || clientKey

    if (!key) {
      return NextResponse.json(
        {
          error:
            resolvedProvider === "openai"
              ? "OpenAI APIキーが設定されていません。設定ページでAPIキーを登録してください。"
              : "Gemini APIキーが設定されていません。設定ページでAPIキーを登録してください。",
        },
        { status: 400 }
      )
    }

    const styleDesc = stylePrompts[style || "anime"] || stylePrompts.anime
    const charDesc = description?.trim()
      ? description.trim()
      : "a cheerful young person with a friendly smile, suitable as an app mascot"

    const prompt = `A character illustration for a mobile app. Style: ${styleDesc}. Character: ${charDesc}. Half-body or full-body portrait. Clean white or light neutral background. High quality clean artwork suitable for a game icon or app support character. No text, no watermarks, no logos.`

    const result =
      resolvedProvider === "openai"
        ? await generateWithOpenAI(key, prompt)
        : await generateWithGemini(key, prompt)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }
    return NextResponse.json({ url: result.dataUrl, provider: resolvedProvider })
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
