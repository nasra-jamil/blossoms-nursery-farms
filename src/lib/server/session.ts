/**
 * Stateless admin session tokens: `<expiresAt>.<hmac>` signed with a server
 * secret. Uses Web Crypto only, so it runs in middleware (edge) and Node.
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

const enc = new TextEncoder();

function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return s && s.length > 0 ? s : null;
}

async function hmac(key: string, message: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(message));
  let bin = "";
  for (const byte of new Uint8Array(sig)) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken() {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD is not configured");
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${expires}.${await hmac(key, `session:${expires}`)}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  const key = secret();
  if (!key || !token) return false;
  const [expStr, sig] = token.split(".");
  const expires = Number(expStr);
  if (!expStr || !sig || !Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(key, `session:${expires}`));
}

/** Compares a submitted password against ADMIN_PASSWORD without leaking timing. */
export async function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([hmac("pw", input), hmac("pw", expected)]);
  return safeEqual(a, b);
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);
