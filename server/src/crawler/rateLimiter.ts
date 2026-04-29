// Per-domain rate limiter — prevents hammering the same host
// Stored in-process memory (resets on restart, which is fine)

const lastHit = new Map<string, number>()

function domain(url: string): string {
  try { return new URL(url).hostname }
  catch { return url }
}

/**
 * Returns true immediately if the domain hasn't been hit within `minIntervalMs`.
 * Otherwise resolves after the remaining wait time.
 */
export async function rateLimit(url: string, minIntervalMs = 1000): Promise<void> {
  const key  = domain(url)
  const last = lastHit.get(key) ?? 0
  const wait = minIntervalMs - (Date.now() - last)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastHit.set(key, Date.now())
}

/**
 * Wraps a fetch call with automatic per-domain rate limiting.
 */
export async function rateLimitedFetch(
  url: string,
  init?: RequestInit,
  minIntervalMs = 1500,
): Promise<Response> {
  await rateLimit(url, minIntervalMs)
  return fetch(url, init)
}
