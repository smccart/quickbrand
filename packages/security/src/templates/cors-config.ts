import type { SecurityInput, CorsConfig } from '../types';

function defaultCors(input: SecurityInput): CorsConfig {
  const url = input.siteUrl.replace(/\/$/, '');
  return {
    origins: [url],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Request-Id'],
    credentials: true,
    maxAge: 86400,
  };
}

export function corsConfigTemplate(input: SecurityInput): { content: string; language: 'typescript'; filename: string } {
  const cors = { ...defaultCors(input), ...input.corsConfig };
  const framework = input.framework || 'generic';

  const lines: string[] = [
    `// CORS Configuration for ${input.siteName}`,
    `// Allowed Origins: ${cors.origins.join(', ')}`,
    '',
  ];

  if (framework === 'express') {
    lines.push(
      `import cors from 'cors';`,
      '',
      'const corsOptions: cors.CorsOptions = {',
      `  origin: ${cors.origins.length === 1 ? `'${cors.origins[0]}'` : JSON.stringify(cors.origins)},`,
      `  methods: ${JSON.stringify(cors.methods)},`,
      `  allowedHeaders: ${JSON.stringify(cors.allowedHeaders)},`,
      `  exposedHeaders: ${JSON.stringify(cors.exposedHeaders)},`,
      `  credentials: ${cors.credentials},`,
      `  maxAge: ${cors.maxAge},`,
      '};',
      '',
      'app.use(cors(corsOptions));',
      '',
      '// For preflight requests',
      "app.options('*', cors(corsOptions));",
    );
  } else if (framework === 'nextjs') {
    lines.push(
      '// middleware.ts',
      `import { NextResponse } from 'next/server';`,
      `import type { NextRequest } from 'next/server';`,
      '',
      `const allowedOrigins = ${JSON.stringify(cors.origins)};`,
      '',
      'export function middleware(request: NextRequest) {',
      '  const origin = request.headers.get("origin") ?? "";',
      '  const isAllowed = allowedOrigins.includes(origin);',
      '',
      '  if (request.method === "OPTIONS") {',
      '    return new NextResponse(null, {',
      '      status: 204,',
      '      headers: {',
      '        "Access-Control-Allow-Origin": isAllowed ? origin : "",',
      `        "Access-Control-Allow-Methods": ${JSON.stringify((cors.methods || []).join(', '))},`,
      `        "Access-Control-Allow-Headers": ${JSON.stringify((cors.allowedHeaders || []).join(', '))},`,
      `        "Access-Control-Max-Age": "${cors.maxAge}",`,
      `        "Access-Control-Allow-Credentials": "${cors.credentials}",`,
      '      },',
      '    });',
      '  }',
      '',
      '  const response = NextResponse.next();',
      '  if (isAllowed) {',
      '    response.headers.set("Access-Control-Allow-Origin", origin);',
      `    response.headers.set("Access-Control-Allow-Credentials", "${cors.credentials}");`,
      '  }',
      '  return response;',
      '}',
      '',
      'export const config = {',
      '  matcher: "/api/:path*",',
      '};',
    );
  } else if (framework === 'hono') {
    lines.push(
      `import { cors } from 'hono/cors';`,
      '',
      'app.use(',
      "  '/api/*',",
      '  cors({',
      `    origin: ${cors.origins.length === 1 ? `'${cors.origins[0]}'` : JSON.stringify(cors.origins)},`,
      `    allowMethods: ${JSON.stringify(cors.methods)},`,
      `    allowHeaders: ${JSON.stringify(cors.allowedHeaders)},`,
      `    exposeHeaders: ${JSON.stringify(cors.exposedHeaders)},`,
      `    credentials: ${cors.credentials},`,
      `    maxAge: ${cors.maxAge},`,
      '  })',
      ');',
    );
  } else if (framework === 'fastify') {
    lines.push(
      `import cors from '@fastify/cors';`,
      '',
      'await fastify.register(cors, {',
      `  origin: ${cors.origins.length === 1 ? `'${cors.origins[0]}'` : JSON.stringify(cors.origins)},`,
      `  methods: ${JSON.stringify(cors.methods)},`,
      `  allowedHeaders: ${JSON.stringify(cors.allowedHeaders)},`,
      `  exposedHeaders: ${JSON.stringify(cors.exposedHeaders)},`,
      `  credentials: ${cors.credentials},`,
      `  maxAge: ${cors.maxAge},`,
      '});',
    );
  } else {
    lines.push(
      '# Generic CORS Headers',
      `Access-Control-Allow-Origin: ${cors.origins.join(', ')}`,
      `Access-Control-Allow-Methods: ${(cors.methods || []).join(', ')}`,
      `Access-Control-Allow-Headers: ${(cors.allowedHeaders || []).join(', ')}`,
      `Access-Control-Expose-Headers: ${(cors.exposedHeaders || []).join(', ')}`,
      `Access-Control-Allow-Credentials: ${cors.credentials}`,
      `Access-Control-Max-Age: ${cors.maxAge}`,
    );
  }

  return { content: lines.join('\n'), language: 'typescript', filename: 'cors-config.ts' };
}
