import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Download, Copy, Check, Loader2 } from 'lucide-react';
import { SECURITY_ARTIFACT_TYPES, APP_FRAMEWORKS, AUTH_STRATEGIES } from '@fetchkit/security';
import type { SecurityArtifactType, AppFramework, AuthStrategy, SecurityInput } from '@fetchkit/security';
import { useSecurityGenerator } from '@/hooks/useSecurityGenerator';

const ALL_ARTIFACT_TYPES = Object.keys(SECURITY_ARTIFACT_TYPES) as SecurityArtifactType[];
const ALL_FRAMEWORKS = Object.keys(APP_FRAMEWORKS) as AppFramework[];
const ALL_AUTH_STRATEGIES = Object.keys(AUTH_STRATEGIES) as AuthStrategy[];

const DEFAULTS: Record<string, string> = {
  siteName: 'FetchKit',
  siteUrl: 'https://fetchkit.dev',
};

export default function SecurityPage() {
  const { bundle, isGenerating, generate, downloadAll, downloadSingle } = useSecurityGenerator();

  const initialRef = useRef(true);

  // Project details
  const [siteName, setSiteName] = useState(DEFAULTS.siteName);
  const [siteUrl, setSiteUrl] = useState(DEFAULTS.siteUrl);
  const [framework, setFramework] = useState<AppFramework>('express');
  const [appType, setAppType] = useState<SecurityInput['appType']>('saas');
  const [authStrategy, setAuthStrategy] = useState<AuthStrategy>('jwt');

  // CORS origins
  const [corsOrigins, setCorsOrigins] = useState(DEFAULTS.siteUrl);

  // Artifact selection
  const [selectedArtifacts, setSelectedArtifacts] = useState<Set<SecurityArtifactType>>(new Set(ALL_ARTIFACT_TYPES));

  // Copy state
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const canGenerate = siteName.trim() && siteUrl.trim() && selectedArtifacts.size > 0;

  // Auto-generate on first mount with FetchKit defaults
  useEffect(() => {
    if (!initialRef.current) return;
    initialRef.current = false;
    generate(ALL_ARTIFACT_TYPES, {
      siteName: DEFAULTS.siteName,
      siteUrl: DEFAULTS.siteUrl,
      framework: 'express',
      appType: 'saas',
      authStrategy: 'jwt',
      corsConfig: { origins: [DEFAULTS.siteUrl] },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;

    const input: SecurityInput = {
      siteName: siteName.trim(),
      siteUrl: siteUrl.trim(),
      framework,
      appType,
      authStrategy,
      corsConfig: {
        origins: corsOrigins.split(',').map((s) => s.trim()).filter(Boolean),
      },
    };

    generate(Array.from(selectedArtifacts), input);
  }, [canGenerate, generate, selectedArtifacts, siteName, siteUrl, framework, appType, authStrategy, corsOrigins]);

  const toggleArtifact = useCallback((type: SecurityArtifactType) => {
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

  const copyContent = useCallback(async (type: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }, []);

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Security Config</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate CSP headers, CORS configs, security headers, auth scaffolds, env templates, and rate limiters.
          Production-ready security from day one.
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
          </div>

          {/* Framework & App Type */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configuration</h2>
            <div>
              <label className="text-sm font-medium mb-1 block">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as AppFramework)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {ALL_FRAMEWORKS.map((f) => (
                  <option key={f} value={f}>{APP_FRAMEWORKS[f].title}</option>
                ))}
              </select>
              <span className="text-xs text-muted-foreground">{APP_FRAMEWORKS[framework].description}</span>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">App Type</label>
              <select
                value={appType}
                onChange={(e) => setAppType(e.target.value as SecurityInput['appType'])}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="website">Website</option>
                <option value="saas">SaaS</option>
                <option value="api">API</option>
                <option value="mobile-backend">Mobile Backend</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Auth Strategy</label>
              <select
                value={authStrategy}
                onChange={(e) => setAuthStrategy(e.target.value as AuthStrategy)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {ALL_AUTH_STRATEGIES.map((s) => (
                  <option key={s} value={s}>{AUTH_STRATEGIES[s].title}</option>
                ))}
              </select>
              <span className="text-xs text-muted-foreground">{AUTH_STRATEGIES[authStrategy].description}</span>
            </div>
          </div>

          {/* CORS */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">CORS Origins</h2>
            <div>
              <Input
                value={corsOrigins}
                onChange={(e) => setCorsOrigins(e.target.value)}
                placeholder="https://acme.com, https://app.acme.com"
              />
              <span className="text-xs text-muted-foreground">Comma-separated list of allowed origins</span>
            </div>
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
                  <div className="font-medium">{SECURITY_ARTIFACT_TYPES[type].title}</div>
                  <div className="text-xs text-muted-foreground">{SECURITY_ARTIFACT_TYPES[type].description}</div>
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
              'Generate Security Config'
            )}
          </Button>
        </div>

        {/* Main — Results */}
        <div>
          {!bundle && !isGenerating && (
            <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground">
              <Shield className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Fill in your project details and click Generate to create your security configuration.</p>
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
