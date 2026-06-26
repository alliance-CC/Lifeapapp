// パスワードハッシュ & セッションCookie（Node crypto を使用、サーバー専用）
import crypto from "crypto"
import { cookies } from "next/headers"

const SESSION_COOKIE = "lifeup_session"
const SESSION_DAYS = 30

function getSessionSecret() {
  return process.env.SESSION_SECRET || process.env.SHEETS_API_SECRET || "lifeup-dev-secret"
}

// --- パスワード -------------------------------------------------
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) return false
  const [salt, hash] = stored.split(":")
  const test = crypto.scryptSync(password, salt, 64).toString("hex")
  const a = Buffer.from(hash, "hex")
  const b = Buffer.from(test, "hex")
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// --- セッショントークン ----------------------------------------
function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function createSessionToken(userId: string): string {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = base64url(JSON.stringify({ uid: userId, exp }))
  const sig = base64url(
    crypto.createHmac("sha256", getSessionSecret()).update(payload).digest()
  )
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string): { uid: string } | null {
  if (!token || !token.includes(".")) return null
  const [payload, sig] = token.split(".")
  const expected = base64url(
    crypto.createHmac("sha256", getSessionSecret()).update(payload).digest()
  )
  if (sig !== expected) return null
  try {
    const data = JSON.parse(Buffer.from(payload, "base64").toString("utf8"))
    if (!data.exp || Date.now() > data.exp) return null
    return { uid: data.uid }
  } catch {
    return null
  }
}

// --- Cookie ヘルパー -------------------------------------------
export async function setSessionCookie(userId: string) {
  const token = createSessionToken(userId)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const verified = verifySessionToken(token)
  return verified?.uid ?? null
}

export { SESSION_COOKIE }
