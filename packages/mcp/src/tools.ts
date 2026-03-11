import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  generateLogos,
  buildExportSvg,
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateFontCss,
  generateFontLinkTag,
  generateTailwindFont,
  generateSemanticPalette,
  generatePaletteFromName,
  bundlePaletteExport,
  fetchIconSvg,
  buildFaviconSvg,
  generateManifest,
  generateHtmlSnippet,
  searchIcons,
  generatePlaceholder,
  generateFreepikIcon,
  generateLetterhead,
  generateAppIcon,
  generateBrandGuidelines,
  generateEmailSignature,
} from '@fetchkit/brand';
import type { ColorHarmony, LayoutDirection, ColorMode, PlaceholderCategory } from '@fetchkit/brand';
import { generateDocument, generateBundle, LEGAL_DOC_TYPES } from '@fetchkit/legal';
import type { LegalDocType } from '@fetchkit/legal';
import { generateArtifact, generateBundle as generateSeoBundle, SEO_ARTIFACT_TYPES } from '@fetchkit/seo';
import type { SeoArtifactType } from '@fetchkit/seo';
import { generateArtifact as generateSecurityArtifact, generateBundle as generateSecurityBundle, SECURITY_ARTIFACT_TYPES, APP_FRAMEWORKS, AUTH_STRATEGIES } from '@fetchkit/security';
import type { SecurityArtifactType } from '@fetchkit/security';

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

const FREEPIK_API_KEY = typeof process !== 'undefined' ? process.env.FREEPIK_API_KEY : undefined;

export function registerTools(server: McpServer): void {
  // 1. Generate brand logos
  server.registerTool('generate_brand_logos', {
    title: 'Generate Brand Logos',
    description:
      'Generate logo variations for a company. Returns up to 30 logo variations with different icon, font, and color combinations. Each variation includes a LogoConfig that can be passed to export_brand_svg. When FREEPIK_API_KEY is set, includes AI-generated icons alongside Iconify results.',
    inputSchema: {
      companyName: z.string().describe('The company or project name'),
      count: z.number().max(30).default(10).describe('Number of variations (max 30)'),
    },
  }, async ({ companyName, count }) => {
    const variations = await generateLogos(companyName, count, FREEPIK_API_KEY);
    return textResult({ variations, count: variations.length });
  });

  // 2. Export brand SVG
  server.registerTool('export_brand_svg', {
    title: 'Export Brand SVG',
    description:
      'Build a production-ready SVG logo with text converted to paths (no font dependencies). Takes a LogoConfig from generate_brand_logos output.',
    inputSchema: {
      config: z.object({
        companyName: z.string(),
        font: z.object({
          family: z.string(),
          weight: z.number(),
          category: z.enum(['serif', 'sans-serif', 'display', 'handwriting', 'monospace']),
        }),
        icon: z.object({
          id: z.string(),
          name: z.string(),
          svg: z.string(),
        }),
        colors: z.object({
          name: z.string(),
          iconColor: z.string(),
          letterColors: z.array(z.string()),
        }),
      }).describe('A LogoConfig object from generate_brand_logos'),
      layout: z.enum(['horizontal', 'vertical']).default('horizontal').describe('Logo layout'),
      mode: z.enum(['light', 'dark']).default('light').describe('Color mode'),
    },
  }, async ({ config, layout, mode }) => {
    const svg = await buildExportSvg(config, layout as LayoutDirection, mode as ColorMode);
    return textResult({ svg, layout, mode });
  });

  // 3. Generate design tokens
  server.registerTool('generate_design_tokens', {
    title: 'Generate Design Tokens',
    description:
      'Generate CSS variables, Tailwind config, and JSON design tokens from a brand color palette and font.',
    inputSchema: {
      colors: z.object({
        name: z.string(),
        iconColor: z.string(),
        letterColors: z.array(z.string()),
      }).describe('A ColorPalette object'),
      font: z.object({
        family: z.string(),
        weight: z.number(),
        category: z.enum(['serif', 'sans-serif', 'display', 'handwriting', 'monospace']),
      }).describe('A FontConfig object'),
    },
  }, async ({ colors, font }) => {
    return textResult({
      css: {
        variables: generateCssVariables(colors),
        fontCss: generateFontCss(font),
      },
      tailwind: {
        colors: generateTailwindColors(colors),
        font: generateTailwindFont(font),
      },
      json: { colorTokens: generateColorTokensJson(colors) },
      html: { fontLinkTag: generateFontLinkTag(font) },
    });
  });

  // 4. Generate semantic palette
  server.registerTool('generate_semantic_palette', {
    title: 'Generate Semantic Palette',
    description:
      'Generate a full semantic color palette with shade scales, WCAG contrast ratios, and light/dark mode variants. Provide either a seed hex color or a brand name for deterministic generation.',
    inputSchema: {
      seedColor: z.string().optional().describe('Hex color to build palette from (e.g. #6366f1)'),
      brandName: z.string().optional().describe('Generate deterministic palette from brand name (alternative to seedColor)'),
      harmony: z.enum(['complementary', 'analogous', 'triadic', 'split-complementary', 'monochromatic']).default('analogous').describe('Color harmony type'),
    },
  }, async ({ seedColor, brandName, harmony }) => {
    let palette;
    if (brandName) {
      palette = generatePaletteFromName(brandName);
    } else if (seedColor) {
      palette = generateSemanticPalette(seedColor, harmony as ColorHarmony);
    } else {
      return textResult({ error: 'Provide either seedColor or brandName' });
    }
    const exported = bundlePaletteExport(palette);
    return textResult(exported);
  });

  // 5. Generate favicon
  server.registerTool('generate_favicon', {
    title: 'Generate Favicon',
    description:
      'Generate a favicon SVG from an Iconify icon. Returns SVG markup, HTML snippet for embedding, and a web manifest template.',
    inputSchema: {
      iconId: z.string().describe('Iconify icon ID (e.g. mdi:rocket-launch)'),
      iconColor: z.string().describe('Hex color for the icon (e.g. #6366f1)'),
      companyName: z.string().describe('Company name for the manifest'),
    },
  }, async ({ iconId, iconColor, companyName }) => {
    const iconSvg = await fetchIconSvg(iconId);
    if (!iconSvg) {
      return textResult({ error: `Icon not found: ${iconId}` });
    }
    const faviconSvg = buildFaviconSvg(iconSvg, iconColor);
    const manifest = generateManifest(companyName);
    const htmlSnippet = generateHtmlSnippet();
    return textResult({ svg: faviconSvg, htmlSnippet, manifest: JSON.parse(manifest) });
  });

  // 6. Generate placeholder
  server.registerTool('generate_placeholder', {
    title: 'Generate Placeholder Image',
    description:
      'Generate SVG placeholder images for UI mockups. Categories: hero, avatar, product, chart, team, background, pattern, icon-grid, screenshot-dashboard, screenshot-table, screenshot-chat, screenshot-editor, screenshot-settings, screenshot-landing.',
    inputSchema: {
      category: z.enum(['hero', 'avatar', 'product', 'chart', 'team', 'background', 'pattern', 'icon-grid', 'screenshot-dashboard', 'screenshot-table', 'screenshot-chat', 'screenshot-editor', 'screenshot-settings', 'screenshot-landing']).describe('Placeholder category'),
      colors: z.array(z.string()).default([]).describe('Hex colors to use'),
      width: z.number().optional().describe('Width in pixels'),
      height: z.number().optional().describe('Height in pixels'),
      label: z.string().optional().describe('Custom label text'),
    },
  }, async ({ category, colors, width, height, label }) => {
    const image = generatePlaceholder({
      category: category as PlaceholderCategory,
      width: width ?? 0,
      height: height ?? 0,
      colors,
      label,
    });
    return textResult(image);
  });

  // 7. Search icons
  server.registerTool('search_icons', {
    title: 'Search Icons',
    description: 'Search the Iconify icon database. Returns icon IDs usable with generate_favicon or export_brand_svg.',
    inputSchema: {
      query: z.string().describe('Search term'),
      limit: z.number().max(50).default(20).describe('Max results'),
    },
  }, async ({ query, limit }) => {
    const icons = await searchIcons(query, limit);
    return textResult({ icons, count: icons.length });
  });

  // 8. Generate AI icon (Freepik)
  server.registerTool('generate_ai_icon', {
    title: 'Generate AI Icon',
    description:
      'Generate a custom AI icon using Freepik. Requires FREEPIK_API_KEY environment variable. Returns an IconConfig with embedded SVG.',
    inputSchema: {
      prompt: z.string().describe('Description of the icon to generate (e.g. "rocket launching into space")'),
      style: z.enum(['solid', 'outline', 'color', 'flat', 'sticker']).default('solid').describe('Visual style'),
    },
  }, async ({ prompt, style }) => {
    if (!FREEPIK_API_KEY) {
      return textResult({ error: 'FREEPIK_API_KEY environment variable not set. AI icon generation unavailable.' });
    }
    const icon = await generateFreepikIcon(prompt, FREEPIK_API_KEY, style);
    if (!icon) {
      return textResult({ error: 'Icon generation failed or timed out' });
    }
    return textResult({ icon });
  });

  // 9. Generate letterhead
  server.registerTool('generate_letterhead', {
    title: 'Generate Letterhead',
    description:
      'Generate an SVG letterhead template with header HTML, footer HTML, and print CSS for professional documents.',
    inputSchema: {
      companyName: z.string().describe('Company name'),
      tagline: z.string().optional().describe('Company tagline'),
      address: z.string().optional().describe('Company address'),
      phone: z.string().optional().describe('Phone number'),
      email: z.string().optional().describe('Contact email'),
      website: z.string().optional().describe('Website URL'),
      primaryColor: z.string().default('#6366f1').describe('Primary brand color (hex)'),
      fontFamily: z.string().default('Inter').describe('Font family name'),
      fontCategory: z.string().default('sans-serif').describe('Font category'),
    },
  }, async (args) => {
    const result = generateLetterhead({
      companyName: args.companyName,
      tagline: args.tagline,
      address: args.address,
      phone: args.phone,
      email: args.email,
      website: args.website,
      colors: { primary: args.primaryColor },
      font: { family: args.fontFamily, category: args.fontCategory },
    });
    return textResult(result);
  });

  // 9b. Generate app icon
  server.registerTool('generate_app_icon', {
    title: 'Generate App Icon',
    description:
      'Generate app icons in all standard sizes (16-1024px) with optional gradient backgrounds. Returns SVGs, manifest entry, and HTML snippet.',
    inputSchema: {
      iconId: z.string().describe('Iconify icon ID (e.g. mdi:rocket-launch)'),
      iconColor: z.string().default('#ffffff').describe('Icon color (hex)'),
      backgroundColor: z.string().default('#6366f1').describe('Background color (hex)'),
      borderRadius: z.number().default(22).describe('Border radius percentage (0-50)'),
      padding: z.number().default(20).describe('Padding percentage (0-50)'),
      gradientFrom: z.string().optional().describe('Gradient start color (hex)'),
      gradientTo: z.string().optional().describe('Gradient end color (hex)'),
    },
  }, async (args) => {
    const iconSvg = await fetchIconSvg(args.iconId);
    if (!iconSvg) {
      return textResult({ error: `Icon not found: ${args.iconId}` });
    }
    const result = generateAppIcon({
      iconSvg,
      iconColor: args.iconColor,
      backgroundColor: args.backgroundColor,
      borderRadius: args.borderRadius,
      padding: args.padding,
      gradient: args.gradientFrom && args.gradientTo ? { from: args.gradientFrom, to: args.gradientTo } : undefined,
    });
    return textResult({ svg: result.svg, htmlSnippet: result.htmlSnippet, manifestEntry: result.manifestEntry, sizeCount: result.sizes.length });
  });

  // 9c. Generate brand guidelines
  server.registerTool('generate_brand_guidelines', {
    title: 'Generate Brand Guidelines',
    description:
      'Generate a comprehensive brand guidelines document in Markdown with color table, typography snippet, and usage rules.',
    inputSchema: {
      companyName: z.string().describe('Company name'),
      tagline: z.string().optional().describe('Company tagline'),
      description: z.string().optional().describe('Brand description'),
      primaryColor: z.string().default('#6366f1').describe('Primary brand color (hex)'),
      letterColors: z.array(z.string()).default([]).describe('Additional brand colors'),
      fontFamily: z.string().default('Inter').describe('Primary font family'),
      fontWeight: z.number().default(700).describe('Primary font weight'),
      fontCategory: z.enum(['serif', 'sans-serif', 'display', 'handwriting', 'monospace']).default('sans-serif'),
    },
  }, async (args) => {
    const result = generateBrandGuidelines({
      companyName: args.companyName,
      tagline: args.tagline,
      description: args.description,
      colors: {
        name: 'brand',
        iconColor: args.primaryColor,
        letterColors: args.letterColors.length ? args.letterColors : [args.primaryColor],
      },
      font: { family: args.fontFamily, weight: args.fontWeight, category: args.fontCategory },
    });
    return textResult(result);
  });

  // 9d. Generate email signature
  server.registerTool('generate_email_signature', {
    title: 'Generate Email Signature',
    description:
      'Generate a professional HTML email signature with plain text fallback. Table-based layout for email client compatibility.',
    inputSchema: {
      name: z.string().describe('Person name'),
      title: z.string().optional().describe('Job title'),
      companyName: z.string().describe('Company name'),
      email: z.string().optional().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      website: z.string().optional().describe('Website URL'),
      linkedin: z.string().optional().describe('LinkedIn profile URL'),
      twitter: z.string().optional().describe('Twitter handle'),
      primaryColor: z.string().default('#6366f1').describe('Brand color (hex)'),
      fontFamily: z.string().default('Inter').describe('Font family'),
      fontCategory: z.string().default('sans-serif').describe('Font category'),
      photoUrl: z.string().optional().describe('Profile photo URL'),
    },
  }, async (args) => {
    const result = generateEmailSignature({
      name: args.name,
      title: args.title,
      companyName: args.companyName,
      email: args.email,
      phone: args.phone,
      website: args.website,
      linkedin: args.linkedin,
      twitter: args.twitter,
      colors: { primary: args.primaryColor },
      font: { family: args.fontFamily, category: args.fontCategory },
      photoUrl: args.photoUrl,
    });
    return textResult(result);
  });

  // 10. Generate legal document
  const legalDocTypes = Object.keys(LEGAL_DOC_TYPES) as LegalDocType[];
  const legalTypeEnum = z.enum(legalDocTypes as [string, ...string[]]);

  server.registerTool('generate_legal_document', {
    title: 'Generate Legal Document',
    description:
      `Generate a single legal document (privacy policy, terms of service, cookie consent, disclaimer, acceptable use policy, or DMCA policy). Returns Markdown and HTML.`,
    inputSchema: {
      type: legalTypeEnum.describe('Document type to generate'),
      companyName: z.string().describe('Company or project name'),
      websiteUrl: z.string().describe('Website URL'),
      contactEmail: z.string().describe('Contact email for legal inquiries'),
      jurisdiction: z.string().default('United States').describe('Legal jurisdiction'),
      appType: z.enum(['website', 'saas', 'mobile-app', 'marketplace']).default('website').describe('Type of application'),
      includeGdpr: z.boolean().default(false).describe('Include GDPR section (privacy policy only)'),
      includeCcpa: z.boolean().default(false).describe('Include CCPA section (privacy policy only)'),
    },
  }, async ({ type, companyName, websiteUrl, contactEmail, jurisdiction, appType, includeGdpr, includeCcpa }) => {
    const doc = generateDocument(type as LegalDocType, {
      companyName, websiteUrl, contactEmail, jurisdiction, appType, includeGdpr, includeCcpa,
    });
    return textResult(doc);
  });

  // 11. Generate legal bundle
  server.registerTool('generate_legal_bundle', {
    title: 'Generate Legal Bundle',
    description:
      'Generate multiple legal documents at once. Returns an array of documents, each with Markdown and HTML.',
    inputSchema: {
      types: z.array(legalTypeEnum).describe('Document types to generate'),
      companyName: z.string().describe('Company or project name'),
      websiteUrl: z.string().describe('Website URL'),
      contactEmail: z.string().describe('Contact email for legal inquiries'),
      jurisdiction: z.string().default('United States').describe('Legal jurisdiction'),
      appType: z.enum(['website', 'saas', 'mobile-app', 'marketplace']).default('website').describe('Type of application'),
      includeGdpr: z.boolean().default(false).describe('Include GDPR section (privacy policy only)'),
      includeCcpa: z.boolean().default(false).describe('Include CCPA section (privacy policy only)'),
    },
  }, async ({ types, companyName, websiteUrl, contactEmail, jurisdiction, appType, includeGdpr, includeCcpa }) => {
    const bundle = generateBundle(types as LegalDocType[], {
      companyName, websiteUrl, contactEmail, jurisdiction, appType, includeGdpr, includeCcpa,
    });
    return textResult(bundle);
  });

  // 12. Generate SEO artifact
  const seoArtifactTypes = Object.keys(SEO_ARTIFACT_TYPES) as SeoArtifactType[];
  const seoTypeEnum = z.enum(seoArtifactTypes as [string, ...string[]]);

  server.registerTool('generate_seo_artifact', {
    title: 'Generate SEO Artifact',
    description:
      'Generate a single SEO artifact: meta tags (HTML), XML sitemap, robots.txt, or Schema.org JSON-LD structured data.',
    inputSchema: {
      type: seoTypeEnum.describe('Artifact type to generate'),
      siteName: z.string().describe('Site or company name'),
      siteUrl: z.string().describe('Site URL (e.g. https://example.com)'),
      title: z.string().optional().describe('Page title (defaults to siteName)'),
      description: z.string().optional().describe('Meta description'),
      locale: z.string().default('en_US').describe('Locale (e.g. en_US)'),
      ogImage: z.string().optional().describe('URL to Open Graph image'),
      twitterHandle: z.string().optional().describe('Twitter handle (e.g. @company)'),
      pages: z.array(z.object({
        path: z.string().describe('URL path (e.g. /about)'),
        lastmod: z.string().optional().describe('Last modified date (ISO)'),
        changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).optional(),
        priority: z.number().optional().describe('Priority 0.0-1.0'),
      })).optional().describe('Sitemap pages'),
      robotsConfig: z.object({
        rules: z.array(z.object({
          userAgent: z.string(),
          allow: z.array(z.string()).optional(),
          disallow: z.array(z.string()).optional(),
        })).optional(),
        sitemapUrl: z.string().optional(),
        crawlDelay: z.number().optional(),
      }).optional().describe('robots.txt configuration'),
      jsonLdEntities: z.array(z.object({
        type: z.enum(['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'FAQPage', 'Product', 'SoftwareApplication', 'Review', 'Article', 'LocalBusiness', 'Event', 'Person']),
        data: z.record(z.unknown()).optional(),
      })).optional().describe('Schema.org entities to generate'),
    },
  }, async (args) => {
    const artifact = generateArtifact(args.type as SeoArtifactType, args);
    return textResult(artifact);
  });

  // 13. Generate SEO bundle
  server.registerTool('generate_seo_bundle', {
    title: 'Generate SEO Bundle',
    description:
      'Generate multiple SEO artifacts at once (meta tags, sitemap, robots.txt, JSON-LD).',
    inputSchema: {
      types: z.array(seoTypeEnum).describe('Artifact types to generate'),
      siteName: z.string().describe('Site or company name'),
      siteUrl: z.string().describe('Site URL'),
      title: z.string().optional().describe('Page title'),
      description: z.string().optional().describe('Meta description'),
      locale: z.string().default('en_US').describe('Locale'),
      ogImage: z.string().optional().describe('URL to Open Graph image'),
      twitterHandle: z.string().optional().describe('Twitter handle'),
      pages: z.array(z.object({
        path: z.string(),
        lastmod: z.string().optional(),
        changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).optional(),
        priority: z.number().optional(),
      })).optional().describe('Sitemap pages'),
      robotsConfig: z.object({
        rules: z.array(z.object({
          userAgent: z.string(),
          allow: z.array(z.string()).optional(),
          disallow: z.array(z.string()).optional(),
        })).optional(),
        sitemapUrl: z.string().optional(),
        crawlDelay: z.number().optional(),
      }).optional(),
      jsonLdEntities: z.array(z.object({
        type: z.enum(['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'FAQPage', 'Product', 'SoftwareApplication', 'Review', 'Article', 'LocalBusiness', 'Event', 'Person']),
        data: z.record(z.unknown()).optional(),
      })).optional(),
    },
  }, async (args) => {
    const bundle = generateSeoBundle(args.types as SeoArtifactType[], args);
    return textResult(bundle);
  });

  // 14. Generate security artifact
  const securityArtifactTypes = Object.keys(SECURITY_ARTIFACT_TYPES) as SecurityArtifactType[];
  const securityTypeEnum = z.enum(securityArtifactTypes as [string, ...string[]]);
  const frameworkEnum = z.enum(Object.keys(APP_FRAMEWORKS) as [string, ...string[]]);
  const authStrategyEnum = z.enum(Object.keys(AUTH_STRATEGIES) as [string, ...string[]]);

  server.registerTool('generate_security_artifact', {
    title: 'Generate Security Artifact',
    description:
      'Generate a single security artifact: CSP header, CORS config, security headers, auth scaffold, env template, or rate limiter.',
    inputSchema: {
      type: securityTypeEnum.describe('Artifact type to generate'),
      siteName: z.string().describe('Site or company name'),
      siteUrl: z.string().describe('Site URL (e.g. https://example.com)'),
      framework: frameworkEnum.default('generic').describe('Target framework (express, nextjs, fastify, hono, generic)'),
      appType: z.enum(['website', 'saas', 'api', 'mobile-backend']).default('website').describe('Type of application'),
      authStrategy: authStrategyEnum.default('jwt').describe('Authentication strategy (jwt, session, oauth2, api-key)'),
      corsOrigins: z.array(z.string()).optional().describe('Allowed CORS origins'),
    },
  }, async (args) => {
    const artifact = generateSecurityArtifact(args.type as SecurityArtifactType, {
      siteName: args.siteName,
      siteUrl: args.siteUrl,
      framework: args.framework as any,
      appType: args.appType,
      authStrategy: args.authStrategy as any,
      corsConfig: args.corsOrigins ? { origins: args.corsOrigins } : undefined,
    });
    return textResult(artifact);
  });

  // 15. Generate security bundle
  server.registerTool('generate_security_bundle', {
    title: 'Generate Security Bundle',
    description:
      'Generate multiple security artifacts at once (CSP, CORS, headers, auth, env, rate limit).',
    inputSchema: {
      types: z.array(securityTypeEnum).describe('Artifact types to generate'),
      siteName: z.string().describe('Site or company name'),
      siteUrl: z.string().describe('Site URL'),
      framework: frameworkEnum.default('generic').describe('Target framework'),
      appType: z.enum(['website', 'saas', 'api', 'mobile-backend']).default('website').describe('Type of application'),
      authStrategy: authStrategyEnum.default('jwt').describe('Authentication strategy'),
      corsOrigins: z.array(z.string()).optional().describe('Allowed CORS origins'),
    },
  }, async (args) => {
    const bundle = generateSecurityBundle(args.types as SecurityArtifactType[], {
      siteName: args.siteName,
      siteUrl: args.siteUrl,
      framework: args.framework as any,
      appType: args.appType,
      authStrategy: args.authStrategy as any,
      corsConfig: args.corsOrigins ? { origins: args.corsOrigins } : undefined,
    });
    return textResult(bundle);
  });
}
