import type { SecurityInput } from '../types';

function jwtScaffold(input: SecurityInput, framework: string): string[] {
  const lines: string[] = [
    `// JWT Authentication Scaffold for ${input.siteName}`,
    `// Strategy: Stateless JWT with refresh token rotation`,
    '',
  ];

  if (framework === 'express') {
    lines.push(
      `import jwt from 'jsonwebtoken';`,
      `import type { Request, Response, NextFunction } from 'express';`,
      '',
      'const JWT_SECRET = process.env.JWT_SECRET!;',
      'const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;',
      'const ACCESS_TOKEN_EXPIRY = "15m";',
      'const REFRESH_TOKEN_EXPIRY = "7d";',
      '',
      'interface TokenPayload {',
      '  userId: string;',
      '  email: string;',
      '  role: string;',
      '}',
      '',
      'export function generateTokens(payload: TokenPayload) {',
      '  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });',
      '  const refreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });',
      '  return { accessToken, refreshToken };',
      '}',
      '',
      'export function authMiddleware(req: Request, res: Response, next: NextFunction) {',
      '  const header = req.headers.authorization;',
      '  if (!header?.startsWith("Bearer ")) {',
      '    return res.status(401).json({ error: "Missing or invalid authorization header" });',
      '  }',
      '',
      '  try {',
      '    const token = header.slice(7);',
      '    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;',
      '    (req as any).user = decoded;',
      '    next();',
      '  } catch (err) {',
      '    if (err instanceof jwt.TokenExpiredError) {',
      '      return res.status(401).json({ error: "Token expired" });',
      '    }',
      '    return res.status(401).json({ error: "Invalid token" });',
      '  }',
      '}',
      '',
      'export function refreshMiddleware(req: Request, res: Response) {',
      '  const { refreshToken } = req.body;',
      '  if (!refreshToken) {',
      '    return res.status(400).json({ error: "Refresh token required" });',
      '  }',
      '',
      '  try {',
      '    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };',
      '    // Look up user, generate new token pair',
      '    // const user = await findUser(decoded.userId);',
      '    // const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });',
      '    // return res.json(tokens);',
      '    return res.json({ message: "Implement user lookup and token generation" });',
      '  } catch {',
      '    return res.status(401).json({ error: "Invalid refresh token" });',
      '  }',
      '}',
    );
  } else if (framework === 'nextjs') {
    lines.push(
      `import { jwtVerify, SignJWT } from 'jose';`,
      `import { NextResponse } from 'next/server';`,
      `import type { NextRequest } from 'next/server';`,
      '',
      'const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);',
      'const ACCESS_TOKEN_EXPIRY = "15m";',
      '',
      'export async function generateAccessToken(payload: Record<string, unknown>) {',
      '  return new SignJWT(payload)',
      '    .setProtectedHeader({ alg: "HS256" })',
      '    .setExpirationTime(ACCESS_TOKEN_EXPIRY)',
      '    .setIssuedAt()',
      '    .sign(JWT_SECRET);',
      '}',
      '',
      'export async function verifyToken(token: string) {',
      '  const { payload } = await jwtVerify(token, JWT_SECRET);',
      '  return payload;',
      '}',
      '',
      'export async function authMiddleware(request: NextRequest) {',
      '  const token = request.headers.get("authorization")?.replace("Bearer ", "");',
      '  if (!token) {',
      '    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });',
      '  }',
      '',
      '  try {',
      '    await verifyToken(token);',
      '    return NextResponse.next();',
      '  } catch {',
      '    return NextResponse.json({ error: "Invalid token" }, { status: 401 });',
      '  }',
      '}',
    );
  } else {
    lines.push(
      '// Generic JWT middleware pattern',
      '',
      'interface TokenPayload {',
      '  userId: string;',
      '  email: string;',
      '  role: string;',
      '}',
      '',
      'async function verifyJwt(token: string, secret: string): Promise<TokenPayload> {',
      '  // Use your preferred JWT library (jose, jsonwebtoken, etc.)',
      '  throw new Error("Implement JWT verification with your chosen library");',
      '}',
      '',
      'async function authMiddleware(request: Request): Promise<TokenPayload | Response> {',
      '  const header = request.headers.get("Authorization");',
      '  if (!header?.startsWith("Bearer ")) {',
      '    return new Response(JSON.stringify({ error: "Unauthorized" }), {',
      '      status: 401,',
      '      headers: { "Content-Type": "application/json" },',
      '    });',
      '  }',
      '',
      '  const token = header.slice(7);',
      '  return verifyJwt(token, process.env.JWT_SECRET!);',
      '}',
    );
  }

  return lines;
}

function sessionScaffold(input: SecurityInput, framework: string): string[] {
  const lines: string[] = [
    `// Session Authentication Scaffold for ${input.siteName}`,
    `// Strategy: Server-side sessions with secure cookies`,
    '',
  ];

  if (framework === 'express') {
    lines.push(
      `import session from 'express-session';`,
      `import type { Request, Response, NextFunction } from 'express';`,
      '',
      'app.use(session({',
      '  secret: process.env.SESSION_SECRET!,',
      '  name: "sid",',
      '  resave: false,',
      '  saveUninitialized: false,',
      '  cookie: {',
      '    httpOnly: true,',
      '    secure: process.env.NODE_ENV === "production",',
      '    sameSite: "lax",',
      '    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days',
      '  },',
      '}));',
      '',
      'export function requireAuth(req: Request, res: Response, next: NextFunction) {',
      '  if (!(req.session as any).userId) {',
      '    return res.status(401).json({ error: "Not authenticated" });',
      '  }',
      '  next();',
      '}',
      '',
      '// Login handler',
      'app.post("/auth/login", async (req, res) => {',
      '  const { email, password } = req.body;',
      '  // Verify credentials against your database',
      '  // const user = await verifyCredentials(email, password);',
      '  // (req.session as any).userId = user.id;',
      '  res.json({ message: "Implement credential verification" });',
      '});',
      '',
      '// Logout handler',
      'app.post("/auth/logout", (req, res) => {',
      '  req.session.destroy((err) => {',
      '    if (err) return res.status(500).json({ error: "Logout failed" });',
      '    res.clearCookie("sid");',
      '    res.json({ message: "Logged out" });',
      '  });',
      '});',
    );
  } else {
    lines.push(
      '// Generic session-based auth pattern',
      '',
      'interface SessionConfig {',
      '  secret: string;',
      '  cookieName: string;',
      '  maxAge: number;',
      '  httpOnly: boolean;',
      '  secure: boolean;',
      '  sameSite: "strict" | "lax" | "none";',
      '}',
      '',
      'const sessionConfig: SessionConfig = {',
      '  secret: process.env.SESSION_SECRET!,',
      '  cookieName: "sid",',
      '  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds',
      '  httpOnly: true,',
      '  secure: true,',
      '  sameSite: "lax",',
      '};',
      '',
      '// Set-Cookie header for session:',
      `// Set-Cookie: \${sessionConfig.cookieName}=<session_id>; HttpOnly; Secure; SameSite=Lax; Max-Age=\${sessionConfig.maxAge}; Path=/`,
    );
  }

  return lines;
}

function oauth2Scaffold(input: SecurityInput, framework: string): string[] {
  const url = input.siteUrl.replace(/\/$/, '');
  const lines: string[] = [
    `// OAuth 2.0 Authorization Code Flow for ${input.siteName}`,
    `// Redirect URI: ${url}/auth/callback`,
    '',
  ];

  if (framework === 'express' || framework === 'generic') {
    lines.push(
      '// Environment variables required:',
      '// OAUTH_CLIENT_ID — OAuth provider client ID',
      '// OAUTH_CLIENT_SECRET — OAuth provider client secret',
      `// OAUTH_REDIRECT_URI — ${url}/auth/callback`,
      '// OAUTH_AUTHORIZATION_URL — Provider authorization endpoint',
      '// OAUTH_TOKEN_URL — Provider token endpoint',
      '// OAUTH_USERINFO_URL — Provider user info endpoint',
      '',
      'import crypto from "crypto";',
      '',
      '// Step 1: Redirect user to authorization endpoint',
      'function getAuthorizationUrl(): string {',
      '  const state = crypto.randomBytes(32).toString("hex");',
      '  // Store state in session for CSRF validation',
      '',
      '  const params = new URLSearchParams({',
      '    client_id: process.env.OAUTH_CLIENT_ID!,',
      `    redirect_uri: process.env.OAUTH_REDIRECT_URI || "${url}/auth/callback",`,
      '    response_type: "code",',
      '    scope: "openid email profile",',
      '    state,',
      '  });',
      '',
      '  return `${process.env.OAUTH_AUTHORIZATION_URL}?${params}`;',
      '}',
      '',
      '// Step 2: Handle callback and exchange code for tokens',
      'async function handleCallback(code: string, state: string) {',
      '  // Validate state matches session state (CSRF protection)',
      '',
      '  const response = await fetch(process.env.OAUTH_TOKEN_URL!, {',
      '    method: "POST",',
      '    headers: { "Content-Type": "application/x-www-form-urlencoded" },',
      '    body: new URLSearchParams({',
      '      grant_type: "authorization_code",',
      '      code,',
      '      client_id: process.env.OAUTH_CLIENT_ID!,',
      '      client_secret: process.env.OAUTH_CLIENT_SECRET!,',
      `      redirect_uri: process.env.OAUTH_REDIRECT_URI || "${url}/auth/callback",`,
      '    }),',
      '  });',
      '',
      '  const tokens = await response.json();',
      '  return tokens; // { access_token, refresh_token, id_token, expires_in }',
      '}',
      '',
      '// Step 3: Fetch user info',
      'async function getUserInfo(accessToken: string) {',
      '  const response = await fetch(process.env.OAUTH_USERINFO_URL!, {',
      '    headers: { Authorization: `Bearer ${accessToken}` },',
      '  });',
      '  return response.json();',
      '}',
    );
  }

  return lines;
}

function apiKeyScaffold(input: SecurityInput, framework: string): string[] {
  const lines: string[] = [
    `// API Key Authentication Scaffold for ${input.siteName}`,
    `// Strategy: API key via X-API-Key header or Authorization: Bearer <key>`,
    '',
  ];

  if (framework === 'express') {
    lines.push(
      `import type { Request, Response, NextFunction } from 'express';`,
      `import crypto from 'crypto';`,
      '',
      '// Hash API keys before storing them in the database',
      'export function hashApiKey(key: string): string {',
      '  return crypto.createHash("sha256").update(key).digest("hex");',
      '}',
      '',
      '// Generate a new API key (give raw key to user, store hash)',
      'export function generateApiKey(): { raw: string; hash: string } {',
      '  const raw = `fk_${crypto.randomBytes(32).toString("hex")}`;',
      '  const hash = hashApiKey(raw);',
      '  return { raw, hash };',
      '}',
      '',
      'export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {',
      '  const key = req.headers["x-api-key"] as string',
      '    || req.headers.authorization?.replace("Bearer ", "");',
      '',
      '  if (!key) {',
      '    return res.status(401).json({ error: "API key required" });',
      '  }',
      '',
      '  const hash = hashApiKey(key);',
      '  // Look up hash in database',
      '  // const apiKey = await db.apiKeys.findByHash(hash);',
      '  // if (!apiKey || apiKey.revoked) return res.status(401).json({ error: "Invalid API key" });',
      '  // req.apiKey = apiKey;',
      '',
      '  next();',
      '}',
    );
  } else {
    lines.push(
      'import crypto from "crypto";',
      '',
      'function hashApiKey(key: string): string {',
      '  return crypto.createHash("sha256").update(key).digest("hex");',
      '}',
      '',
      'function generateApiKey(): { raw: string; hash: string } {',
      '  const prefix = "fk_";',
      '  const raw = `${prefix}${crypto.randomBytes(32).toString("hex")}`;',
      '  return { raw, hash: hashApiKey(raw) };',
      '}',
      '',
      'async function validateApiKey(request: Request): Promise<boolean> {',
      '  const key = request.headers.get("X-API-Key")',
      '    ?? request.headers.get("Authorization")?.replace("Bearer ", "");',
      '  if (!key) return false;',
      '',
      '  const hash = hashApiKey(key);',
      '  // Validate hash against your data store',
      '  return true; // Replace with actual lookup',
      '}',
    );
  }

  return lines;
}

export function authScaffoldTemplate(input: SecurityInput): { content: string; language: 'typescript'; filename: string } {
  const strategy = input.authStrategy || 'jwt';
  const framework = input.framework || 'generic';

  let lines: string[];
  switch (strategy) {
    case 'jwt':
      lines = jwtScaffold(input, framework);
      break;
    case 'session':
      lines = sessionScaffold(input, framework);
      break;
    case 'oauth2':
      lines = oauth2Scaffold(input, framework);
      break;
    case 'api-key':
      lines = apiKeyScaffold(input, framework);
      break;
    default:
      lines = jwtScaffold(input, framework);
  }

  return { content: lines.join('\n'), language: 'typescript', filename: `auth-${strategy}.ts` };
}
