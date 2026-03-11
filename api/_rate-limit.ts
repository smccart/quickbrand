// Simple in-memory rate limiter for Vercel serverless functions.
// Provides per-IP throttling during warm instances. Resets on cold starts,
// which is acceptable for a free API — just prevents hot-loop abuse.

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;  // 60 requests per minute per IP

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Periodic cleanup to avoid memory leak in long-lived instances
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, WINDOW_MS);

export function rateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(ip, entry);
  }

  entry.count++;

  return {
    allowed: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  };
}

export function rateLimitHeaders(result: ReturnType<typeof rateLimit>): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(MAX_REQUESTS),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}
