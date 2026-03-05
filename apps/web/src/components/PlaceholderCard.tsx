import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { PlaceholderImage } from '@fetchkit/brand';

interface PlaceholderCardProps {
  image: PlaceholderImage;
  onDownload: (image: PlaceholderImage) => void;
}

export function PlaceholderCard({ image, onDownload }: PlaceholderCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyDataUri = useCallback(async () => {
    await navigator.clipboard.writeText(image.dataUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [image.dataUri]);

  return (
    <div className="border rounded-xl overflow-hidden">
      <div
        className="w-full bg-muted/30 max-h-48 overflow-hidden [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
        dangerouslySetInnerHTML={{ __html: image.svg }}
      />
      <div className="p-3 space-y-2">
        <div>
          <p className="text-sm font-medium">{image.metadata.label}</p>
          <p className="text-xs text-muted-foreground">{image.metadata.usage}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onDownload(image)}>
            SVG
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyDataUri}>
            {copied ? 'Copied!' : 'Data URI'}
          </Button>
        </div>
      </div>
    </div>
  );
}
