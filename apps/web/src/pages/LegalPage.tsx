import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="flex-1">
      <section className="py-24 px-6">
        <div className="container mx-auto text-center max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            Coming Soon
          </div>
          <div className="flex justify-center">
            <Scale className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Legal Documents</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Generate privacy policies, terms of service, and cookie consent banners
            tailored to your project. Enter your app name and get production-ready
            legal boilerplate — free, no lawyer required.
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
