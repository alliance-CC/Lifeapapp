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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { style, description, apiKey } = body

    const key = process.env.OPENAI_API_KEY || apiKey
    if (!key) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません。設定ページでAPIキーを登録してください。" },
        { status: 400 }
      )
    }

    const styleDesc = stylePrompts[style] || stylePrompts.anime
    const charDesc = description?.trim()
      ? description.trim()
      : "a cheerful young person with a friendly smile, suitable as an app mascot"

    const prompt = `A character illustration for a mobile app. Style: ${styleDesc}. Character: ${charDesc}. Half-body or full-body portrait. White or light neutral background. High quality clean artwork suitable for a game icon or app support character. No text, no watermarks, no logos.`

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
        quality: "standard",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      const message = error.error?.message || "画像生成に失敗しました"
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const data = await response.json()
    const b64 = data.data[0].b64_json
    const dataUrl = `data:image/png;base64,${b64}`

    return NextResponse.json({ url: dataUrl })
  } catch {
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
