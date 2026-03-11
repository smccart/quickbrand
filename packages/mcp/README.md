# @fetchkit/mcp

Model Context Protocol (MCP) server for [FetchKit](https://fetchkit.dev) — 17 tools for AI agents to generate brand kits, legal docs, SEO configs, and security hardening.

Works with Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

## Setup

Add to your MCP client configuration:

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

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

### Cursor

Add to your `.cursor/mcp.json`:

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

## Available Tools (17)

### Brand Tools

| Tool | Description |
|------|-------------|
| `generate_brand_logos` | Generate up to 30 logo variations with icons, fonts, and color combinations |
| `export_brand_svg` | Export production SVG with text converted to paths (no font deps) |
| `generate_design_tokens` | Generate CSS variables, Tailwind config, and JSON tokens |
| `generate_semantic_palette` | Generate color palette with WCAG contrast and light/dark modes |
| `generate_favicon` | Generate favicon SVG, HTML snippet, and web manifest |
| `generate_placeholder` | Generate SVG placeholder images (14 categories) |
| `search_icons` | Search the Iconify database (200k+ icons) |
| `generate_ai_icon` | Generate custom AI icons via Freepik (requires `FREEPIK_API_KEY`) |
| `generate_letterhead` | Generate SVG letterhead with header/footer HTML and print CSS |
| `generate_app_icon` | Generate app icons in all standard sizes (16-1024px) |
| `generate_brand_guidelines` | Generate comprehensive brand guidelines document (Markdown) |
| `generate_email_signature` | Generate HTML email signature with plain text fallback |

### Legal Tools

| Tool | Description |
|------|-------------|
| `generate_legal_document` | Generate a single legal doc (6 types: privacy, TOS, cookie, disclaimer, AUP, DMCA) |
| `generate_legal_bundle` | Generate multiple legal docs at once |

### SEO Tools

| Tool | Description |
|------|-------------|
| `generate_seo_artifact` | Generate a single SEO artifact (meta tags, sitemap, robots.txt, JSON-LD) |
| `generate_seo_bundle` | Generate multiple SEO artifacts at once |

### Security Tools

| Tool | Description |
|------|-------------|
| `generate_security_artifact` | Generate a single security config (CSP, CORS, auth, rate limit, validation, headers) |
| `generate_security_bundle` | Generate multiple security configs at once |

## Example Prompts

Once configured, you can ask your AI agent:

- "Generate a complete brand kit for my startup called Acme"
- "Create a privacy policy and terms of service for my SaaS app"
- "Generate SEO meta tags, sitemap, and robots.txt for mysite.com"
- "Set up CSP headers and CORS config for my Express API"
- "Scaffold everything I need for a new project called NovaTech"

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FREEPIK_API_KEY` | No | Enable AI icon generation via Freepik |

## Links

- Website: https://fetchkit.dev
- Docs: https://fetchkit.dev/docs
- GitHub: https://github.com/smccart/fetchkit
- API: https://fetchkit.dev/api/openapi.json

## License

MIT
