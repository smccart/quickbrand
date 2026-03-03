import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link to="/" className="flex items-center gap-1 font-bold text-lg">
          <span className="text-primary">Quick</span>
          <span className="text-muted-foreground">Brand</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link
            to="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            to="/create"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Create Logo
          </Link>
        </nav>
      </div>
    </header>
  );
}
