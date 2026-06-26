// Google スプレッドシート（GAS Web App）をバックエンドとして呼び出すサーバー専用クライアント。
// SHEETS_API_URL / SHEETS_API_SECRET は環境変数。ブラウザには絶対に露出させないこと。

export function isSheetsConfigured() {
  return Boolean(process.env.SHEETS_API_URL && process.env.SHEETS_API_SECRET)
}

type SheetsResponse = Record<string, unknown> & { error?: string }

export async function callSheets<T = SheetsResponse>(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  const url = process.env.SHEETS_API_URL
  const secret = process.env.SHEETS_API_SECRET
  if (!url || !secret) {
    throw new Error("SHEETS_API_URL / SHEETS_API_SECRET が設定されていません")
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, secret, ...payload }),
    // GASは302リダイレクトを挟むことがあるため follow
    redirect: "follow",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`スプレッドシートAPIエラー (${res.status})`)
  }

  const data = (await res.json()) as T
  return data
}
