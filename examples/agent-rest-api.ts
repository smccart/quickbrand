/**
 * FetchKit Agent Integration — REST API Examples
 *
 * These examples show how an AI agent can call the FetchKit REST API
 * to scaffold a complete project with brand, legal, SEO, and security assets.
 *
 * Base URL: https://fetchkit.dev/api
 */

const BASE = 'https://fetchkit.dev/api';

// ─── Brand Service ──────────────────────────────────────────────────

/** Generate logo variations for a company */
async function generateLogos(name: string, count = 10) {
  const res = await fetch(`${BASE}/brand/generate?name=${encodeURIComponent(name)}&count=${count}`);
  return res.json(); // { variations: LogoVariation[] }
}

/** Export a selected logo as production SVG (text-to-paths) */
async function exportLogoSvg(config: unknown) {
  const res = await fetch(`${BASE}/brand/export-svg`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config, layout: 'horizontal', mode: 'light' }),
  });
  return res.json(); // { svg: string }
}

/** Generate a favicon from an icon */
async function generateFavicon(iconId: string, iconColor: string, name: string) {
  const res = await fetch(
    `${BASE}/brand/favicon?iconId=${encodeURIComponent(iconId)}&iconColor=${encodeURIComponent(iconColor)}&name=${encodeURIComponent(name)}`
  );
  return res.json(); // { svg, htmlSnippet, manifest }
}

/** Generate design tokens (CSS variables, Tailwind, JSON) */
async function generateDesignTokens(colors: unknown, font: unknown) {
  const res = await fetch(`${BASE}/brand/design-tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ colors, font }),
  });
  return res.json();
}

/** Generate a semantic color palette from a seed color */
async function generatePalette(seedColor: string, harmony = 'analogous') {
  const res = await fetch(`${BASE}/brand/palette/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seedColor, harmony }),
  });
  return res.json();
}

/** Generate a letterhead */
async function generateLetterhead(companyName: string, options: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/brand/letterhead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName, ...options }),
  });
  return res.json();
}

/** Generate app icons in all sizes */
async function generateAppIcon(iconId: string, options: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/brand/app-icon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iconId, ...options }),
  });
  return res.json();
}

/** Generate brand guidelines document */
async function generateBrandGuidelines(companyName: string, options: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/brand/guidelines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName, ...options }),
  });
  return res.json();
}

/** Generate email signature HTML */
async function generateEmailSignature(name: string, companyName: string, options: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/brand/email-signature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, companyName, ...options }),
  });
  return res.json();
}

// ─── Legal Service ──────────────────────────────────────────────────

/** Generate a single legal document */
async function generateLegalDoc(type: string, input: Record<string, unknown>) {
  const res = await fetch(`${BASE}/legal/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...input }),
  });
  return res.json(); // { document: { title, markdown, html, metadata } }
}

/** Generate a bundle of legal documents */
async function generateLegalBundle(types: string[], input: Record<string, unknown>) {
  const res = await fetch(`${BASE}/legal/bundle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ types, ...input }),
  });
  return res.json(); // { bundle: { documents, input } }
}

// ─── SEO Service ────────────────────────────────────────────────────

/** Generate a single SEO artifact */
async function generateSeoArtifact(type: string, input: Record<string, unknown>) {
  const res = await fetch(`${BASE}/seo/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...input }),
  });
  return res.json(); // { artifact: { type, title, content, language, filename } }
}

/** Generate a bundle of SEO artifacts */
async function generateSeoBundle(types: string[], input: Record<string, unknown>) {
  const res = await fetch(`${BASE}/seo/bundle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ types, ...input }),
  });
  return res.json();
}

// ─── Security Service ───────────────────────────────────────────────

/** Generate a single security artifact */
async function generateSecurityArtifact(type: string, input: Record<string, unknown>) {
  const res = await fetch(`${BASE}/security/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...input }),
  });
  return res.json(); // { artifact: { type, title, content, language, filename } }
}

/** Generate a bundle of security artifacts */
async function generateSecurityBundle(types: string[], input: Record<string, unknown>) {
  const res = await fetch(`${BASE}/security/bundle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ types, ...input }),
  });
  return res.json();
}

// ─── Full Project Scaffold ──────────────────────────────────────────

/**
 * Complete agent workflow: scaffold an entire project in one go.
 *
 * This is how an AI agent would use FetchKit to set up a new project
 * with all assets generated from a single company name.
 */
async function scaffoldProject(companyName: string, siteUrl: string, contactEmail: string) {
  console.log(`Scaffolding project for: ${companyName}`);

  // 1. Generate brand assets
  const { variations } = await generateLogos(companyName, 5);
  const selected = variations[0]; // Agent picks best variation
  const svg = await exportLogoSvg(selected.config);
  const tokens = await generateDesignTokens(selected.config.colors, selected.config.font);
  const palette = await generatePalette(selected.config.colors.iconColor);
  const letterhead = await generateLetterhead(companyName, { primaryColor: selected.config.colors.iconColor });
  const appIcon = await generateAppIcon(selected.config.icon.id, { backgroundColor: selected.config.colors.iconColor });
  const guidelines = await generateBrandGuidelines(companyName, { primaryColor: selected.config.colors.iconColor });

  // 2. Generate legal documents
  const legalBundle = await generateLegalBundle(
    ['privacy-policy', 'terms-of-service', 'cookie-consent'],
    { companyName, websiteUrl: siteUrl, contactEmail, includeGdpr: true }
  );

  // 3. Generate SEO config
  const seoBundle = await generateSeoBundle(
    ['meta-tags', 'sitemap', 'robots-txt', 'json-ld'],
    { siteName: companyName, siteUrl }
  );

  // 4. Generate security config
  const securityBundle = await generateSecurityBundle(
    ['csp-header', 'cors-config', 'security-headers', 'auth-scaffold', 'env-template', 'rate-limit'],
    { siteName: companyName, siteUrl, framework: 'express', appType: 'saas', authStrategy: 'jwt' }
  );

  return {
    brand: { svg, tokens, palette, letterhead, appIcon, guidelines },
    legal: legalBundle,
    seo: seoBundle,
    security: securityBundle,
  };
}

// Example usage
scaffoldProject('Acme Inc.', 'https://acme.com', 'hello@acme.com')
  .then((result) => console.log('Project scaffolded:', Object.keys(result)))
  .catch(console.error);
