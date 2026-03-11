import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Palette, Scale, Search, Shield, Zap, Code, UserX,
  Github, Layers, Package, ChevronRight, Terminal,
  Settings, Copy,
} from 'lucide-react';
import { useSiteColor } from '@/hooks/useSiteColor';
import { getAnalyticsStats } from '@/hooks/useAnalytics';

const SERVICE_ACCENT: Record<string, string> = {
  brand: '#6366f1',
  legal: '#f59e0b',
  seo: '#10b981',
  security: '#ef4444',
};

const SERVICES = [
  {
    icon: Palette,
    title: 'Brand Kit',
    accent: SERVICE_ACCENT.brand,
    description: 'Logos, favicons, social cards, and design tokens. Enter a name, get a complete brand identity.',
    to: '/create',
  },
  {
    icon: Scale,
    title: 'Legal Docs',
    accent: SERVICE_ACCENT.legal,
    description: 'Privacy policies, terms of service, and cookie consent banners tailored to your stack.',
    to: '/legal',
  },
  {
    icon: Search,
    title: 'SEO Config',
    accent: SERVICE_ACCENT.seo,
    description: 'Meta tags, sitemaps, robots.txt, and Schema.org structured data — ready to paste.',
    to: '/seo',
  },
  {
    icon: Shield,
    title: 'Security',
    accent: SERVICE_ACCENT.security,
    description: 'CSP headers, CORS configs, and auth scaffolds. Security best practices from the start.',
    to: '/security',
  },
];

const STEPS = [
  { icon: Layers, title: 'Choose a service', desc: 'Brand, legal, SEO, or security — pick what your project needs.' },
  { icon: Settings, title: 'Configure', desc: 'Set your company name, URL, and preferences. Or use the defaults.' },
  { icon: Copy, title: 'Copy & ship', desc: 'Download files, copy code, or call the API from your agent.' },
];

const FEATURES = [
  { icon: Zap, title: 'Agent-Callable API', desc: 'REST endpoints and MCP server so AI agents can request assets programmatically.' },
  { icon: Code, title: 'Developer-Friendly', desc: 'Outputs designed for copy-paste: SVGs, CSS variables, Tailwind configs, JSON tokens.' },
  { icon: UserX, title: 'No Account Required', desc: 'Everything runs client-side. No sign-up, no tracking, no paywalls.' },
  { icon: Github, title: 'Open Source', desc: 'MIT licensed. Self-host it, fork it, contribute to it.' },
  { icon: Layers, title: 'Multi-Service', desc: 'Brand, legal, SEO, and security under one roof. One toolkit for every new project.' },
  { icon: Package, title: 'Composable Packages', desc: 'Each service is a standalone npm package. Use what you need, skip what you don\'t.' },
];

export default function HomePage() {
  const { color, secondaryColor } = useSiteColor();
  const [stats, setStats] = useState<{ total: number; byService: Record<string, number> } | null>(null);

  useEffect(() => {
    const s = getAnalyticsStats();
    if (s.totalEvents > 0) setStats({ total: s.totalEvents, byService: s.byService });
  }, []);

  return (
    <div className="flex-1">
      {/* Hero */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${color}26, transparent)` }}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight leading-[1.1]">
                Scaffolding as a{' '}
                <span style={{ color }}>Service</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Instant production-ready assets for developers and AI agents —
                brand kits, legal docs, SEO configs, and security hardening.
                Free, open source, no sign-up required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/create">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/docs">Read the Docs</Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <a
                    href="https://github.com/fetchkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>

            {/* Terminal snippet */}
            <div className="hidden lg:block">
              <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/50">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-2 text-[11px] text-muted-foreground font-mono">terminal</span>
                </div>
                <div className="p-4 font-mono text-[13px] leading-relaxed space-y-3">
                  <div>
                    <span className="text-muted-foreground">$</span>{' '}
                    <span className="text-foreground">npx @fetchkit/cli init</span>
                  </div>
                  <div className="text-muted-foreground/70 text-xs space-y-0.5">
                    <p>✓ Generated 30 logo variations</p>
                    <p>✓ Created favicon bundle (SVG + ICO + PNG)</p>
                    <p>✓ Generated privacy policy & terms of service</p>
                    <p>✓ Created sitemap.xml + robots.txt</p>
                    <p>✓ Generated CSP + CORS configs</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">$</span>{' '}
                    <span className="text-foreground">ls fetchkit-output/</span>
                  </div>
                  <div className="text-muted-foreground/70 text-xs">
                    <p>brand/ legal/ seo/ security/</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                to={s.to}
                className="group border rounded-xl p-6 bg-card/50 transition-all hover:shadow-md hover:border-border/80 block"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="rounded-lg p-2.5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${s.accent}1a`, color: s.accent }}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-1">
                      {s.title}
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0" />
                    </h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: `${color}1a`, color }}
                  >
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Built for Agents & Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="border rounded-xl p-5 bg-card/50 transition-colors hover:shadow-sm hover:border-border/80"
              >
                <f.icon
                  className="h-5 w-5 mb-3"
                  style={{ color: i % 2 === 0 ? color : secondaryColor }}
                />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      {stats && stats.total > 0 && (
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Your Activity</h2>
              <Link
                to="/stats"
                className="text-sm font-medium transition-colors hover:text-foreground"
                style={{ color }}
              >
                View all stats &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-xl p-4 bg-background/50">
                <p className="text-2xl font-bold" style={{ color }}>{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total Events</p>
              </div>
              {Object.entries(stats.byService)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([service, count]) => (
                  <div key={service} className="border rounded-xl p-4 bg-background/50">
                    <p className="text-2xl font-bold" style={{ color: SERVICE_ACCENT[service] || secondaryColor }}>
                      {count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{service}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-20 px-6"
        style={{ background: `radial-gradient(ellipse 60% 80% at 50% 50%, ${color}1a, ${secondaryColor}0d, transparent)` }}
      >
        <div className="container mx-auto text-center max-w-2xl space-y-5">
          <Terminal className="h-8 w-8 mx-auto" style={{ color }} />
          <h2 className="text-3xl font-bold">Ready to scaffold your project?</h2>
          <p className="text-muted-foreground">
            Use the web app, call the API, or wire up an MCP server.
            Every service is free, instant, and open source.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/create">Create Brand Kit</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/docs">Explore the API</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">npx @fetchkit/cli init</code>
            {' '}— or install individual packages via npm
          </p>
        </div>
      </section>
    </div>
  );
}
