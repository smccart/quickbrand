import type { SeoInput } from '../types';

export function sitemapTemplate(input: SeoInput): { content: string; language: 'xml'; filename: string } {
  const baseUrl = input.siteUrl.replace(/\/$/, '');
  const pages = input.pages || [{ path: '/', priority: 1.0, changefreq: 'weekly' as const }];

  const urls = pages.map((page) => {
    const loc = `${baseUrl}${page.path}`;
    const parts = [`    <loc>${escapeXml(loc)}</loc>`];

    if (page.lastmod) {
      parts.push(`    <lastmod>${escapeXml(page.lastmod)}</lastmod>`);
    }
    if (page.changefreq) {
      parts.push(`    <changefreq>${page.changefreq}</changefreq>`);
    }
    if (page.priority !== undefined) {
      parts.push(`    <priority>${page.priority.toFixed(1)}</priority>`);
    }

    return `  <url>\n${parts.join('\n')}\n  </url>`;
  });

  const content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');

  return { content, language: 'xml', filename: 'sitemap.xml' };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
