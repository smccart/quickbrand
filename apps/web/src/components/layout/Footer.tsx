import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useSiteColor } from '@/hooks/useSiteColor';

const PRODUCT_LINKS = [
  { label: 'Brand Kit', to: '/create' },
  { label: 'Legal Docs', to: '/legal' },
  { label: 'SEO Config', to: '/seo' },
  { label: 'Security', to: '/security' },
  { label: 'Palette', to: '/palette' },
  { label: 'Placeholders', to: '/placeholders' },
];

const RESOURCE_LINKS: { label: string; to?: string; href?: string }[] = [
  { label: 'Documentation', to: '/docs' },
  { label: 'API Reference', href: '/api/openapi.json' },
  { label: 'MCP Server', href: 'https://www.npmjs.com/package/@fetchkit/mcp' },
  { label: 'CLI', href: 'https://www.npmjs.com/package/@fetchkit/cli' },
];

const COMMUNITY_LINKS = [
  { label: 'GitHub', href: 'https://github.com/fetchkit' },
  { label: 'npm', href: 'https://www.npmjs.com/org/fetchkit' },
];

export function Footer() {
  const { color } = useSiteColor();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <Bot className="h-5 w-5" style={{ color }} />
              <span>FetchKit</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free scaffolding for developers & AI agents. Open source, no sign-up.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) =>
                link.to ? (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Community</h4>
            <ul className="space-y-2">
              {COMMUNITY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FetchKit. MIT License.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for developers & AI agents.
          </p>
        </div>
      </div>
    </footer>
  );
}
