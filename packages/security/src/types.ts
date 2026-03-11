export type SecurityArtifactType =
  | 'csp-header'
  | 'cors-config'
  | 'security-headers'
  | 'auth-scaffold'
  | 'env-template'
  | 'rate-limit';

export type AppFramework =
  | 'express'
  | 'nextjs'
  | 'fastify'
  | 'hono'
  | 'generic';

export type AuthStrategy =
  | 'jwt'
  | 'session'
  | 'oauth2'
  | 'api-key';

export interface CspDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  connectSrc?: string[];
  frameSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  workerSrc?: string[];
  childSrc?: string[];
  formAction?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
  reportUri?: string;
}

export interface CorsConfig {
  origins: string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export interface RateLimitConfig {
  windowMs?: number;
  maxRequests?: number;
  keyBy?: 'ip' | 'api-key' | 'user-id';
  skipSuccessful?: boolean;
}

export interface SecurityInput {
  siteName: string;
  siteUrl: string;
  framework?: AppFramework;
  appType?: 'website' | 'saas' | 'api' | 'mobile-backend';
  authStrategy?: AuthStrategy;
  cspDirectives?: CspDirectives;
  corsConfig?: CorsConfig;
  rateLimitConfig?: RateLimitConfig;
  envVars?: Record<string, string>;
}

export interface SecurityArtifact {
  type: SecurityArtifactType;
  title: string;
  content: string;
  language: 'text' | 'json' | 'typescript' | 'env';
  filename: string;
  metadata: {
    generatedAt: string;
    charCount: number;
  };
}

export interface SecurityBundle {
  artifacts: SecurityArtifact[];
  input: SecurityInput;
}

export const SECURITY_ARTIFACT_TYPES: Record<SecurityArtifactType, { title: string; description: string }> = {
  'csp-header': {
    title: 'Content Security Policy',
    description: 'CSP header directives to prevent XSS, clickjacking, and code injection attacks.',
  },
  'cors-config': {
    title: 'CORS Configuration',
    description: 'Cross-Origin Resource Sharing setup for your API with safe defaults.',
  },
  'security-headers': {
    title: 'Security Headers',
    description: 'HTTP security headers (HSTS, X-Frame-Options, X-Content-Type-Options, etc.).',
  },
  'auth-scaffold': {
    title: 'Auth Scaffold',
    description: 'Authentication middleware scaffold with JWT, session, OAuth2, or API key strategy.',
  },
  'env-template': {
    title: 'Environment Template',
    description: 'Secure .env template with all required secrets and configuration variables.',
  },
  'rate-limit': {
    title: 'Rate Limiter',
    description: 'Rate limiting middleware to protect against abuse and DDoS.',
  },
};

export const APP_FRAMEWORKS: Record<AppFramework, { title: string; description: string }> = {
  express: { title: 'Express', description: 'Express.js middleware and configuration' },
  nextjs: { title: 'Next.js', description: 'Next.js middleware and API route config' },
  fastify: { title: 'Fastify', description: 'Fastify plugins and hooks' },
  hono: { title: 'Hono', description: 'Hono middleware for edge and serverless' },
  generic: { title: 'Generic', description: 'Framework-agnostic HTTP headers and config' },
};

export const AUTH_STRATEGIES: Record<AuthStrategy, { title: string; description: string }> = {
  jwt: { title: 'JWT', description: 'JSON Web Token-based stateless authentication' },
  session: { title: 'Session', description: 'Server-side session with cookie authentication' },
  oauth2: { title: 'OAuth 2.0', description: 'OAuth 2.0 authorization code flow' },
  'api-key': { title: 'API Key', description: 'API key header authentication for services' },
};
