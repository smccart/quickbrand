/**
 * FetchKit Agent Integration — Direct Package Import
 *
 * For agents running in Node.js, you can import FetchKit packages directly
 * instead of calling the REST API. This is faster and works offline.
 *
 * Install:
 *   npm install @fetchkit/brand @fetchkit/legal @fetchkit/seo @fetchkit/security
 */

import {
  generateLogos,
  buildExportSvg,
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateFontCss,
  generateSemanticPalette,
  buildFaviconSvg,
  generateManifest,
  generateLetterhead,
  generateAppIcon,
  generateBrandGuidelines,
  generateEmailSignature,
  searchIcons,
  fetchIconSvg,
} from '@fetchkit/brand';

import {
  generateDocument,
  generateBundle as generateLegalBundle,
} from '@fetchkit/legal';

import {
  generateArtifact as generateSeoArtifact,
  generateBundle as generateSeoBundle,
} from '@fetchkit/seo';

import {
  generateArtifact as generateSecurityArtifact,
  generateBundle as generateSecurityBundle,
} from '@fetchkit/security';

// ─── Brand ──────────────────────────────────────────────────────────

async function brandExample() {
  // Generate logo variations
  const variations = await generateLogos('Acme Inc.', 5);
  const selected = variations[0];

  // Export as production SVG
  const svg = await buildExportSvg(selected.config, 'horizontal', 'light');

  // Generate design tokens
  const css = generateCssVariables(selected.config.colors);
  const tailwind = generateTailwindColors(selected.config.colors);
  const tokens = generateColorTokensJson(selected.config.colors);
  const fontCss = generateFontCss(selected.config.font);

  // Generate semantic palette
  const palette = generateSemanticPalette(selected.config.colors.iconColor, 'analogous');

  // Generate favicon
  const iconSvg = await fetchIconSvg(selected.config.icon.id);
  const faviconSvg = buildFaviconSvg(iconSvg!, selected.config.colors.iconColor);
  const manifest = generateManifest('Acme Inc.');

  // Generate letterhead
  const letterhead = generateLetterhead({
    companyName: 'Acme Inc.',
    tagline: 'Building the future',
    website: 'https://acme.com',
    email: 'hello@acme.com',
    colors: { primary: selected.config.colors.iconColor },
    font: { family: selected.config.font.family, category: selected.config.font.category },
  });

  // Generate app icon
  const appIcon = generateAppIcon({
    iconSvg: iconSvg!,
    iconColor: '#ffffff',
    backgroundColor: selected.config.colors.iconColor,
  });

  // Generate brand guidelines
  const guidelines = generateBrandGuidelines({
    companyName: 'Acme Inc.',
    tagline: 'Building the future',
    colors: selected.config.colors,
    font: selected.config.font,
    palette,
  });

  // Generate email signature
  const signature = generateEmailSignature({
    name: 'Jane Doe',
    title: 'CEO',
    companyName: 'Acme Inc.',
    email: 'jane@acme.com',
    website: 'https://acme.com',
    colors: { primary: selected.config.colors.iconColor },
    font: { family: selected.config.font.family, category: selected.config.font.category },
  });

  return { svg, css, tailwind, tokens, fontCss, palette, faviconSvg, manifest, letterhead, appIcon, guidelines, signature };
}

// ─── Legal ──────────────────────────────────────────────────────────

function legalExample() {
  // Single document
  const privacy = generateDocument('privacy-policy', {
    companyName: 'Acme Inc.',
    websiteUrl: 'https://acme.com',
    contactEmail: 'legal@acme.com',
    includeGdpr: true,
    includeCcpa: true,
    appType: 'saas',
  });

  // Bundle of documents
  const bundle = generateLegalBundle(
    ['privacy-policy', 'terms-of-service', 'cookie-consent', 'disclaimer'],
    {
      companyName: 'Acme Inc.',
      websiteUrl: 'https://acme.com',
      contactEmail: 'legal@acme.com',
      appType: 'saas',
    }
  );

  return { privacy, bundle };
}

// ─── SEO ────────────────────────────────────────────────────────────

function seoExample() {
  // Single artifact
  const metaTags = generateSeoArtifact('meta-tags', {
    siteName: 'Acme Inc.',
    siteUrl: 'https://acme.com',
    description: 'Building the future of cloud computing',
    twitterHandle: '@acmeinc',
  });

  // Full bundle
  const bundle = generateSeoBundle(
    ['meta-tags', 'sitemap', 'robots-txt', 'json-ld'],
    {
      siteName: 'Acme Inc.',
      siteUrl: 'https://acme.com',
      pages: [
        { path: '/', priority: 1.0, changefreq: 'weekly' },
        { path: '/about', priority: 0.8, changefreq: 'monthly' },
        { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
        { path: '/docs', priority: 0.7, changefreq: 'daily' },
      ],
      jsonLdEntities: [
        { type: 'Organization' },
        { type: 'WebSite' },
        { type: 'SoftwareApplication', data: { name: 'Acme Cloud', price: 0, applicationCategory: 'BusinessApplication' } },
      ],
    }
  );

  return { metaTags, bundle };
}

// ─── Security ───────────────────────────────────────────────────────

function securityExample() {
  // Single artifact
  const csp = generateSecurityArtifact('csp-header', {
    siteName: 'Acme Inc.',
    siteUrl: 'https://acme.com',
    framework: 'nextjs',
    appType: 'saas',
  });

  // Full bundle
  const bundle = generateSecurityBundle(
    ['csp-header', 'cors-config', 'security-headers', 'auth-scaffold', 'env-template', 'rate-limit'],
    {
      siteName: 'Acme Inc.',
      siteUrl: 'https://acme.com',
      framework: 'express',
      appType: 'saas',
      authStrategy: 'jwt',
      corsConfig: { origins: ['https://acme.com', 'https://app.acme.com'] },
    }
  );

  return { csp, bundle };
}

// ─── Full Scaffold ──────────────────────────────────────────────────

async function fullScaffold() {
  const brand = await brandExample();
  const legal = legalExample();
  const seo = seoExample();
  const security = securityExample();

  console.log('Brand assets:', Object.keys(brand).length, 'items');
  console.log('Legal docs:', legal.bundle.documents.length, 'documents');
  console.log('SEO artifacts:', seo.bundle.artifacts.length, 'artifacts');
  console.log('Security configs:', security.bundle.artifacts.length, 'artifacts');
}

fullScaffold().catch(console.error);
