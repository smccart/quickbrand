import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SeoPage() {
  return (
    <div className="flex-1">
      <section className="py-24 px-6">
        <div className="container mx-auto text-center max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            Coming Soon
          </div>
          <div className="flex justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">SEO Toolkit</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Generate meta tags, sitemaps, robots.txt, and Schema.org structured data
            for your project. Get your site search-engine ready in seconds — no SEO
            expertise needed.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
