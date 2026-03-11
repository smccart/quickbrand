import * as brand from '../packages/brand/src/index';

// --- Helpers ---

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function error(message: string, status = 400, fix?: string): Response {
  const body: Record<string, unknown> = { error: message };
  if (fix) body.fix = fix;
  return json(body, status);
}

async function parseBody<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

// --- Route handlers ---

const FREEPIK_API_KEY = typeof process !== 'undefined' ? process.env.FREEPIK_API_KEY : undefined;

async function handleGenerate(url: URL): Promise<Response> {
  const b = brand;
  const name = url.searchParams.get('name');
  if (!name) return error('Missing required parameter: name', 400, 'Add ?name=YourCompany to the URL. Example: GET /api/brand/generate?name=Acme');
  const count = Math.min(Number(url.searchParams.get('count') ?? 30), 30);
  try {
    const variations = await b.generateLogos(name, count, FREEPIK_API_KEY);
    return json({
      variations,
      meta: { companyName: name, count: variations.length, generatedAt: new Date().toISOString() },
    });
  } catch (e) {
    return error(`Generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleIconGenerate(req: Request): Promise<Response> {
  if (!FREEPIK_API_KEY) return error('AI icon generation not configured (missing FREEPIK_API_KEY)', 503, 'Set FREEPIK_API_KEY environment variable. Get a key at https://www.freepik.com/api');
  const body = await parseBody<{ prompt: string; style?: string }>(req);
  if (!body?.prompt) return error('Missing required field: prompt', 400, 'POST JSON body with { "prompt": "rocket launching into space", "style": "solid" }. Styles: solid, outline, color, flat, sticker');
  try {
    const icon = await brand.generateFreepikIcon(
      body.prompt,
      FREEPIK_API_KEY,
      (body.style as any) ?? 'solid',
    );
    if (!icon) return error('Icon generation failed or timed out', 500);
    return json({ icon });
  } catch (e) {
    return error(`AI icon generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleRegenerate(req: Request): Promise<Response> {
  const b = brand;
  const body = await parseBody<{
    companyName: string;
    overrides?: { icon?: any; font?: any; palette?: any };
    count?: number;
  }>(req);
  if (!body?.companyName) return error('Missing required field: companyName', 400, 'POST JSON body with { "companyName": "Acme Corp" }');
  const count = Math.min(body.count ?? 30, 30);
  const variations = b.regenerateWithOverrides(body.companyName, body.overrides ?? {}, count);
  return json({
    variations,
    meta: { companyName: body.companyName, count: variations.length, generatedAt: new Date().toISOString() },
  });
}

async function handleExportSvg(req: Request): Promise<Response> {
  const b = brand;
  const body = await parseBody<{ config: any; layout?: string; mode?: string }>(req);
  if (!body?.config) return error('Missing required field: config', 400, 'POST JSON body with { "config": <LogoConfig from /api/brand/generate>, "layout": "horizontal", "mode": "light" }');
  try {
    const layout = (body.layout ?? 'horizontal') as 'horizontal' | 'vertical';
    const mode = (body.mode ?? 'light') as 'light' | 'dark';
    const svg = await b.buildExportSvg(body.config, layout, mode);
    return json({ svg, layout, mode });
  } catch (e) {
    return error(`SVG export failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleFavicon(url: URL): Promise<Response> {
  const b = brand;
  const iconId = url.searchParams.get('iconId');
  if (!iconId) return error('Missing required parameter: iconId', 400, 'Add ?iconId=mdi:rocket-launch&iconColor=%236366f1 to the URL. Find icon IDs via /api/brand/icons/search?query=rocket');
  const iconColor = url.searchParams.get('iconColor') ?? '#000000';
  const name = url.searchParams.get('name') ?? 'App';
  try {
    const iconSvg = await b.fetchIconSvg(iconId);
    if (!iconSvg) return error('Icon not found', 404);
    return json({
      svg: b.buildFaviconSvg(iconSvg, iconColor),
      htmlSnippet: b.generateHtmlSnippet(),
      manifest: JSON.parse(b.generateManifest(name)),
    });
  } catch (e) {
    return error(`Favicon generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleDesignTokens(req: Request): Promise<Response> {
  const b = brand;
  const body = await parseBody<{ colors: any; font: any }>(req);
  if (!body?.colors) return error('Missing required field: colors', 400, 'POST JSON with { "colors": { "name": "brand", "iconColor": "#6366f1", "letterColors": ["#6366f1"] }, "font": { "family": "Inter", "weight": 700, "category": "sans-serif" } }');
  if (!body?.font) return error('Missing required field: font', 400, 'Add "font": { "family": "Inter", "weight": 700, "category": "sans-serif" } to the request body');
  return json({
    css: { variables: b.generateCssVariables(body.colors), fontCss: b.generateFontCss(body.font) },
    tailwind: { colors: b.generateTailwindColors(body.colors), font: b.generateTailwindFont(body.font) },
    json: { colorTokens: b.generateColorTokensJson(body.colors) },
    html: { fontLinkTag: b.generateFontLinkTag(body.font) },
  });
}

async function handleIconSearch(url: URL): Promise<Response> {
  const b = brand;
  const query = url.searchParams.get('query');
  if (!query) return error('Missing required parameter: query', 400, 'Add ?query=rocket&limit=10 to the URL. Example: GET /api/brand/icons/search?query=rocket');
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 30), 50);
  try {
    const icons = await b.searchIcons(query, limit);
    return json({ icons });
  } catch (e) {
    return error(`Icon search failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleIconById(url: URL): Promise<Response> {
  const b = brand;
  const id = url.searchParams.get('id');
  if (!id) return error('Missing required parameter: id', 400, 'Add ?id=mdi:rocket-launch to the URL. Find icon IDs via /api/brand/icons/search?query=rocket');
  const color = url.searchParams.get('color');
  try {
    let svg = await b.fetchIconSvg(id);
    if (!svg) return error('Icon not found', 404);
    if (color) svg = b.colorizeIconSvg(svg, color);
    return json({ id, svg });
  } catch (e) {
    return error(`Icon fetch failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

const VALID_HARMONIES = ['complementary', 'analogous', 'triadic', 'split-complementary', 'monochromatic'];

async function handlePaletteGenerate(req: Request): Promise<Response> {
  const b = brand;
  const body = await parseBody<{ seedColor: string; harmony?: string }>(req);
  if (!body?.seedColor) return error('Missing required field: seedColor', 400, 'POST JSON with { "seedColor": "#6366f1", "harmony": "analogous" }. Or use GET /api/brand/palette/from-name?name=Acme for name-based generation');
  const harmony = body.harmony ?? 'analogous';
  if (!VALID_HARMONIES.includes(harmony)) return error(`Invalid harmony. Must be one of: ${VALID_HARMONIES.join(', ')}`, 400, `Set "harmony" to one of: ${VALID_HARMONIES.join(', ')}`);
  const palette = b.generateSemanticPalette(body.seedColor, harmony as any);
  return json(b.bundlePaletteExport(palette));
}

async function handlePaletteFromName(url: URL): Promise<Response> {
  const b = brand;
  const name = url.searchParams.get('name');
  if (!name) return error('Missing required parameter: name', 400, 'Add ?name=YourBrand to the URL. Example: GET /api/brand/palette/from-name?name=Acme');
  const palette = b.generatePaletteFromName(name);
  return json(b.bundlePaletteExport(palette));
}

const VALID_CATEGORIES = ['hero', 'avatar', 'product', 'chart', 'team', 'background', 'pattern', 'icon-grid', 'screenshot-dashboard', 'screenshot-table', 'screenshot-chat', 'screenshot-editor', 'screenshot-settings', 'screenshot-landing'];

async function handlePlaceholder(req: Request): Promise<Response> {
  const b = brand;
  const body = await parseBody<{ category: string; width?: number; height?: number; colors?: string[]; label?: string }>(req);
  if (!body?.category || !VALID_CATEGORIES.includes(body.category)) {
    return error(`Invalid or missing category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, 400, `POST JSON with { "category": "hero", "colors": ["#6366f1"], "width": 1200, "height": 600 }`);
  }
  const image = b.generatePlaceholder({
    category: body.category as any,
    width: body.width ?? 0,
    height: body.height ?? 0,
    colors: body.colors ?? [],
    label: body.label,
  });
  return json({ image });
}

async function handleOgTags(): Promise<Response> {
  const b = brand;
  return json({ html: b.generateOgMetaTags() });
}

async function handleManifest(url: URL): Promise<Response> {
  const b = brand;
  const name = url.searchParams.get('name') ?? 'App';
  return json(JSON.parse(b.generateManifest(name)));
}

async function handleLetterhead(req: Request): Promise<Response> {
  const body = await parseBody<{
    companyName: string; tagline?: string; address?: string; phone?: string;
    email?: string; website?: string; primaryColor?: string; fontFamily?: string; fontCategory?: string;
  }>(req);
  if (!body?.companyName) return error('Missing required field: companyName', 400, 'POST JSON with { "companyName": "Acme Corp", "primaryColor": "#6366f1" }');

  const result = brand.generateLetterhead({
    companyName: body.companyName,
    tagline: body.tagline,
    address: body.address,
    phone: body.phone,
    email: body.email,
    website: body.website,
    colors: { primary: body.primaryColor || '#6366f1' },
    font: { family: body.fontFamily || 'Inter', category: body.fontCategory || 'sans-serif' },
  });
  return json(result);
}

async function handleAppIcon(req: Request): Promise<Response> {
  const body = await parseBody<{
    iconId: string; iconColor?: string; backgroundColor?: string;
    borderRadius?: number; padding?: number; gradientFrom?: string; gradientTo?: string;
  }>(req);
  if (!body?.iconId) return error('Missing required field: iconId', 400, 'POST JSON with { "iconId": "mdi:rocket-launch", "backgroundColor": "#6366f1" }. Find icon IDs via /api/brand/icons/search?query=rocket');

  const iconSvg = await brand.fetchIconSvg(body.iconId);
  if (!iconSvg) return error(`Icon not found: ${body.iconId}`, 404, `Search for valid icons at /api/brand/icons/search?query=${encodeURIComponent(body.iconId.split(':').pop() || 'icon')}`);

  const result = brand.generateAppIcon({
    iconSvg,
    iconColor: body.iconColor || '#ffffff',
    backgroundColor: body.backgroundColor || '#6366f1',
    borderRadius: body.borderRadius ?? 22,
    padding: body.padding ?? 20,
    gradient: body.gradientFrom && body.gradientTo ? { from: body.gradientFrom, to: body.gradientTo } : undefined,
  });
  return json({ svg: result.svg, htmlSnippet: result.htmlSnippet, manifestEntry: result.manifestEntry, sizeCount: result.sizes.length });
}

async function handleBrandGuidelines(req: Request): Promise<Response> {
  const body = await parseBody<{
    companyName: string; tagline?: string; description?: string;
    primaryColor?: string; letterColors?: string[];
    fontFamily?: string; fontWeight?: number; fontCategory?: string;
  }>(req);
  if (!body?.companyName) return error('Missing required field: companyName', 400, 'POST JSON with { "companyName": "Acme Corp", "primaryColor": "#6366f1", "fontFamily": "Inter" }');

  const result = brand.generateBrandGuidelines({
    companyName: body.companyName,
    tagline: body.tagline,
    description: body.description,
    colors: {
      name: 'brand',
      iconColor: body.primaryColor || '#6366f1',
      letterColors: body.letterColors?.length ? body.letterColors : [body.primaryColor || '#6366f1'],
    },
    font: {
      family: body.fontFamily || 'Inter',
      weight: body.fontWeight || 700,
      category: (body.fontCategory as any) || 'sans-serif',
    },
  });
  return json(result);
}

async function handleEmailSignature(req: Request): Promise<Response> {
  const body = await parseBody<{
    name: string; title?: string; companyName: string;
    email?: string; phone?: string; website?: string;
    linkedin?: string; twitter?: string;
    primaryColor?: string; fontFamily?: string; fontCategory?: string; photoUrl?: string;
  }>(req);
  if (!body?.name) return error('Missing required field: name', 400, 'POST JSON with { "name": "Jane Doe", "companyName": "Acme Corp", "email": "jane@acme.com" }');
  if (!body?.companyName) return error('Missing required field: companyName', 400, 'Add "companyName": "Acme Corp" to the request body');

  const result = brand.generateEmailSignature({
    name: body.name,
    title: body.title,
    companyName: body.companyName,
    email: body.email,
    phone: body.phone,
    website: body.website,
    linkedin: body.linkedin,
    twitter: body.twitter,
    colors: { primary: body.primaryColor || '#6366f1' },
    font: { family: body.fontFamily || 'Inter', category: body.fontCategory || 'sans-serif' },
    photoUrl: body.photoUrl,
  });
  return json(result);
}

// --- Main router ---

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/brand\/?/, '');

  switch (path) {
    case 'generate':
      return handleGenerate(url);
    case 'regenerate':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleRegenerate(req);
    case 'export-svg':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleExportSvg(req);
    case 'favicon':
      return handleFavicon(url);
    case 'design-tokens':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleDesignTokens(req);
    case 'icons/search':
      return handleIconSearch(url);
    case 'icons/get':
      return handleIconById(url);
    case 'icons/generate':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleIconGenerate(req);
    case 'palette/generate':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handlePaletteGenerate(req);
    case 'palette/from-name':
      return handlePaletteFromName(url);
    case 'placeholder':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handlePlaceholder(req);
    case 'letterhead':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleLetterhead(req);
    case 'app-icon':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleAppIcon(req);
    case 'guidelines':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleBrandGuidelines(req);
    case 'email-signature':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleEmailSignature(req);
    case 'meta/og-tags':
      return handleOgTags();
    case 'meta/manifest':
      return handleManifest(url);
    default:
      return error(`Unknown endpoint: /api/brand/${path}`, 404);
  }
}
