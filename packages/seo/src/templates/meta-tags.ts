import type { SeoInput } from '../types';

export function metaTagsTemplate(input: SeoInput): { content: string; language: 'html'; filename: string } {
  const title = input.title || input.siteName;
  const description = input.description || `${input.siteName} - Official Website`;
  const locale = input.locale || 'en_US';
  const url = input.siteUrl.replace(/\/$/, '');

  const lines: string[] = [
    '<!-- Primary Meta Tags -->',
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="title" content="${escapeAttr(title)}" />`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    '',
    '<!-- Open Graph / Facebook -->',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:site_name" content="${escapeAttr(input.siteName)}" />`,
    `<meta property="og:locale" content="${escapeAttr(locale)}" />`,
  ];

  if (input.ogImage) {
    lines.push(`<meta property="og:image" content="${escapeAttr(input.ogImage)}" />`);
  }

  lines.push(
    '',
    '<!-- Twitter -->',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${escapeAttr(url)}" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
  );

  if (input.ogImage) {
    lines.push(`<meta name="twitter:image" content="${escapeAttr(input.ogImage)}" />`);
  }

  if (input.twitterHandle) {
    const handle = input.twitterHandle.startsWith('@') ? input.twitterHandle : `@${input.twitterHandle}`;
    lines.push(`<meta name="twitter:site" content="${escapeAttr(handle)}" />`);
    lines.push(`<meta name="twitter:creator" content="${escapeAttr(handle)}" />`);
  }

  lines.push(
    '',
    '<!-- Canonical -->',
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );

  return { content: lines.join('\n'), language: 'html', filename: 'meta-tags.html' };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
