import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Download, Copy, Check, Loader2, Plus, Trash2, ChevronDown } from 'lucide-react';
import { SEO_ARTIFACT_TYPES, JSON_LD_TYPES } from '@fetchkit/seo';
import type { SeoArtifactType, SeoInput, SitemapPage, RobotsRule, JsonLdType, JsonLdEntity } from '@fetchkit/seo';
import { useSeoGenerator } from '@/hooks/useSeoGenerator';

const ALL_ARTIFACT_TYPES = Object.keys(SEO_ARTIFACT_TYPES) as SeoArtifactType[];
const ALL_JSON_LD_TYPES = Object.keys(JSON_LD_TYPES) as JsonLdType[];
const DEFAULT_JSON_LD: JsonLdType[] = ['Organization', 'WebSite'];

const CHANGEFREQ_OPTIONS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] as const;

export default function SeoPage() {
  const { bundle, isGenerating, generate, downloadAll, downloadSingle } = useSeoGenerator();

  // Project details
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [locale, setLocale] = useState('en_US');

  // Sitemap pages
  const [pages, setPages] = useState<SitemapPage[]>([{ path: '/', priority: 1.0, changefreq: 'weekly' }]);

  // Robots config
  const [robotsRules, setRobotsRules] = useState<RobotsRule[]>([
    { userAgent: '*', allow: ['/'], disallow: ['/admin', '/api'] },
  ]);
  const [crawlDelay, setCrawlDelay] = useState('');

  // JSON-LD
  const [selectedJsonLd, setSelectedJsonLd] = useState<Set<JsonLdType>>(new Set(DEFAULT_JSON_LD));
  const [expandedJsonLd, setExpandedJsonLd] = useState<Set<JsonLdType>>(new Set());
  const [jsonLdData, setJsonLdData] = useState<Record<string, Record<string, unknown>>>({});

  // Artifact selection
  const [selectedArtifacts, setSelectedArtifacts] = useState<Set<SeoArtifactType>>(new Set(ALL_ARTIFACT_TYPES));

  // Copy state
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const canGenerate = siteName.trim() && siteUrl.trim() && selectedArtifacts.size > 0;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;

    const jsonLdEntities: JsonLdEntity[] = Array.from(selectedJsonLd).map((type) => ({
      type,
      data: jsonLdData[type] || undefined,
    }));

    const input: SeoInput = {
      siteName: siteName.trim(),
      siteUrl: siteUrl.trim(),
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      ogImage: ogImage.trim() || undefined,
      twitterHandle: twitterHandle.trim() || undefined,
      locale: locale.trim() || 'en_US',
      pages,
      robotsConfig: {
        rules: robotsRules,
        crawlDelay: crawlDelay ? Number(crawlDelay) : undefined,
      },
      jsonLdEntities,
    };

    generate(Array.from(selectedArtifacts), input);
  }, [canGenerate, generate, selectedArtifacts, siteName, siteUrl, title, description, ogImage, twitterHandle, locale, pages, robotsRules, crawlDelay, selectedJsonLd, jsonLdData]);

  const toggleArtifact = useCallback((type: SeoArtifactType) => {
    setSelectedArtifacts((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const selectAllArtifacts = useCallback(() => {
    setSelectedArtifacts(new Set(ALL_ARTIFACT_TYPES));
  }, []);

  const toggleJsonLd = useCallback((type: JsonLdType) => {
    setSelectedJsonLd((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const toggleJsonLdExpand = useCallback((type: JsonLdType) => {
    setExpandedJsonLd((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const updateJsonLdField = useCallback((type: JsonLdType, field: string, value: unknown) => {
    setJsonLdData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }, []);

  const copyContent = useCallback(async (type: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }, []);

  // Sitemap page helpers
  const addPage = () => setPages((p) => [...p, { path: '', changefreq: 'monthly', priority: 0.5 }]);
  const removePage = (i: number) => setPages((p) => p.filter((_, idx) => idx !== i));
  const updatePage = (i: number, field: keyof SitemapPage, value: unknown) => {
    setPages((p) => p.map((page, idx) => (idx === i ? { ...page, [field]: value } : page)));
  };

  // Robots rule helpers
  const addRule = () => setRobotsRules((r) => [...r, { userAgent: '', allow: [], disallow: [] }]);
  const removeRule = (i: number) => setRobotsRules((r) => r.filter((_, idx) => idx !== i));
  const updateRule = (i: number, field: keyof RobotsRule, value: unknown) => {
    setRobotsRules((r) => r.map((rule, idx) => (idx === i ? { ...rule, [field]: value } : rule)));
  };

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">SEO Toolkit</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate meta tags, sitemaps, robots.txt, and Schema.org structured data for your project. Get search-engine ready in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        {/* Sidebar — Input Form */}
        <div className="space-y-5">
          {/* Project Details */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Project Details</h2>
            <div>
              <label className="text-sm font-medium mb-1 block">Site Name *</label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Site URL *</label>
              <Input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://acme.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Page Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Defaults to site name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your site for search results..."
                maxLength={300}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
              <span className="text-xs text-muted-foreground">{description.length}/160 recommended</span>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">OG Image URL</label>
              <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://acme.com/og.png" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Twitter Handle</label>
              <Input value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@acme" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Locale</label>
              <Input value={locale} onChange={(e) => setLocale(e.target.value)} placeholder="en_US" />
            </div>
          </div>

          {/* Sitemap Pages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sitemap Pages</h2>
              <button onClick={addPage} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Page
              </button>
            </div>
            {pages.map((page, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1 space-y-1.5">
                  <Input
                    value={page.path}
                    onChange={(e) => updatePage(i, 'path', e.target.value)}
                    placeholder="/about"
                    className="text-xs h-8"
                  />
                  <div className="flex gap-2">
                    <select
                      value={page.changefreq || 'monthly'}
                      onChange={(e) => updatePage(i, 'changefreq', e.target.value)}
                      className="flex-1 h-7 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {CHANGEFREQ_OPTIONS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step={0.1}
                      value={page.priority ?? 0.5}
                      onChange={(e) => updatePage(i, 'priority', parseFloat(e.target.value) || 0)}
                      className="w-16 text-xs h-7"
                      title="Priority (0.0-1.0)"
                    />
                  </div>
                </div>
                {pages.length > 1 && (
                  <button onClick={() => removePage(i)} className="text-muted-foreground hover:text-destructive mt-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Robots Config */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">robots.txt Rules</h2>
              <button onClick={addRule} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Rule
              </button>
            </div>
            {robotsRules.map((rule, i) => (
              <div key={i} className="space-y-1.5 p-2 rounded-md border border-border">
                <div className="flex items-center gap-2">
                  <Input
                    value={rule.userAgent}
                    onChange={(e) => updateRule(i, 'userAgent', e.target.value)}
                    placeholder="User-agent (e.g. *)"
                    className="text-xs h-7"
                  />
                  {robotsRules.length > 1 && (
                    <button onClick={() => removeRule(i)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Input
                  value={(rule.allow || []).join(', ')}
                  onChange={(e) => updateRule(i, 'allow', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  placeholder="Allow: /, /about (comma-separated)"
                  className="text-xs h-7"
                />
                <Input
                  value={(rule.disallow || []).join(', ')}
                  onChange={(e) => updateRule(i, 'disallow', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  placeholder="Disallow: /admin, /api (comma-separated)"
                  className="text-xs h-7"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1 block">Crawl Delay</label>
              <Input
                type="number"
                min={0}
                value={crawlDelay}
                onChange={(e) => setCrawlDelay(e.target.value)}
                placeholder="Optional (seconds)"
                className="text-xs h-8"
              />
            </div>
          </div>

          {/* JSON-LD Entities */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Schema.org Entities</h2>
            {ALL_JSON_LD_TYPES.map((type) => (
              <div key={type}>
                <div className="flex items-start gap-2">
                  <label className="flex items-start gap-2 text-sm cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={selectedJsonLd.has(type)}
                      onChange={() => toggleJsonLd(type)}
                      className="rounded mt-0.5"
                    />
                    <div>
                      <div className="font-medium text-xs">{JSON_LD_TYPES[type].title}</div>
                      <div className="text-[11px] text-muted-foreground">{JSON_LD_TYPES[type].description}</div>
                    </div>
                  </label>
                  {selectedJsonLd.has(type) && hasConfigFields(type) && (
                    <button
                      onClick={() => toggleJsonLdExpand(type)}
                      className="text-muted-foreground hover:text-foreground mt-0.5"
                    >
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedJsonLd.has(type) ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {selectedJsonLd.has(type) && expandedJsonLd.has(type) && (
                  <div className="ml-6 mt-2 space-y-1.5">
                    {getConfigFields(type).map((field) => (
                      <div key={field.key}>
                        <label className="text-[11px] font-medium text-muted-foreground mb-0.5 block">{field.label}</label>
                        <Input
                          value={String(jsonLdData[type]?.[field.key] ?? '')}
                          onChange={(e) => updateJsonLdField(type, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="text-xs h-7"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Artifacts to Generate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Artifacts</h2>
              <button onClick={selectAllArtifacts} className="text-xs text-primary hover:underline">Select All</button>
            </div>
            {ALL_ARTIFACT_TYPES.map((type) => (
              <label key={type} className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedArtifacts.has(type)}
                  onChange={() => toggleArtifact(type)}
                  className="rounded mt-0.5"
                />
                <div>
                  <div className="font-medium">{SEO_ARTIFACT_TYPES[type].title}</div>
                  <div className="text-xs text-muted-foreground">{SEO_ARTIFACT_TYPES[type].description}</div>
                </div>
              </label>
            ))}
          </div>

          <Button onClick={handleGenerate} disabled={!canGenerate || isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate SEO Toolkit'
            )}
          </Button>
        </div>

        {/* Main — Results */}
        <div>
          {!bundle && !isGenerating && (
            <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Fill in your project details and click Generate to create your SEO toolkit.</p>
            </div>
          )}

          {bundle && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Generated {bundle.artifacts.length} artifact{bundle.artifacts.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" size="sm" onClick={downloadAll}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download All (.zip)
                </Button>
              </div>

              <Tabs defaultValue={bundle.artifacts[0]?.type}>
                <TabsList className="flex-wrap">
                  {bundle.artifacts.map((artifact) => (
                    <TabsTrigger key={artifact.type} value={artifact.type} className="text-xs">
                      {artifact.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {bundle.artifacts.map((artifact) => (
                  <TabsContent key={artifact.type} value={artifact.type}>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                        <span className="text-xs text-muted-foreground">
                          {artifact.metadata.charCount.toLocaleString()} chars &middot; {artifact.filename}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => copyContent(artifact.type, artifact.content)}
                          >
                            {copiedType === artifact.type ? (
                              <><Check className="h-3 w-3 mr-1" />Copied</>
                            ) : (
                              <><Copy className="h-3 w-3 mr-1" />Copy</>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => downloadSingle(artifact.type)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            {artifact.filename.split('.').pop()}
                          </Button>
                        </div>
                      </div>
                      <pre className="p-4 overflow-auto max-h-150 text-xs leading-relaxed bg-muted/20">
                        <code>{artifact.content}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- JSON-LD config field helpers ---

interface ConfigField {
  key: string;
  label: string;
  placeholder: string;
}

const ENTITY_CONFIG_FIELDS: Partial<Record<JsonLdType, ConfigField[]>> = {
  Product: [
    { key: 'name', label: 'Product Name', placeholder: 'Widget Pro' },
    { key: 'description', label: 'Description', placeholder: 'A great widget' },
    { key: 'brand', label: 'Brand', placeholder: 'Acme' },
    { key: 'price', label: 'Price', placeholder: '29.99' },
    { key: 'currency', label: 'Currency', placeholder: 'USD' },
    { key: 'sku', label: 'SKU', placeholder: 'WP-001' },
  ],
  SoftwareApplication: [
    { key: 'name', label: 'App Name', placeholder: 'My App' },
    { key: 'description', label: 'Description', placeholder: 'A useful app' },
    { key: 'operatingSystem', label: 'OS', placeholder: 'Windows, macOS, Linux' },
    { key: 'applicationCategory', label: 'Category', placeholder: 'DeveloperApplication' },
    { key: 'price', label: 'Price', placeholder: '0' },
  ],
  Article: [
    { key: 'headline', label: 'Headline', placeholder: 'Article title' },
    { key: 'author', label: 'Author', placeholder: 'Jane Doe' },
    { key: 'datePublished', label: 'Date Published', placeholder: '2026-01-01' },
  ],
  LocalBusiness: [
    { key: 'name', label: 'Business Name', placeholder: 'Acme Coffee' },
    { key: 'phone', label: 'Phone', placeholder: '+1-555-0100' },
    { key: 'priceRange', label: 'Price Range', placeholder: '$$' },
  ],
  Event: [
    { key: 'name', label: 'Event Name', placeholder: 'Tech Conference 2026' },
    { key: 'startDate', label: 'Start Date', placeholder: '2026-06-15T09:00' },
    { key: 'endDate', label: 'End Date', placeholder: '2026-06-16T17:00' },
    { key: 'location', label: 'Location', placeholder: 'Convention Center' },
  ],
  FAQPage: [
    { key: 'questions', label: 'Questions (JSON)', placeholder: '[{"question":"...","answer":"..."}]' },
  ],
  Person: [
    { key: 'name', label: 'Name', placeholder: 'Jane Doe' },
    { key: 'jobTitle', label: 'Job Title', placeholder: 'Software Engineer' },
    { key: 'worksFor', label: 'Works For', placeholder: 'Acme Inc.' },
  ],
  Review: [
    { key: 'itemReviewed', label: 'Item Reviewed', placeholder: 'Product name' },
    { key: 'author', label: 'Author', placeholder: 'Jane Doe' },
    { key: 'ratingValue', label: 'Rating (1-5)', placeholder: '5' },
    { key: 'reviewBody', label: 'Review Text', placeholder: 'Great product!' },
  ],
};

function hasConfigFields(type: JsonLdType): boolean {
  return !!ENTITY_CONFIG_FIELDS[type];
}

function getConfigFields(type: JsonLdType): ConfigField[] {
  return ENTITY_CONFIG_FIELDS[type] || [];
}
