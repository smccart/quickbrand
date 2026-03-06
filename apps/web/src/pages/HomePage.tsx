import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Palette, Scale, Search, Shield, Zap, Code, UserX, Github, Layers, Package } from 'lucide-react';

const SERVICES = [
  {
    icon: Palette,
    title: 'Brand Kit',
    description: 'Logos, favicons, social cards, and design tokens. Enter a name, get a complete brand identity.',
    to: '/create',
    live: true,
  },
  {
    icon: Scale,
    title: 'Legal Docs',
    description: 'Privacy policies, terms of service, and cookie consent banners tailored to your stack.',
    to: '/legal',
    live: true,
  },
  {
    icon: Search,
    title: 'SEO Config',
    description: 'Meta tags, sitemaps, robots.txt, and Schema.org structured data — ready to paste.',
    to: '/seo',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'CSP headers, CORS configs, and auth scaffolds. Security best practices from the start.',
    to: '/security',
  },
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
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="py-24 px-6 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.70_0.19_38/0.15),transparent)]">
        <div className="container mx-auto text-center max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Scaffolding as a Service
          </h1>
          <p className="text-xl text-muted-foreground">
            FetchKit gives developers and AI agents instant access to production-ready
            assets — brand kits, legal docs, SEO configs, and more. Free, open source,
            no sign-up required.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/create">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/docs">Read the Docs</Link>
            </Button>
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
                className="border rounded-xl p-6 bg-card/50 hover:border-primary/30 transition-colors group block"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{s.title}</h3>
                      {s.live ? (
                        <span className="text-[10px] uppercase tracking-wider font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Built for Agents & Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="border rounded-xl p-5 bg-card/50 hover:border-primary/30 transition-colors">
                <f.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,oklch(0.70_0.19_38/0.1),transparent)]">
        <div className="container mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to scaffold your project?</h2>
          <p className="text-muted-foreground">
            Start with a brand kit. More services coming soon.
          </p>
          <Button asChild size="lg">
            <Link to="/create">Create Brand Kit</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
