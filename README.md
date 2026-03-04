# FetchKit

Free scaffolding-as-a-service for developers and AI agents.

FetchKit generates production-ready assets — brand kits, and more coming — so you can focus on building. Enter a name, get assets. No account, no paywall, open source.

## What It Does Today

### Brand Service (`@fetchkit/brand`)

Enter a company name, get a complete brand identity kit:

- **Logo Generator** — 30 variations from Iconify icons + Google Fonts + color palettes. SVG exports with text-to-path (horizontal/vertical, light/dark).
- **Favicon Generator** — SVG, ICO, PNG (16/32/48/180/192/512), manifest.json, HTML snippet.
- **Social Cards** — 1200x630 og:image PNGs (light + dark), meta tags.
- **Color System** — CSS custom properties, Tailwind config, JSON design tokens.
- **Typography Config** — CSS font declaration, Google Fonts link, Tailwind config.

### What's Coming

- **Legal** — Privacy policies, terms of service, cookie consent
- **SEO** — Meta tags, sitemap, robots.txt, structured data
- **Seed Data** — Realistic domain-appropriate sample data
- **Security** — CSP headers, CORS config, auth scaffolds
- **Deploy** — Dockerfiles, CI/CD, infrastructure configs

See [VISION.md](VISION.md) for the full roadmap.

## Philosophy

- **Speed over perfection** — A brand kit in 60 seconds beats a perfect one in 60 hours.
- **Developer-first** — Outputs are code-friendly: SVGs, CSS variables, Tailwind configs, copy-paste snippets.
- **Agent-first** — Every service is a standalone package callable by AI agents via API or MCP.
- **No accounts, no paywalls** — Client-side web app. No backend, no sign-up, no tracking.

## Tech Stack

- Turborepo + pnpm workspaces
- React 19 + TypeScript + Vite
- Tailwind CSS 4 + shadcn/ui
- Iconify (icon search + rendering)
- opentype.js (font parsing + SVG text-to-path)
- JSZip (bundle downloads)

## Project Structure

```
packages/
├── brand/              @fetchkit/brand — core brand generation logic (pure TS)
├── tsconfig/           @fetchkit/tsconfig — shared TypeScript configs
└── eslint-config/      @fetchkit/eslint-config — shared linting
apps/
└── web/                @fetchkit/web — web UI (React + Vite)
```

## Development

```bash
pnpm install
pnpm dev          # runs all packages via turbo
pnpm build        # builds brand package, then web app
pnpm typecheck    # type-check all packages
```

## License

MIT
