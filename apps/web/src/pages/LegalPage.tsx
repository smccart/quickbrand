import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Scale, Download, Copy, Check, Loader2 } from 'lucide-react';
import { LEGAL_DOC_TYPES } from '@fetchkit/legal';
import type { LegalDocType, LegalInput } from '@fetchkit/legal';
import { useLegalGenerator } from '@/hooks/useLegalGenerator';

const ALL_DOC_TYPES = Object.keys(LEGAL_DOC_TYPES) as LegalDocType[];

const APP_TYPE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'saas', label: 'SaaS' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'marketplace', label: 'Marketplace' },
] as const;

export default function LegalPage() {
  const { bundle, isGenerating, generate, downloadAll, downloadSingle } = useLegalGenerator();

  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [jurisdiction, setJurisdiction] = useState('United States');
  const [appType, setAppType] = useState<LegalInput['appType']>('website');
  const [includeGdpr, setIncludeGdpr] = useState(false);
  const [includeCcpa, setIncludeCcpa] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<LegalDocType>>(new Set(ALL_DOC_TYPES));
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const canGenerate = companyName.trim() && websiteUrl.trim() && contactEmail.trim() && selectedTypes.size > 0;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    generate(Array.from(selectedTypes), {
      companyName: companyName.trim(),
      websiteUrl: websiteUrl.trim(),
      contactEmail: contactEmail.trim(),
      jurisdiction,
      appType,
      includeGdpr,
      includeCcpa,
    });
  }, [canGenerate, generate, selectedTypes, companyName, websiteUrl, contactEmail, jurisdiction, appType, includeGdpr, includeCcpa]);

  const toggleType = useCallback((type: LegalDocType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const selectAllTypes = useCallback(() => {
    setSelectedTypes(new Set(ALL_DOC_TYPES));
  }, []);

  const copyMarkdown = useCallback(async (type: string, markdown: string) => {
    await navigator.clipboard.writeText(markdown);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }, []);

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Legal Documents</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate production-ready legal documents for your project. Enter your details, pick the documents you need, and get instant Markdown output.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        {/* Sidebar — Input Form */}
        <div className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Project Details</h2>
            <div>
              <label className="text-sm font-medium mb-1 block">Company Name *</label>
              <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Website URL *</label>
              <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://acme.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Contact Email *</label>
              <Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="legal@acme.com" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Jurisdiction</label>
              <Input value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} placeholder="United States" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">App Type</label>
              <div className="flex flex-wrap gap-2">
                {APP_TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAppType(opt.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                      appType === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Options</h2>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={includeGdpr} onChange={e => setIncludeGdpr(e.target.checked)} className="rounded" />
              Include GDPR section (EU users)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={includeCcpa} onChange={e => setIncludeCcpa(e.target.checked)} className="rounded" />
              Include CCPA section (California)
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Documents</h2>
              <button onClick={selectAllTypes} className="text-xs text-primary hover:underline">Select All</button>
            </div>
            {ALL_DOC_TYPES.map(type => (
              <label key={type} className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="rounded mt-0.5"
                />
                <div>
                  <div className="font-medium">{LEGAL_DOC_TYPES[type].title}</div>
                  <div className="text-xs text-muted-foreground">{LEGAL_DOC_TYPES[type].description}</div>
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
              'Generate Documents'
            )}
          </Button>
        </div>

        {/* Main — Results */}
        <div>
          {!bundle && !isGenerating && (
            <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground">
              <Scale className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Fill in your project details and click Generate to create your legal documents.</p>
            </div>
          )}

          {bundle && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Generated {bundle.documents.length} document{bundle.documents.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" size="sm" onClick={downloadAll}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download All (.zip)
                </Button>
              </div>

              <Tabs defaultValue={bundle.documents[0]?.type}>
                <TabsList className="flex-wrap">
                  {bundle.documents.map(doc => (
                    <TabsTrigger key={doc.type} value={doc.type} className="text-xs">
                      {doc.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {bundle.documents.map(doc => (
                  <TabsContent key={doc.type} value={doc.type}>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                        <span className="text-xs text-muted-foreground">
                          {doc.metadata.wordCount.toLocaleString()} words
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => copyMarkdown(doc.type, doc.markdown)}
                          >
                            {copiedType === doc.type ? (
                              <><Check className="h-3 w-3 mr-1" />Copied</>
                            ) : (
                              <><Copy className="h-3 w-3 mr-1" />Copy Markdown</>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => downloadSingle(doc.type)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            .md
                          </Button>
                        </div>
                      </div>
                      <div
                        className="p-6 prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-150"
                        dangerouslySetInnerHTML={{ __html: doc.html }}
                      />
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
