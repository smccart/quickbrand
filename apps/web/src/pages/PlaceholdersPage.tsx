import { PlaceholderPanel } from '@/components/PlaceholderPanel';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import { useSiteColor } from '@/hooks/useSiteColor';

export default function PlaceholdersPage() {
  const { color, secondaryColor } = useSiteColor();
  const placeholders = usePlaceholders(color, secondaryColor);

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Placeholder Images</h1>
        <p className="text-sm text-muted-foreground">
          Generate themed SVG placeholders for heroes, avatars, products, charts, and more.
        </p>
      </div>

      <PlaceholderPanel
        bundle={placeholders.bundle}
        isGenerating={placeholders.isGenerating}
        onDownloadAll={placeholders.downloadAll}
        onDownloadSingle={placeholders.downloadSingle}
      />
    </div>
  );
}
