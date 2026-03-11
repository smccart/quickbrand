import type { SecurityInput } from '../types';

interface HeaderEntry {
  key: string;
  value: string;
  comment: string;
}

function getHeaders(input: SecurityInput): HeaderEntry[] {
  const appType = input.appType || 'website';
  const url = input.siteUrl.replace(/\/$/, '');

  const headers: HeaderEntry[] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
      comment: 'Enforce HTTPS for 2 years, include subdomains, allow preload list',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
      comment: 'Prevent MIME type sniffing',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
      comment: 'Prevent clickjacking by disallowing framing',
    },
    {
      key: 'X-XSS-Protection',
      value: '0',
      comment: 'Disable legacy XSS filter (CSP is the modern replacement)',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
      comment: 'Only send origin on cross-origin requests',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=()',
      comment: 'Restrict browser feature access',
    },
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'off',
      comment: 'Disable DNS prefetching for privacy',
    },
    {
      key: 'Cross-Origin-Opener-Policy',
      value: 'same-origin',
      comment: 'Isolate browsing context from cross-origin popups',
    },
    {
      key: 'Cross-Origin-Resource-Policy',
      value: appType === 'api' ? 'cross-origin' : 'same-origin',
      comment: appType === 'api'
        ? 'Allow cross-origin resource loading for API'
        : 'Restrict resource loading to same origin',
    },
    {
      key: 'Cross-Origin-Embedder-Policy',
      value: appType === 'api' ? 'unsafe-none' : 'require-corp',
      comment: appType === 'api'
        ? 'Allow embedding for API responses'
        : 'Require CORP for embedded resources (enables SharedArrayBuffer)',
    },
  ];

  if (appType !== 'api') {
    headers.push({
      key: 'Cache-Control',
      value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
      comment: 'Prevent caching of sensitive pages (adjust per-route as needed)',
    });
  }

  return headers;
}

export function securityHeadersTemplate(input: SecurityInput): { content: string; language: 'typescript'; filename: string } {
  const headers = getHeaders(input);
  const framework = input.framework || 'generic';

  const lines: string[] = [
    `// Security Headers for ${input.siteName}`,
    `// ${headers.length} headers configured for ${input.appType || 'website'}`,
    '',
  ];

  if (framework === 'express') {
    lines.push(
      `import helmet from 'helmet';`,
      '',
      '// helmet sets many of these by default.',
      '// These are explicit overrides and additions:',
      'app.use(helmet());',
      '',
      '// Additional custom headers',
      'app.use((req, res, next) => {',
    );
    for (const h of headers) {
      lines.push(`  // ${h.comment}`);
      lines.push(`  res.setHeader('${h.key}', '${h.value}');`);
    }
    lines.push('  next();', '});');
  } else if (framework === 'nextjs') {
    lines.push(
      '// next.config.js — headers()',
      'async headers() {',
      '  return [',
      '    {',
      '      source: "/(.*)",',
      '      headers: [',
    );
    for (const h of headers) {
      lines.push(`        // ${h.comment}`);
      lines.push(`        { key: "${h.key}", value: "${h.value}" },`);
    }
    lines.push('      ],', '    },', '  ];', '}');
  } else if (framework === 'hono') {
    lines.push(
      `import { secureHeaders } from 'hono/secure-headers';`,
      '',
      'app.use(secureHeaders());',
      '',
      '// Additional custom headers',
      'app.use(async (c, next) => {',
    );
    for (const h of headers) {
      lines.push(`  // ${h.comment}`);
      lines.push(`  c.header('${h.key}', '${h.value}');`);
    }
    lines.push('  await next();', '});');
  } else if (framework === 'fastify') {
    lines.push(
      `import helmet from '@fastify/helmet';`,
      '',
      'await fastify.register(helmet);',
      '',
      '// Additional custom headers',
      "fastify.addHook('onSend', async (request, reply) => {",
    );
    for (const h of headers) {
      lines.push(`  // ${h.comment}`);
      lines.push(`  reply.header('${h.key}', '${h.value}');`);
    }
    lines.push('});');
  } else {
    lines.push('# HTTP Security Headers', `# For: ${input.siteUrl}`, '');
    for (const h of headers) {
      lines.push(`# ${h.comment}`);
      lines.push(`${h.key}: ${h.value}`);
      lines.push('');
    }
  }

  return { content: lines.join('\n'), language: 'typescript', filename: 'security-headers.ts' };
}
