import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Moon, Sun, Menu, X } from 'lucide-react';
import { useSiteColor } from '@/hooks/useSiteColor';
import { useTheme } from '@/hooks/useTheme';

const NAV_ITEMS = [
  { label: 'Brand', to: '/create' },
  { label: 'Palette', to: '/palette' },
  { label: 'Placeholders', to: '/placeholders' },
  { label: 'Legal', to: '/legal' },
  { label: 'SEO', to: '/seo' },
  { label: 'Security', to: '/security' },
  { label: 'Stats', to: '/stats' },
  { label: 'Docs', to: '/docs' },
];

export function Header() {
  const location = useLocation();
  const { color, secondaryColor, setColor, setSecondaryColor } = useSiteColor();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <Bot className="h-5 w-5" style={{ color }} />
          <span>FetchKit</span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-8 hidden md:flex items-center gap-1">
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
            <label className="relative cursor-pointer group" title="Primary brand color">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="sr-only"
              />
              <div
                className="h-5 w-5 rounded-full border-2 border-border ring-offset-background transition-all group-hover:ring-2 group-hover:ring-ring group-hover:ring-offset-1 group-hover:scale-110"
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
                className="h-5 w-5 rounded-full border-2 border-border ring-offset-background transition-all group-hover:ring-2 group-hover:ring-ring group-hover:ring-offset-1 group-hover:scale-110"
                style={{ backgroundColor: secondaryColor }}
              />
            </label>
          </div>

          <div className="w-px h-4 bg-border" />

          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background px-6 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                location.pathname.startsWith(item.to)
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
