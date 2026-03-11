import type { SecurityInput, RateLimitConfig } from '../types';

function getDefaults(input: SecurityInput): RateLimitConfig {
  const appType = input.appType || 'website';
  return {
    windowMs: appType === 'api' ? 60_000 : 15 * 60_000,
    maxRequests: appType === 'api' ? 100 : 1000,
    keyBy: appType === 'api' ? 'api-key' : 'ip',
    skipSuccessful: false,
  };
}

export function rateLimitTemplate(input: SecurityInput): { content: string; language: 'typescript'; filename: string } {
  const config = { ...getDefaults(input), ...input.rateLimitConfig };
  const framework = input.framework || 'generic';

  const lines: string[] = [
    `// Rate Limiting for ${input.siteName}`,
    `// Window: ${(config.windowMs! / 1000)}s | Max: ${config.maxRequests} requests | Key: ${config.keyBy}`,
    '',
  ];

  if (framework === 'express') {
    lines.push(
      `import rateLimit from 'express-rate-limit';`,
      `import type { Request } from 'express';`,
      '',
      'export const limiter = rateLimit({',
      `  windowMs: ${config.windowMs},`,
      `  max: ${config.maxRequests},`,
      '  standardHeaders: "draft-7",',
      '  legacyHeaders: false,',
    );
    if (config.keyBy === 'api-key') {
      lines.push(
        '  keyGenerator: (req: Request) => {',
        '    return (req.headers["x-api-key"] as string) || req.ip || "unknown";',
        '  },',
      );
    } else if (config.keyBy === 'user-id') {
      lines.push(
        '  keyGenerator: (req: Request) => {',
        '    return (req as any).user?.id || req.ip || "unknown";',
        '  },',
      );
    }
    if (config.skipSuccessful) {
      lines.push('  skipSuccessfulRequests: true,');
    }
    lines.push(
      '  message: {',
      '    error: "Too many requests, please try again later.",',
      '    retryAfter: Math.ceil((config.windowMs || 60000) / 1000),',
      '  },',
      '});',
      '',
      '// Apply globally',
      'app.use(limiter);',
      '',
      '// Or apply to specific routes',
      '// app.use("/api/", limiter);',
      '',
      '// Stricter limiter for auth endpoints',
      'export const authLimiter = rateLimit({',
      '  windowMs: 15 * 60 * 1000,',
      '  max: 5,',
      '  standardHeaders: "draft-7",',
      '  legacyHeaders: false,',
      '  message: { error: "Too many login attempts, please try again in 15 minutes." },',
      '});',
      '',
      '// app.use("/auth/login", authLimiter);',
    );
  } else if (framework === 'nextjs') {
    lines.push(
      '// In-memory rate limiter for Next.js (replace with Redis for production)',
      '',
      'const rateMap = new Map<string, { count: number; resetTime: number }>();',
      '',
      `const WINDOW_MS = ${config.windowMs};`,
      `const MAX_REQUESTS = ${config.maxRequests};`,
      '',
      'export function rateLimit(key: string): { success: boolean; remaining: number; resetIn: number } {',
      '  const now = Date.now();',
      '  const entry = rateMap.get(key);',
      '',
      '  if (!entry || now > entry.resetTime) {',
      '    rateMap.set(key, { count: 1, resetTime: now + WINDOW_MS });',
      '    return { success: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };',
      '  }',
      '',
      '  if (entry.count >= MAX_REQUESTS) {',
      '    return { success: false, remaining: 0, resetIn: entry.resetTime - now };',
      '  }',
      '',
      '  entry.count++;',
      '  return { success: true, remaining: MAX_REQUESTS - entry.count, resetIn: entry.resetTime - now };',
      '}',
      '',
      '// Usage in API route:',
      '// const ip = request.headers.get("x-forwarded-for") ?? "unknown";',
      '// const { success, remaining } = rateLimit(ip);',
      '// if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });',
    );
  } else if (framework === 'hono') {
    lines.push(
      '// Hono rate limiter middleware',
      '',
      'const rateMap = new Map<string, { count: number; resetTime: number }>();',
      '',
      `const WINDOW_MS = ${config.windowMs};`,
      `const MAX_REQUESTS = ${config.maxRequests};`,
      '',
      `import type { Context, Next } from 'hono';`,
      '',
      'export async function rateLimiter(c: Context, next: Next) {',
      `  const key = ${config.keyBy === 'api-key' ? 'c.req.header("x-api-key")' : 'c.req.header("x-forwarded-for")'} ?? "unknown";`,
      '  const now = Date.now();',
      '  const entry = rateMap.get(key);',
      '',
      '  if (!entry || now > entry.resetTime) {',
      '    rateMap.set(key, { count: 1, resetTime: now + WINDOW_MS });',
      '    c.header("X-RateLimit-Remaining", String(MAX_REQUESTS - 1));',
      '    return next();',
      '  }',
      '',
      '  if (entry.count >= MAX_REQUESTS) {',
      '    c.header("Retry-After", String(Math.ceil((entry.resetTime - now) / 1000)));',
      '    return c.json({ error: "Too many requests" }, 429);',
      '  }',
      '',
      '  entry.count++;',
      '  c.header("X-RateLimit-Remaining", String(MAX_REQUESTS - entry.count));',
      '  return next();',
      '}',
      '',
      "// app.use('/api/*', rateLimiter);",
    );
  } else if (framework === 'fastify') {
    lines.push(
      `import rateLimit from '@fastify/rate-limit';`,
      '',
      'await fastify.register(rateLimit, {',
      `  max: ${config.maxRequests},`,
      `  timeWindow: ${config.windowMs},`,
    );
    if (config.keyBy === 'api-key') {
      lines.push(
        '  keyGenerator: (request) => {',
        '    return request.headers["x-api-key"] as string || request.ip;',
        '  },',
      );
    }
    lines.push(
      '  errorResponseBuilder: (request, context) => ({',
      '    statusCode: 429,',
      '    error: "Too Many Requests",',
      '    message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,',
      '  }),',
      '});',
    );
  } else {
    lines.push(
      '// Generic rate limiting headers',
      `# Window: ${(config.windowMs! / 1000)} seconds`,
      `# Max Requests: ${config.maxRequests}`,
      '',
      '# Response headers to include:',
      `X-RateLimit-Limit: ${config.maxRequests}`,
      'X-RateLimit-Remaining: <remaining>',
      'X-RateLimit-Reset: <unix_timestamp>',
      'Retry-After: <seconds> (on 429)',
    );
  }

  return { content: lines.join('\n'), language: 'typescript', filename: 'rate-limiter.ts' };
}
