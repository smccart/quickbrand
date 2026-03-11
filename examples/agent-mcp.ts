/**
 * FetchKit Agent Integration — MCP Server Examples
 *
 * These examples show how an AI agent uses FetchKit via the Model Context Protocol.
 * The MCP server exposes 17 tools that agents can call directly.
 *
 * Setup:
 *   npx @fetchkit/mcp
 *
 * Or add to your MCP client config:
 *   {
 *     "mcpServers": {
 *       "fetchkit": {
 *         "command": "npx",
 *         "args": ["@fetchkit/mcp"]
 *       }
 *     }
 *   }
 */

// ─── Available MCP Tools (17 total) ─────────────────────────────────
//
// Brand (12 tools):
//   generate_brand_logos      — Logo variations with icons, fonts, and colors
//   export_brand_svg          — Production SVG with text-to-paths
//   generate_design_tokens    — CSS variables, Tailwind config, JSON tokens
//   generate_semantic_palette — Full color palette from seed color
//   generate_favicon          — Favicon SVG + manifest + HTML snippet
//   generate_placeholder      — SVG placeholder images for mockups
//   search_icons              — Search Iconify icon database
//   generate_ai_icon          — AI-generated icons via Freepik
//   generate_letterhead       — SVG letterhead + header/footer HTML + print CSS
//   generate_app_icon         — App icons in all standard sizes (16-1024px)
//   generate_brand_guidelines — Comprehensive brand guidelines in Markdown
//   generate_email_signature  — HTML email signature + plain text fallback
//
// Legal (2 tools):
//   generate_legal_document   — Single legal doc (privacy, terms, etc.)
//   generate_legal_bundle     — Multiple legal docs at once
//
// SEO (2 tools):
//   generate_seo_artifact     — Single SEO artifact (meta tags, sitemap, etc.)
//   generate_seo_bundle       — Multiple SEO artifacts at once
//
// Security (2 tools):
//   generate_security_artifact — Single security config (CSP, CORS, etc.)
//   generate_security_bundle   — Multiple security configs at once

// ─── Example Agent Conversation ─────────────────────────────────────
//
// User: "Set up my new SaaS project called CloudSync at https://cloudsync.io"
//
// Agent would call these MCP tools in sequence:
//
// 1. generate_brand_logos({ companyName: "CloudSync", count: 5 })
//    → Picks best variation
//
// 2. export_brand_svg({ config: selectedVariation.config, layout: "horizontal" })
//    → Gets production SVG
//
// 3. generate_favicon({ iconId: "mdi:cloud-sync", iconColor: "#6366f1", companyName: "CloudSync" })
//    → Gets favicon + manifest
//
// 4. generate_design_tokens({ colors: selectedVariation.config.colors, font: selectedVariation.config.font })
//    → Gets CSS variables + Tailwind config
//
// 5. generate_app_icon({ iconId: "mdi:cloud-sync", backgroundColor: "#6366f1" })
//    → Gets app icons for PWA
//
// 6. generate_brand_guidelines({ companyName: "CloudSync", primaryColor: "#6366f1" })
//    → Gets brand guidelines doc
//
// 7. generate_letterhead({ companyName: "CloudSync", website: "https://cloudsync.io" })
//    → Gets letterhead template
//
// 8. generate_email_signature({ name: "Jane Doe", companyName: "CloudSync", email: "jane@cloudsync.io" })
//    → Gets email signature HTML
//
// 9. generate_legal_bundle({
//      types: ["privacy-policy", "terms-of-service", "cookie-consent"],
//      companyName: "CloudSync",
//      websiteUrl: "https://cloudsync.io",
//      contactEmail: "legal@cloudsync.io",
//      appType: "saas",
//      includeGdpr: true,
//      includeCcpa: true
//    })
//    → Gets all legal documents
//
// 10. generate_seo_bundle({
//       types: ["meta-tags", "sitemap", "robots-txt", "json-ld"],
//       siteName: "CloudSync",
//       siteUrl: "https://cloudsync.io",
//       description: "Real-time file synchronization for teams"
//     })
//     → Gets all SEO artifacts
//
// 11. generate_security_bundle({
//       types: ["csp-header", "cors-config", "security-headers", "auth-scaffold", "env-template", "rate-limit"],
//       siteName: "CloudSync",
//       siteUrl: "https://cloudsync.io",
//       framework: "nextjs",
//       appType: "saas",
//       authStrategy: "jwt"
//     })
//     → Gets all security configurations
//
// The agent now has everything needed to scaffold the project:
// - Brand identity (logo, favicon, colors, fonts, guidelines)
// - Legal compliance (privacy, terms, cookies)
// - SEO optimization (meta tags, sitemap, structured data)
// - Security hardening (CSP, CORS, auth, rate limiting)

export {};
