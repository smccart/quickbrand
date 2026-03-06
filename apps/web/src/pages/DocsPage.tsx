import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ApiSection from '@/components/docs/ApiSection';
import McpSection from '@/components/docs/McpSection';

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'brand-service', label: 'Brand Service' },
  { id: 'legal-service', label: 'Legal Service' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'api', label: 'REST API' },
  { id: 'mcp', label: 'MCP Server' },
  { id: 'faq', label: 'FAQ' },
];

function Section({
  id,
  title,
  children,
  muted,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section id={id} className={`py-16 px-6 scroll-mt-20 ${muted ? 'bg-card/30' : ''}`}>
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="flex-1">
      {/* Header */}
      <section className="py-12 px-6 border-b">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Learn how FetchKit works and how to use its services.
          </p>
          <nav className="flex flex-wrap gap-2">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium px-3 py-1.5 rounded-md border hover:bg-muted transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Overview */}
      <Section id="overview" title="Overview" muted>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            FetchKit is a free, open-source platform that provides production-ready assets
            and configurations for new projects. It's designed to be used by both developers
            and AI agents — every service is available through a web UI,
            REST API, and MCP server.
          </p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Who it's for</h3>
            <p className="text-muted-foreground">
              <strong>Developers</strong> who want to skip the boilerplate when starting a new
              project. Enter your project name and get a complete brand kit, legal docs, SEO
              config, and security headers — ready to paste into your codebase.
            </p>
            <p className="text-muted-foreground">
              <strong>AI agents</strong> that need to scaffold real projects. FetchKit's API
              lets agents programmatically request assets without scraping websites or
              generating them from scratch.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Brand Kit</strong> — logos, favicons, social cards, design tokens (live now)</li>
              <li><strong>Legal Docs</strong> — privacy policies, terms of service, cookie consent, and more (live now)</li>
              <li><strong>SEO Config</strong> — meta tags, sitemaps, robots.txt, structured data (coming soon)</li>
              <li><strong>Security</strong> — CSP headers, CORS configs, auth scaffolds (coming soon)</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Brand Service */}
      <Section id="brand-service" title="Brand Service">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            The brand service generates a complete visual identity from just a company name.
            It's the first FetchKit service and is fully available now.
          </p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Enter your company name on the <Link to="/create" className="text-primary underline underline-offset-4">Create</Link> page</li>
              <li>FetchKit searches 200,000+ icons from Iconify, picks from 15 curated Google Fonts, and generates color palettes</li>
              <li>30 unique logo variations are created by combining these elements</li>
              <li>Select a logo, customize the icon, font, and per-letter colors</li>
              <li>Export SVGs, favicons, social cards, and design tokens</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">What you get</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium">Asset</th>
                    <th className="text-left px-4 py-2 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Logo SVGs</td>
                    <td className="px-4 py-2">4 variants — horizontal/vertical, light/dark. Text converted to paths.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Favicon bundle</td>
                    <td className="px-4 py-2">SVG, ICO, PNGs (16–512px), apple-touch-icon, manifest.json</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Social cards</td>
                    <td className="px-4 py-2">1200×630 og:image cards with meta tag snippets</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-foreground">Design tokens</td>
                    <td className="px-4 py-2">CSS custom properties, Tailwind config, JSON tokens, font CSS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tips</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Simple, filled icons work best at small sizes — avoid thin lines</li>
              <li>Monochrome palettes suit long names; multicolor works great for short names (3–5 chars)</li>
              <li>Always use SVG logos where possible — they scale perfectly and have smaller file sizes</li>
              <li>The exported SVGs are clean and editable in Figma, Illustrator, or any text editor</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Legal Service */}
      <Section id="legal-service" title="Legal Service" muted>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            The legal service generates production-ready legal documents from project details.
            Enter your company name, website, and contact email — get Markdown and HTML output
            ready to paste into your project.
          </p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Go to the <Link to="/legal" className="text-primary underline underline-offset-4">Legal</Link> page and enter your project details</li>
              <li>Select which documents you need (privacy policy, terms of service, etc.)</li>
              <li>Optionally toggle GDPR/CCPA sections and set your jurisdiction</li>
              <li>Click Generate — documents are created instantly from templates</li>
              <li>Copy Markdown or download all documents as a ZIP</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Document types</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium">Document</th>
                    <th className="text-left px-4 py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Privacy Policy</td>
                    <td className="px-4 py-2">Data collection, usage, sharing, user rights. Optional GDPR & CCPA sections.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Terms of Service</td>
                    <td className="px-4 py-2">Usage rules, liability, IP, termination, and governing law.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Cookie Policy</td>
                    <td className="px-4 py-2">Cookie types, consent mechanism, opt-out instructions.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Disclaimer</td>
                    <td className="px-4 py-2">Liability limitations, accuracy statements, external links.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium text-foreground">Acceptable Use Policy</td>
                    <td className="px-4 py-2">Prohibited conduct, enforcement actions, abuse reporting.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-foreground">DMCA Policy</td>
                    <td className="px-4 py-2">Copyright takedown procedures, counter-notices, designated agent.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Output formats</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Markdown</strong> — raw template output, copy into your repo or CMS</li>
              <li><strong>HTML</strong> — rendered from Markdown, ready to embed in any page</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Architecture */}
      <Section id="architecture" title="Architecture">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            FetchKit is a TypeScript monorepo built with Turborepo and pnpm workspaces.
            Each service is a standalone package that can be used independently.
          </p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Package structure</h3>
            <div className="border rounded-lg bg-muted/30 p-4 font-mono text-sm text-muted-foreground">
              <pre>{`fetchkit/
├── apps/
│   └── web/              → React UI (this site)
├── packages/
│   ├── brand/            → @fetchkit/brand (logo, favicon, tokens)
│   ├── legal/            → @fetchkit/legal (legal document generation)
│   ├── mcp/              → @fetchkit/mcp (MCP server, stdio)
│   ├── tsconfig/         → shared TypeScript config
│   └── eslint-config/    → shared ESLint config
├── api/                  → Vercel serverless functions (REST API)
├── turbo.json
└── pnpm-workspace.yaml`}</pre>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Design principles</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Universal packages</strong> — core logic runs in both Node.js and browsers with zero DOM dependencies</li>
              <li><strong>Client-side first</strong> — the web UI processes everything locally, no data leaves your machine</li>
              <li><strong>Composable</strong> — install <code className="text-xs bg-muted px-1.5 py-0.5 rounded">@fetchkit/brand</code> as an npm package, or use the web UI, or call the API</li>
              <li><strong>Developer-friendly outputs</strong> — every asset is designed for copy-paste integration</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* REST API */}
      <Section id="api" title="REST API">
        <ApiSection />
      </Section>

      {/* MCP Server */}
      <Section id="mcp" title="MCP Server" muted>
        <McpSection />
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ" muted>
        <div className="space-y-6">
          {[
            {
              q: 'Is FetchKit free?',
              a: 'Yes, completely free. No accounts, no paywalls, no limits. The web UI runs entirely in your browser.',
            },
            {
              q: 'Where do the icons come from?',
              a: 'Icons are sourced from Iconify, which aggregates over 200,000 open-source icons from collections like Material Design, Phosphor, Tabler, Lucide, and more.',
            },
            {
              q: 'Can I use the generated assets commercially?',
              a: 'Yes. Fonts are from Google Fonts (open-source). Icons from Iconify use open-source licenses (Apache 2.0, MIT). Check the specific icon collection\'s license if you need to be certain.',
            },
            {
              q: 'Is any data sent to a server?',
              a: 'The web UI runs entirely client-side — the only external requests are to Google Fonts and Iconify. If you use the REST API, requests are processed by Vercel serverless functions but no data is stored.',
            },
            {
              q: 'Can I self-host FetchKit?',
              a: 'Yes. FetchKit is MIT licensed and fully open source. Clone the repo, install dependencies, and deploy wherever you like.',
            },
            {
              q: 'How do I use the API?',
              a: 'The REST API is free and requires no authentication. Send requests to https://fetchkit.dev/api/brand/. See the REST API section above for endpoints and examples, or grab the OpenAPI spec at /api/openapi.json.',
            },
          ].map((item) => (
            <div key={item.q} className="space-y-1">
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-muted-foreground text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="container mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <Button asChild size="lg">
            <Link to="/create">Create a Brand Kit</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
