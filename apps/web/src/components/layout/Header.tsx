import { Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Brand', to: '/create' },
  { label: 'Legal', to: '/legal', comingSoon: true },
  { label: 'SEO', to: '/seo', comingSoon: true },
  { label: 'Security', to: '/security', comingSoon: true },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Bot className="h-5 w-5 text-primary" />
          <span>FetchKit</span>
        </Link>
        <nav className="ml-8 flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                location.pathname.startsWith(item.to)
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
              {item.comingSoon && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          <Link
            to="/docs"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/docs'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Docs
          </Link>
        </div>
      </div>
    </header>
  );
}
