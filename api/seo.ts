import * as seo from '../packages/seo/src/index';
import type { SeoArtifactType, SeoInput } from '../packages/seo/src/types';

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

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

async function parseBody<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

// --- Route handlers ---

const VALID_ARTIFACT_TYPES = Object.keys(seo.SEO_ARTIFACT_TYPES);

async function handleGenerate(req: Request): Promise<Response> {
  const body = await parseBody<{ type: SeoArtifactType } & SeoInput>(req);
  if (!body?.type) return error('Missing required field: type');
  if (!VALID_ARTIFACT_TYPES.includes(body.type)) {
    return error(`Invalid type. Must be one of: ${VALID_ARTIFACT_TYPES.join(', ')}`);
  }
  if (!body.siteName) return error('Missing required field: siteName');
  if (!body.siteUrl) return error('Missing required field: siteUrl');

  try {
    const artifact = seo.generateArtifact(body.type, body);
    return json({ artifact });
  } catch (e) {
    return error(`Generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleBundle(req: Request): Promise<Response> {
  const body = await parseBody<{ types: SeoArtifactType[] } & SeoInput>(req);
  if (!body?.types || !Array.isArray(body.types) || body.types.length === 0) {
    return error('Missing required field: types (array of artifact types)');
  }
  for (const t of body.types) {
    if (!VALID_ARTIFACT_TYPES.includes(t)) {
      return error(`Invalid type "${t}". Must be one of: ${VALID_ARTIFACT_TYPES.join(', ')}`);
    }
  }
  if (!body.siteName) return error('Missing required field: siteName');
  if (!body.siteUrl) return error('Missing required field: siteUrl');

  try {
    const bundle = seo.generateBundle(body.types, body);
    return json({ bundle });
  } catch (e) {
    return error(`Bundle generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleTypes(): Promise<Response> {
  return json({ types: seo.SEO_ARTIFACT_TYPES });
}

// --- Main router ---

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/seo\/?/, '');

  switch (path) {
    case 'generate':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleGenerate(req);
    case 'bundle':
      if (req.method !== 'POST') return error('Method not allowed', 405);
      return handleBundle(req);
    case 'types':
      return handleTypes();
    default:
      return error(`Unknown endpoint: /api/seo/${path}`, 404);
  }
}
