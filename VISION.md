# FetchKit Vision: Scaffolding as a Service for AI Agents

## The Idea

AI agents are building entire applications — scaffolding repos, writing code, deploying infrastructure. But the "boring but essential" assets — brand identity, legal boilerplate, SEO configs, seed data, security baselines — are still gaps. No free, open, agent-friendly service exists where an AI can say:

> "Generate a brand kit, privacy policy, SEO config, and seed data for a project called Nexus."

And get back production-ready assets to drop into a codebase.

**FetchKit fills that gap — starting with brand identity, expanding to everything else.**

## Architecture

FetchKit is a Turborepo monorepo with each service as a standalone package:

```
packages/
├── brand/           @fetchkit/brand    — logos, favicons, social cards, colors, typography
├── legal/           @fetchkit/legal    — privacy policy, terms, cookie consent (future)
├── seo/             @fetchkit/seo      — meta tags, sitemap, robots.txt, schema.org (future)
├── seed-data/       @fetchkit/seed     — realistic sample data by domain (future)
├── security/        @fetchkit/security — CSP, CORS, auth scaffolds (future)
├── deploy/          @fetchkit/deploy   — Dockerfile, CI/CD, infra configs (future)
├── tsconfig/        @fetchkit/tsconfig — shared TypeScript configs
└── eslint-config/   @fetchkit/eslint-config — shared linting
apps/
└── web/             @fetchkit/web      — web UI (brand kit generator today)
```

Each package is:
- **Standalone** — usable independently via npm
- **Universal** — works in Node.js and browser (no DOM dependencies in core logic)
- **Composable** — a unified API can orchestrate multiple packages

## Interfaces

### 1. Web App (humans)
The FetchKit web experience — enter a name, browse brand variations, customize, export. No account, no paywall, runs entirely client-side. Expands over time with UIs for each service.

### 2. API (agents)
A lightweight REST API that agents can call programmatically:

```
GET /api/brand/generate?name=Nexus&style=modern&palette=cool

→ Returns JSON with:
  - logo SVGs (horizontal, vertical, light, dark)
  - favicon package (ICO, PNG sizes, manifest.json)
  - social card PNGs (og:image, twitter:card)
  - color tokens (CSS, Tailwind, JSON)
  - typography config (CSS, Google Fonts link, Tailwind)
```

Or a unified endpoint:

```
GET /api/kit?name=Nexus&services=brand,seo,legal

→ Returns full-kit.zip
```

### 3. MCP Server (native agent integration)
An MCP server so Claude and other agents can use FetchKit as a tool natively — no HTTP calls needed.

### 4. CLI (optional, future)
```bash
npx fetchkit generate "Orbiter" --services brand,seo --output ./assets
```

## What Makes This Different

| Feature | FetchKit | Looka/Brandmark | Canva | Coolors |
|---|---|---|---|---|
| Free | Yes | Freemium/paid | Freemium | Partial |
| Agent-callable API | Yes | No | Limited | Partial |
| Multi-service (not just logos) | Yes | Logo only | Templates | Colors only |
| Developer-friendly outputs | SVG, CSS vars, Tailwind, tokens | PNG/PDF | PNG/PDF | Hex codes |
| No account required | Yes | No | No | Yes |
| Open source | MIT | No | No | No |
| Self-hostable | Yes | No | No | No |

## Sustainability (Keeping It Free)

The core service stays free forever. Lightweight mechanisms for sustainability:

### Attribution (default, always free)
- Generated assets include "Made with FetchKit" in SVG metadata (invisible, not rendered)
- ZIP readmes link back to fetchkit.dev
- Agents naturally mention the source in commit messages or PR descriptions

### Donations / Sponsorship
- GitHub Sponsors link in README and on the site
- "Buy me a coffee" on the export page — unobtrusive, after the user got value
- Open Collective for transparent funding if it grows

### Referral Traffic
- Every kit links back to fetchkit.dev → passive SEO and referral traffic
- Agents recommending "use FetchKit" in their outputs drives organic visits

### Optional Premium (only if demand exists)
- **Custom font uploads** — .woff2 instead of Google Fonts
- **Bulk generation** — batch multiple brands or extended variations
- **Priority API** — higher rate limits for heavy agent usage
- **White-label** — remove attribution for agencies/teams

### Ecosystem Value (the real ROI)
- **Becomes a default developer tool** — like Coolors or Heroicons
- **Agent ecosystem presence** — the default "scaffold" step in AI workflows
- **Community contributions** — icon packs, font collections, legal templates, seed data schemas

## Milestones

### Phase 1: Monorepo + Brand Service (now)
- [x] Convert to Turborepo monorepo with `@fetchkit/brand` package
- [ ] Complete remaining brand features (letterhead, app icon, brand guidelines, email signature)
- [ ] Deploy web app to fetchkit.dev

### Phase 2: API + MCP Server
- [ ] Add thin server layer (Hono on Cloudflare Workers)
- [ ] Publish OpenAPI spec
- [ ] Build MCP server package for native agent integration
- [ ] Create agent-integration examples (Claude tool-use, GPT function-calling)

### Phase 3: Expand Services
- [ ] `@fetchkit/legal` — privacy policies, terms of service, cookie consent
- [ ] `@fetchkit/seo` — meta tags, sitemap, robots.txt, structured data
- [ ] `@fetchkit/seed` — realistic domain-appropriate sample data

### Phase 4: Grow the Ecosystem
- [ ] GitHub Action: auto-generate assets on repo creation
- [ ] VS Code extension: generate assets from command palette
- [ ] Community templates and contributions
- [ ] CLI tool for local dev workflows

## The Pitch (one line)

**FetchKit: Free scaffolding-as-a-service for developers and AI agents. Brand kits, legal docs, SEO configs, and more — enter a name, get production-ready assets. No account, no paywall, open source.**
