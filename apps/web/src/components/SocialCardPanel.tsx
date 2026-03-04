import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { SocialCardBundle } from '@agentkit/brand';

interface SocialCardPanelProps {
  cards: SocialCardBundle | null;
  isGenerating: boolean;
  onDownloadAll: () => Promise<void>;
  onDownloadSingle: (variant: 'light' | 'dark') => void;
}

export function SocialCardPanel({
  cards,
  isGenerating,
  onDownloadAll,
  onDownloadSingle,
}: SocialCardPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const previewUrls = useMemo(() => {
    if (!cards) return null;
    return {
      light: URL.createObjectURL(cards.light),
      dark: URL.createObjectURL(cards.dark),
    };
  }, [cards]);

  useEffect(() => {
    return () => {
      if (previewUrls) {
        URL.revokeObjectURL(previewUrls.light);
        URL.revokeObjectURL(previewUrls.dark);
      }
    };
  }, [previewUrls]);

  const handleCopy = async () => {
    if (!cards) return;
    await navigator.clipboard.writeText(cards.metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      await onDownloadAll();
    } finally {
      setIsDownloading(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Generating social cards...</p>
      </div>
    );
  }

  if (!cards || !previewUrls) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">No social cards available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Light</h3>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={previewUrls.light}
              alt="OG image (light)"
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadSingle('light')}
          >
            Download og-image.png
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Dark</h3>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={previewUrls.dark}
              alt="OG image (dark)"
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadSingle('dark')}
          >
            Download og-image-dark.png
          </Button>
        </div>
      </div>

      <Separator />

      {/* Meta tags */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">HTML Meta Tags</h3>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <pre className="border rounded-lg p-4 text-xs overflow-x-auto bg-muted/50">
          {cards.metaTags}
        </pre>
      </div>

      {/* Download all */}
      <div className="flex justify-center">
        <Button size="lg" disabled={isDownloading} onClick={handleDownloadAll}>
          {isDownloading ? 'Exporting...' : 'Download All as ZIP'}
        </Button>
      </div>
    </div>
  );
}
