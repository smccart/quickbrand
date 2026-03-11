# CLAUDE.md — FetchKit Development Context

## What is FetchKit?
Scaffolding-as-a-service for developers and AI agents. Generates production-ready brand, legal, SEO, and security assets via npm packages, REST API, MCP server, or CLI.

**Live at**: https://fetchkit.dev

## Monorepo Structure
```
apps/web/              React 19 + Vite 7 SPA (all service UIs)
packages/brand/        Logo, favicon, palette, tokens, letterhead, app icon, email sig, guidelines
packages/legal/        Privacy policy, ToS, cookie consent, disclaimer, AUP, DMCA
packages/seo/          Meta tags, sitemap, robots.txt, JSON-LD
packages/security/     CSP, CORS, security headers, auth scaffold, env template, rate limit
packages/mcp/          MCP server (stdio transport, 17 tools across all 4 services)
packages/cli/          CLI tool — `npx @fetchkit/cli init`
packages/tsconfig/     Shared TS configs
packages/eslint-config/ Shared linting
api/                   Vercel serverless functions (brand.ts, legal.ts, seo.ts, security.ts, capabilities.ts)
```

## Commands
```bash
pnpm install               # Install all dependencies
pnpm build                 # Build all packages (turbo)
pnpm test                  # Run all tests (turbo, Vitest)
pnpm --filter web dev      # Start web app dev server
pnpm --filter web build    # Build web app only
pnpm --filter @fetchkit/brand build   # Build a single package
pnpm --filter @fetchkit/brand test    # Test a single package
```

## Key Conventions

### Architecture
- **Turborepo + pnpm workspaces** — all packages are `@fetchkit/*`
- **TypeScript 5.9 strict** — no `any` leaks, all exports typed
- **Pure TS packages** — brand, legal, seo, security have zero Node.js runtime deps
- **Client-side generation** — web app imports packages directly (not via REST API)
- **Vite builds** for brand, legal, seo, security; **tsc** for mcp and cli

### Service Pattern
Every service follows the same API shape:
```ts
generateArtifact(type: ArtifactType, input: Input) → Artifact
generateBundle(types: ArtifactType[], input: Input) → Bundle
```
Types and metadata are exported as `*_ARTIFACT_TYPES` or `*_DOC_TYPES` constants.

### Web App (apps/web/)
- React 19 + React Router v6 + Tailwind CSS 4 + shadcn/ui + Lucide icons
- Theme: `useSiteColor()` → `{ color, secondaryColor, setColor, setSecondaryColor }`
- Dark mode: `useTheme()` → `{ theme, toggleTheme }`
- Page titles: `usePageTitle('Title')` on every route
- Toasts: `import { toast } from 'sonner'`
- Analytics: `import { trackEvent } from '@/hooks/useAnalytics'`
- Lazy-loaded pages via `React.lazy()` in App.tsx

### API (api/)
- Vercel serverless functions, one per service
- All return JSON with CORS headers (`Access-Control-Allow-Origin: *`)
- Error shape: `{ error: string, fix?: string }` with appropriate HTTP status
- Discovery endpoint: `GET /api/capabilities` returns all services/types/versions

### MCP (packages/mcp/)
- 17 tools: 12 brand + 2 legal + 2 seo + 2 security (individual + bundle for each)
- Uses `@modelcontextprotocol/sdk` v1.12.0
- Tool descriptions include example inputs/outputs for agent consumption

### Testing
- Vitest for all packages
- Test files: `src/*.test.ts`
- Run specific: `pnpm --filter @fetchkit/brand test`
- 4 test suites: brand (15), legal (11), seo (11), security (11)

## File Naming
- Pages: `apps/web/src/pages/*Page.tsx` (PascalCase)
- Hooks: `apps/web/src/hooks/use*.ts` (camelCase)
- Components: `apps/web/src/components/*.tsx` (PascalCase)
- UI primitives: `apps/web/src/components/ui/*.tsx` (shadcn convention)

## Routes
```
/                  HomePage
/create            RefinePage (logo generator)
/create/export     ExportPage (download brand assets)
/generate          GenerateAllPage (wizard for all services)
/palette           PalettePage
/placeholders      PlaceholdersPage
/legal             LegalPage
/seo               SeoPage
/security          SecurityPage
/stats             StatsPage
/docs              DocsPage
```

## API Endpoints
```
GET  /api/capabilities                    → service discovery
GET  /api/brand/generate?name=Acme        → logo variations
POST /api/brand/export-svg                → production SVG
POST /api/brand/design-tokens             → CSS/Tailwind/JSON tokens
POST /api/brand/palette/generate          → semantic palette
GET  /api/brand/palette/from-name?name=X  → palette from brand name
GET  /api/brand/favicon?iconId=X          → favicon SVG + manifest
POST /api/brand/placeholder               → SVG placeholder images
POST /api/brand/letterhead                → letterhead template
POST /api/brand/app-icon                  → app icons (all sizes)
POST /api/brand/guidelines                → brand guidelines markdown
POST /api/brand/email-signature           → HTML email signature
GET  /api/brand/icons/search?query=X      → search Iconify
POST /api/legal/generate                  → single legal doc
POST /api/legal/bundle                    → multiple legal docs
GET  /api/legal/types                     → available doc types
POST /api/seo/generate                    → single SEO artifact
POST /api/seo/bundle                      → multiple SEO artifacts
GET  /api/seo/types                       → available artifact types
POST /api/security/generate               → single security artifact
POST /api/security/bundle                 → multiple security artifacts
GET  /api/security/types                  → available types + frameworks
```

## Environment Variables
- `FREEPIK_API_KEY` — optional, enables AI icon generation (Freepik API)
- No other env vars required — all generation is pure TypeScript
