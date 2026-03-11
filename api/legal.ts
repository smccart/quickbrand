import * as legal from '../packages/legal/src/index';
import type { LegalDocType, LegalInput } from '../packages/legal/src/types';

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

const VALID_DOC_TYPES = Object.keys(legal.LEGAL_DOC_TYPES);

async function handleGenerate(req: Request): Promise<Response> {
  const body = await parseBody<{ type: LegalDocType } & LegalInput>(req);
  if (!body?.type) return error('Missing required field: type', 400, `POST JSON with { "type": "privacy-policy", "companyName": "Acme", "websiteUrl": "https://acme.com", "contactEmail": "legal@acme.com" }. Valid types: ${VALID_DOC_TYPES.join(', ')}`);
  if (!VALID_DOC_TYPES.includes(body.type)) {
    return error(`Invalid type "${body.type}". Must be one of: ${VALID_DOC_TYPES.join(', ')}`, 400, `Change "type" to one of: ${VALID_DOC_TYPES.join(', ')}`);
  }
  if (!body.companyName) return error('Missing required field: companyName', 400, 'Add "companyName": "Your Company" to the request body');
  if (!body.websiteUrl) return error('Missing required field: websiteUrl', 400, 'Add "websiteUrl": "https://yoursite.com" to the request body');
  if (!body.contactEmail) return error('Missing required field: contactEmail', 400, 'Add "contactEmail": "legal@yoursite.com" to the request body');

  try {
    const doc = legal.generateDocument(body.type, body);
    return json({ document: doc });
  } catch (e) {
    return error(`Generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleBundle(req: Request): Promise<Response> {
  const body = await parseBody<{ types: LegalDocType[] } & LegalInput>(req);
  if (!body?.types || !Array.isArray(body.types) || body.types.length === 0) {
    return error('Missing required field: types (array of document types)', 400, `POST JSON with { "types": ["privacy-policy", "terms-of-service"], "companyName": "Acme", "websiteUrl": "https://acme.com", "contactEmail": "legal@acme.com" }. Valid types: ${VALID_DOC_TYPES.join(', ')}`);
  }
  for (const t of body.types) {
    if (!VALID_DOC_TYPES.includes(t)) {
      return error(`Invalid type "${t}". Must be one of: ${VALID_DOC_TYPES.join(', ')}`, 400, `Remove or replace "${t}" in the types array. Valid types: ${VALID_DOC_TYPES.join(', ')}`);
    }
  }
  if (!body.companyName) return error('Missing required field: companyName', 400, 'Add "companyName": "Your Company" to the request body');
  if (!body.websiteUrl) return error('Missing required field: websiteUrl', 400, 'Add "websiteUrl": "https://yoursite.com" to the request body');
  if (!body.contactEmail) return error('Missing required field: contactEmail', 400, 'Add "contactEmail": "legal@yoursite.com" to the request body');

  try {
    const bundle = legal.generateBundle(body.types, body);
    return json({ bundle });
  } catch (e) {
    return error(`Bundle generation failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 500);
  }
}

async function handleTypes(): Promise<Response> {
  return json({ types: legal.LEGAL_DOC_TYPES });
}

// --- Main router ---

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/legal\/?/, '');

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
      return error(`Unknown endpoint: /api/legal/${path}`, 404);
  }
}
