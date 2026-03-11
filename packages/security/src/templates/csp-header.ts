import type { SecurityInput, CspDirectives } from '../types';

const DEFAULT_CSP: CspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  connectSrc: ["'self'"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: true,
  blockAllMixedContent: true,
};

const SAAS_OVERRIDES: Partial<CspDirectives> = {
  scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  connectSrc: ["'self'", 'https://api.*', 'wss:'],
  workerSrc: ["'self'", 'blob:'],
  childSrc: ["'self'", 'blob:'],
};

const API_OVERRIDES: Partial<CspDirectives> = {
  defaultSrc: ["'none'"],
  frameAncestors: ["'none'"],
};

function directiveToString(key: string, values: string[]): string {
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `${kebab} ${values.join(' ')}`;
}

export function cspHeaderTemplate(input: SecurityInput): { content: string; language: 'text'; filename: string } {
  const appType = input.appType || 'website';
  const userDirectives = input.cspDirectives || {};

  let base = { ...DEFAULT_CSP };
  if (appType === 'saas') base = { ...base, ...SAAS_OVERRIDES };
  if (appType === 'api') base = { ...base, ...API_OVERRIDES };

  const merged: CspDirectives = { ...base, ...userDirectives };
  const url = input.siteUrl.replace(/\/$/, '');

  // Add site URL to connect-src
  if (merged.connectSrc && !merged.connectSrc.includes(url)) {
    merged.connectSrc = [...merged.connectSrc, url];
  }

  const parts: string[] = [];

  for (const [key, value] of Object.entries(merged)) {
    if (key === 'upgradeInsecureRequests' && value === true) {
      parts.push('upgrade-insecure-requests');
    } else if (key === 'blockAllMixedContent' && value === true) {
      parts.push('block-all-mixed-content');
    } else if (key === 'reportUri' && typeof value === 'string') {
      parts.push(`report-uri ${value}`);
    } else if (Array.isArray(value)) {
      parts.push(directiveToString(key, value));
    }
  }

  const headerValue = parts.join('; ');
  const framework = input.framework || 'generic';

  const lines: string[] = [
    `# Content Security Policy for ${input.siteName}`,
    `# Generated for: ${url}`,
    `# App Type: ${appType}`,
    `#`,
    `# Raw Header Value:`,
    `# Content-Security-Policy: ${headerValue}`,
    '',
  ];

  // Framework-specific implementation
  if (framework === 'express') {
    lines.push(
      '// Express.js middleware',
      `import helmet from 'helmet';`,
      '',
      'app.use(',
      '  helmet.contentSecurityPolicy({',
      '    directives: {',
    );
    for (const [key, value] of Object.entries(merged)) {
      if (key === 'upgradeInsecureRequests' || key === 'blockAllMixedContent') continue;
      if (key === 'reportUri') continue;
      if (Array.isArray(value)) {
        lines.push(`      ${key}: [${value.map(v => `"${v}"`).join(', ')}],`);
      }
    }
    if (merged.upgradeInsecureRequests) lines.push('      upgradeInsecureRequests: [],');
    lines.push('    },', '  })', ');');
  } else if (framework === 'nextjs') {
    lines.push(
      '// next.config.js — headers()',
      'async headers() {',
      '  return [',
      '    {',
      '      source: "/(.*)",',
      '      headers: [',
      '        {',
      '          key: "Content-Security-Policy",',
      `          value: "${headerValue}"`,
      '        },',
      '      ],',
      '    },',
      '  ];',
      '}',
    );
  } else if (framework === 'hono') {
    lines.push(
      '// Hono middleware',
      `import { secureHeaders } from 'hono/secure-headers';`,
      '',
      'app.use(',
      '  secureHeaders({',
      `    contentSecurityPolicy: {`,
    );
    for (const [key, value] of Object.entries(merged)) {
      if (key === 'upgradeInsecureRequests' || key === 'blockAllMixedContent' || key === 'reportUri') continue;
      if (Array.isArray(value)) {
        lines.push(`      ${key}: [${value.map(v => `"${v}"`).join(', ')}],`);
      }
    }
    lines.push('    },', '  })', ');');
  } else if (framework === 'fastify') {
    lines.push(
      '// Fastify plugin',
      `import helmet from '@fastify/helmet';`,
      '',
      'await fastify.register(helmet, {',
      '  contentSecurityPolicy: {',
      '    directives: {',
    );
    for (const [key, value] of Object.entries(merged)) {
      if (key === 'upgradeInsecureRequests' || key === 'blockAllMixedContent' || key === 'reportUri') continue;
      if (Array.isArray(value)) {
        lines.push(`      ${key}: [${value.map(v => `"${v}"`).join(', ')}],`);
      }
    }
    lines.push('    },', '  },', '});');
  } else {
    lines.push(
      '# Generic HTTP Header',
      `Content-Security-Policy: ${headerValue}`,
    );
  }

  return { content: lines.join('\n'), language: 'text', filename: 'csp-policy.txt' };
}
