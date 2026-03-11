// Wrapper to adapt Web API handler to Vercel's Node.js (req, res) format
import type { IncomingMessage, ServerResponse } from 'http';
import webHandler from './security';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const url = `${protocol}://${host}${req.url}`;

    const init: RequestInit = {
      method: req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([, v]) => v != null).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v!])
      ),
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = await readBody(req);
    }

    const webReq = new Request(url, init);
    const webRes = await webHandler(webReq);

    res.statusCode = webRes.status;
    webRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const body = await webRes.text();
    res.end(body);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Internal server error' }));
  }
}
