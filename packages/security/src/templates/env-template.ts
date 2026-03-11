import type { SecurityInput } from '../types';

interface EnvVar {
  key: string;
  value: string;
  comment: string;
  section: string;
  required: boolean;
}

function getEnvVars(input: SecurityInput): EnvVar[] {
  const url = input.siteUrl.replace(/\/$/, '');
  const appType = input.appType || 'website';
  const authStrategy = input.authStrategy || 'jwt';

  const vars: EnvVar[] = [
    // App
    { key: 'NODE_ENV', value: 'development', comment: 'Environment (development | staging | production)', section: 'App', required: true },
    { key: 'PORT', value: '3000', comment: 'Server port', section: 'App', required: true },
    { key: 'APP_URL', value: url, comment: 'Public URL of the application', section: 'App', required: true },
    { key: 'APP_NAME', value: input.siteName, comment: 'Application display name', section: 'App', required: false },
  ];

  // Database
  if (appType !== 'website') {
    vars.push(
      { key: 'DATABASE_URL', value: 'postgresql://user:password@localhost:5432/dbname', comment: 'Primary database connection string', section: 'Database', required: true },
      { key: 'REDIS_URL', value: 'redis://localhost:6379', comment: 'Redis connection for sessions/cache', section: 'Database', required: false },
    );
  }

  // Auth
  if (authStrategy === 'jwt') {
    vars.push(
      { key: 'JWT_SECRET', value: '', comment: 'JWT signing secret (min 256-bit, use: openssl rand -base64 32)', section: 'Auth', required: true },
      { key: 'JWT_REFRESH_SECRET', value: '', comment: 'Refresh token signing secret', section: 'Auth', required: true },
      { key: 'JWT_ACCESS_EXPIRY', value: '15m', comment: 'Access token expiration', section: 'Auth', required: false },
      { key: 'JWT_REFRESH_EXPIRY', value: '7d', comment: 'Refresh token expiration', section: 'Auth', required: false },
    );
  } else if (authStrategy === 'session') {
    vars.push(
      { key: 'SESSION_SECRET', value: '', comment: 'Session signing secret (use: openssl rand -base64 32)', section: 'Auth', required: true },
      { key: 'SESSION_MAX_AGE', value: '604800', comment: 'Session max age in seconds (7 days)', section: 'Auth', required: false },
    );
  } else if (authStrategy === 'oauth2') {
    vars.push(
      { key: 'OAUTH_CLIENT_ID', value: '', comment: 'OAuth provider client ID', section: 'Auth', required: true },
      { key: 'OAUTH_CLIENT_SECRET', value: '', comment: 'OAuth provider client secret', section: 'Auth', required: true },
      { key: 'OAUTH_REDIRECT_URI', value: `${url}/auth/callback`, comment: 'OAuth callback URL', section: 'Auth', required: true },
      { key: 'OAUTH_AUTHORIZATION_URL', value: '', comment: 'Provider authorization endpoint', section: 'Auth', required: true },
      { key: 'OAUTH_TOKEN_URL', value: '', comment: 'Provider token endpoint', section: 'Auth', required: true },
    );
  } else if (authStrategy === 'api-key') {
    vars.push(
      { key: 'API_KEY_SALT', value: '', comment: 'Salt for API key hashing', section: 'Auth', required: true },
    );
  }

  // Security
  vars.push(
    { key: 'CORS_ORIGINS', value: url, comment: 'Allowed CORS origins (comma-separated)', section: 'Security', required: true },
    { key: 'RATE_LIMIT_MAX', value: '100', comment: 'Max requests per window', section: 'Security', required: false },
    { key: 'RATE_LIMIT_WINDOW_MS', value: '60000', comment: 'Rate limit window in milliseconds', section: 'Security', required: false },
  );

  // Services
  if (appType === 'saas') {
    vars.push(
      { key: 'SMTP_HOST', value: '', comment: 'Email SMTP host', section: 'Services', required: false },
      { key: 'SMTP_PORT', value: '587', comment: 'Email SMTP port', section: 'Services', required: false },
      { key: 'SMTP_USER', value: '', comment: 'Email SMTP username', section: 'Services', required: false },
      { key: 'SMTP_PASS', value: '', comment: 'Email SMTP password', section: 'Services', required: false },
      { key: 'STRIPE_SECRET_KEY', value: '', comment: 'Stripe secret key', section: 'Services', required: false },
      { key: 'STRIPE_WEBHOOK_SECRET', value: '', comment: 'Stripe webhook signing secret', section: 'Services', required: false },
    );
  }

  // Add user-provided env vars
  if (input.envVars) {
    for (const [key, value] of Object.entries(input.envVars)) {
      vars.push({ key, value, comment: 'Custom variable', section: 'Custom', required: false });
    }
  }

  return vars;
}

export function envTemplateTemplate(input: SecurityInput): { content: string; language: 'env'; filename: string } {
  const vars = getEnvVars(input);

  const sections = new Map<string, EnvVar[]>();
  for (const v of vars) {
    if (!sections.has(v.section)) sections.set(v.section, []);
    sections.get(v.section)!.push(v);
  }

  const lines: string[] = [
    `# Environment Configuration for ${input.siteName}`,
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    '#',
    '# SECURITY WARNING: Never commit this file to version control.',
    '# Add .env to your .gitignore file.',
    '#',
    `# Required variables are marked with [REQUIRED]`,
    '',
  ];

  for (const [section, sectionVars] of sections) {
    lines.push(`# ─── ${section.toUpperCase()} ${'─'.repeat(Math.max(0, 60 - section.length))}`, '');
    for (const v of sectionVars) {
      const req = v.required ? ' [REQUIRED]' : '';
      lines.push(`# ${v.comment}${req}`);
      lines.push(`${v.key}=${v.value}`);
      lines.push('');
    }
  }

  return { content: lines.join('\n'), language: 'env', filename: '.env.example' };
}
