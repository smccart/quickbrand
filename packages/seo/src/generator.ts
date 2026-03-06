import type { SeoArtifactType, SeoInput, SeoArtifact, SeoBundle } from './types';
import { SEO_ARTIFACT_TYPES } from './types';
import { metaTagsTemplate } from './templates/meta-tags';
import { sitemapTemplate } from './templates/sitemap';
import { robotsTxtTemplate } from './templates/robots-txt';
import { jsonLdTemplate } from './templates/json-ld';

type TemplateResult = { content: string; language: SeoArtifact['language']; filename: string };

const templateMap: Record<SeoArtifactType, (input: SeoInput) => TemplateResult> = {
  'meta-tags': metaTagsTemplate,
  'sitemap': sitemapTemplate,
  'robots-txt': robotsTxtTemplate,
  'json-ld': jsonLdTemplate,
};

function normalizeInput(input: SeoInput): SeoInput {
  return {
    ...input,
    title: input.title || input.siteName,
    description: input.description || `${input.siteName} - Official Website`,
    locale: input.locale || 'en_US',
    pages: input.pages || [{ path: '/', priority: 1.0, changefreq: 'weekly' }],
    robotsConfig: input.robotsConfig || {
      rules: [{ userAgent: '*', allow: ['/'], disallow: ['/admin', '/api'] }],
    },
    jsonLdEntities: input.jsonLdEntities || [
      { type: 'Organization' },
      { type: 'WebSite' },
    ],
  };
}

export function generateArtifact(type: SeoArtifactType, input: SeoInput): SeoArtifact {
  const templateFn = templateMap[type];
  if (!templateFn) {
    throw new Error(`Unknown SEO artifact type: ${type}`);
  }

  const normalized = normalizeInput(input);
  const result = templateFn(normalized);

  return {
    type,
    title: SEO_ARTIFACT_TYPES[type].title,
    content: result.content,
    language: result.language,
    filename: result.filename,
    metadata: {
      generatedAt: new Date().toISOString(),
      charCount: result.content.length,
    },
  };
}

export function generateBundle(types: SeoArtifactType[], input: SeoInput): SeoBundle {
  const normalized = normalizeInput(input);
  const artifacts = types.map((type) => generateArtifact(type, normalized));
  return { artifacts, input: normalized };
}
