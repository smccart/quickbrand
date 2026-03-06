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
} from '@fetchkit/brand';
import type { ColorHarmony, LayoutDirection, ColorMode, PlaceholderCategory } from '@fetchkit/brand';
import { generateDocument, generateBundle, LEGAL_DOC_TYPES } from '@fetchkit/legal';
import type { LegalDocType } from '@fetchkit/legal';

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function registerTools(server: McpServer): void {
  // 1. Generate brand logos
  server.registerTool('generate_brand_logos', {
    title: 'Generate Brand Logos',
    description:
      'Generate logo variations for a company. Returns up to 30 logo variations with different icon, font, and color combinations. Each variation includes a LogoConfig that can be passed to export_brand_svg.',
    inputSchema: {
      companyName: z.string().describe('The company or project name'),
      count: z.number().max(30).default(10).describe('Number of variations (max 30)'),
    },
  }, async ({ companyName, count }) => {
    const variations = await generateLogos(companyName, count);
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

  // 8. Generate legal document
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

  // 9. Generate legal bundle
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
}
