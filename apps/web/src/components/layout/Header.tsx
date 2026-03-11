import { Link, useLocation } from 'react-router-dom';
import { Bot, Moon, Sun } from 'lucide-react';
import { useSiteColor } from '@/hooks/useSiteColor';
import { useTheme } from '@/hooks/useTheme';

const NAV_ITEMS = [
  { label: 'Brand', to: '/create' },
  { label: 'Palette', to: '/palette' },
  { label: 'Placeholders', to: '/placeholders' },
  { label: 'Legal', to: '/legal' },
  { label: 'SEO', to: '/seo' },
  { label: 'Security', to: '/security' },
];

export function Header() {
  const location = useLocation();
  const { color, secondaryColor, setColor, setSecondaryColor } = useSiteColor();
  const { theme, toggleTheme } = useTheme();

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
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Brand Colors</span>
            <label className="relative cursor-pointer group" title="Primary brand color">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="sr-only"
              />
              <div
                className="h-4 w-4 rounded-full border border-border ring-offset-background transition-shadow group-hover:ring-2 group-hover:ring-ring group-hover:ring-offset-1"
                style={{ backgroundColor: color }}
              />
            </label>
            <label className="relative cursor-pointer group" title="Secondary brand color">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="sr-only"
              />
              <div
                className="h-4 w-4 rounded-full border border-border ring-offset-background transition-shadow group-hover:ring-2 group-hover:ring-ring group-hover:ring-offset-1"
                style={{ backgroundColor: secondaryColor }}
              />
            </label>
          </div>
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
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
