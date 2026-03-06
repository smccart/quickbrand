import type { SeoInput } from '../types';

export function robotsTxtTemplate(input: SeoInput): { content: string; language: 'text'; filename: string } {
  const baseUrl = input.siteUrl.replace(/\/$/, '');
  const config = input.robotsConfig || {
    rules: [{ userAgent: '*', allow: ['/'], disallow: ['/admin', '/api'] }],
  };

  const lines: string[] = [];

  const rules = config.rules || [{ userAgent: '*', allow: ['/'] }];
  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent}`);
    if (rule.allow) {
      for (const path of rule.allow) {
        lines.push(`Allow: ${path}`);
      }
    }
    if (rule.disallow) {
      for (const path of rule.disallow) {
        lines.push(`Disallow: ${path}`);
      }
    }
    lines.push('');
  }

  if (config.crawlDelay) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`, '');
  }

  const sitemapUrl = config.sitemapUrl || `${baseUrl}/sitemap.xml`;
  lines.push(`Sitemap: ${sitemapUrl}`);

  return { content: lines.join('\n'), language: 'text', filename: 'robots.txt' };
}
