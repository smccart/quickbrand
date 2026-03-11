# FetchKit

**Scaffolding as a Service** for developers and AI agents.

Generate production-ready brand kits, legal docs, SEO configs, and security hardening — instantly. Free, open source, no sign-up required.

[Website](https://fetchkit.dev) | [Docs](https://fetchkit.dev/docs) | [API Reference](https://fetchkit.dev/api/openapi.json) | [LLM Docs](https://fetchkit.dev/llms.txt)

---

## Services

| Service | Package | What it generates |
|---------|---------|-------------------|
| **Brand** | `@fetchkit/brand` | Logos (30+ variations), favicons, color palettes, design tokens (CSS/Tailwind/JSON), social cards, letterheads, app icons, email signatures, brand guidelines |
| **Legal** | `@fetchkit/legal` | Privacy policies, terms of service, cookie consent, disclaimers, acceptable use, DMCA notices (Markdown + HTML) |
| **SEO** | `@fetchkit/seo` | Meta tags, XML sitemaps, robots.txt, Schema.org JSON-LD structured data |
| **Security** | `@fetchkit/security` | CSP headers, CORS configs, auth scaffolds (JWT/session), rate limiting, input validation, security headers (Express/Next.js) |

## Quick Start

### Use the CLI

```bash
npx @fetchkit/cli init
```

Generates all scaffolding files into a `fetchkit-output/` directory.

### Use as npm packages

```bash
npm install @fetchkit/brand @fetchkit/legal @fetchkit/seo @fetchkit/security
```

```ts
import { generateLogos } from '@fetchkit/brand';
import { generateBundle as legalBundle } from '@fetchkit/legal';
import { generateBundle as seoBundle } from '@fetchkit/seo';
import { generateBundle as securityBundle } from '@fetchkit/security';

// Generate 10 logo variations
const logos = await generateLogos('MyApp', 10);

// Generate privacy policy + terms of service
const legal = legalBundle(['privacy-policy', 'terms-of-service'], {
  companyName: 'MyApp',
  websiteUrl: 'https://myapp.com',
  contactEmail: 'legal@myapp.com',
});

// Generate all SEO files
const seo = seoBundle(['meta-tags', 'sitemap', 'robots-txt', 'json-ld'], {
  siteName: 'MyApp',
  siteUrl: 'https://myapp.com',
});

// Generate security configs for Express
const security = securityBundle(['csp', 'cors', 'auth', 'rate-limit'], {
  siteName: 'MyApp',
  siteUrl: 'https://myapp.com',
  framework: 'express',
});
```

### Use the REST API

```bash
# Generate brand logos
curl "https://fetchkit.dev/api/brand/generate?name=MyApp"

# Generate legal documents
curl -X POST https://fetchkit.dev/api/legal/bundle \
  -H "Content-Type: application/json" \
  -d '{"types":["privacy-policy","terms-of-service"],"companyName":"MyApp","websiteUrl":"https://myapp.com","contactEmail":"hi@myapp.com"}'

# Generate SEO artifacts
curl -X POST https://fetchkit.dev/api/seo/bundle \
  -H "Content-Type: application/json" \
  -d '{"types":["meta-tags","sitemap","robots-txt","json-ld"],"siteName":"MyApp","siteUrl":"https://myapp.com"}'

# Generate security configs
curl -X POST https://fetchkit.dev/api/security/bundle \
  -H "Content-Type: application/json" \
  -d '{"types":["csp","cors","auth","rate-limit","validation","security-headers"],"siteName":"MyApp","siteUrl":"https://myapp.com","framework":"express"}'
```

### Use as MCP Server (AI Agents)

Add to your Claude Desktop, Cursor, or any MCP-compatible client:

```json
{
  "mcpServers": {
    "fetchkit": {
      "command": "npx",
      "args": ["@fetchkit/mcp"]
    }
  }
}
```

17 tools available. See [`packages/mcp/README.md`](packages/mcp/README.md) for the full tool list.

## Architecture

```
fetchkit/
  apps/web/           React 19 + Vite 7 SPA
  packages/brand/     Brand identity generation (pure TS)
  packages/legal/     Legal document generation (pure TS)
  packages/seo/       SEO artifact generation (pure TS)
  packages/security/  Security config generation (pure TS)
  packages/mcp/       MCP server (17 tools, stdio transport)
  packages/cli/       CLI tool
  api/                Vercel serverless functions (21 endpoints)
```

**Stack:** TypeScript 5.9 | Turborepo + pnpm | React 19 | Vite 7 | Tailwind CSS 4 | Vitest

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests (39 tests across 4 packages)
pnpm test

# Start dev server
pnpm dev
```

## API

Base URL: `https://fetchkit.dev/api`

Full OpenAPI spec: [`api/openapi.json`](api/openapi.json)

| Service | Endpoints |
|---------|-----------|
| Brand | `GET /brand/generate`, `POST /brand/regenerate`, `POST /brand/export-svg`, `GET /brand/favicon`, `POST /brand/design-tokens`, `GET /brand/icons/search`, `GET /brand/icons/:id`, `POST /brand/palette/generate`, `GET /brand/palette/from-name`, `POST /brand/placeholder`, `GET /brand/meta/og-tags`, `GET /brand/meta/manifest` |
| Legal | `POST /legal/generate`, `POST /legal/bundle`, `GET /legal/types` |
| SEO | `POST /seo/generate`, `POST /seo/bundle`, `GET /seo/types` |
| Security | `POST /security/generate`, `POST /security/bundle`, `GET /security/types` |

Rate limit: 60 requests/minute per IP. All endpoints return JSON. No authentication required.

## For AI Agents

FetchKit is designed to be agent-friendly:

- **[llms.txt](https://fetchkit.dev/llms.txt)** — Plain-text description optimized for LLMs
- **[AGENTS.md](AGENTS.md)** — Instructions for code agents working with this repo
- **[OpenAPI spec](api/openapi.json)** — Machine-readable API documentation
- **[ai-plugin.json](https://fetchkit.dev/.well-known/ai-plugin.json)** — Agent discovery manifest
- **MCP server** — Direct tool integration for Claude, Cursor, and other MCP clients
- **No auth required** — All endpoints are free and open

## License

[MIT](LICENSE)
