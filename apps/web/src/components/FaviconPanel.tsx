import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { FaviconAsset, FaviconBundle } from '@agentkit/brand';

interface FaviconPanelProps {
  bundle: FaviconBundle | null;
  isGenerating: boolean;
  onDownloadAll: () => Promise<void>;
  onDownloadSingle: (asset: FaviconAsset) => void;
}

const PREVIEW_SIZES = [16, 32, 48, 180] as const;

export function FaviconPanel({
  bundle,
  isGenerating,
  onDownloadAll,
  onDownloadSingle,
}: FaviconPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Create object URLs for PNG previews
  const previewUrls = useMemo(() => {
    if (!bundle) return new Map<number, string>();
    const urls = new Map<number, string>();
    for (const asset of bundle.assets) {
      if (asset.size && PREVIEW_SIZES.includes(asset.size as typeof PREVIEW_SIZES[number])) {
        urls.set(asset.size, URL.createObjectURL(asset.blob));
      }
    }
    return urls;
  }, [bundle]);

  // Also create a URL for the SVG preview
  const svgPreviewUrl = useMemo(() => {
    if (!bundle) return null;
    const svgAsset = bundle.assets.find((a) => a.filename === 'favicon.svg');
    return svgAsset ? URL.createObjectURL(svgAsset.blob) : null;
  }, [bundle]);

  // Cleanup object URLs on unmount or when bundle changes
  useEffect(() => {
    return () => {
      for (const url of previewUrls.values()) {
        URL.revokeObjectURL(url);
      }
      if (svgPreviewUrl) URL.revokeObjectURL(svgPreviewUrl);
    };
  }, [previewUrls, svgPreviewUrl]);

  const handleCopy = async () => {
    if (!bundle) return;
    await navigator.clipboard.writeText(bundle.htmlSnippet);
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
        <p className="text-muted-foreground">Generating favicons...</p>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">No favicon bundle available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Preview section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Preview</h3>
        <div className="border rounded-lg p-6">
          <div className="flex items-end gap-6">
            {svgPreviewUrl && (
              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center rounded border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:8px_8px]"
                  style={{ width: 64, height: 64 }}
                >
                  <img src={svgPreviewUrl} alt="SVG favicon" width={64} height={64} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">SVG</p>
              </div>
            )}
            {PREVIEW_SIZES.map((size) => {
              const url = previewUrls.get(size);
              if (!url) return null;
              const displaySize = Math.min(size, 64);
              return (
                <div key={size} className="text-center">
                  <div
                    className="inline-flex items-center justify-center rounded border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:8px_8px]"
                    style={{ width: displaySize, height: displaySize }}
                  >
                    <img src={url} alt={`${size}px`} width={displaySize} height={displaySize} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{size}px</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Separator />

      {/* HTML snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">HTML Tags</h3>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <pre className="border rounded-lg p-4 text-xs overflow-x-auto bg-muted/50">
          {bundle.htmlSnippet}
        </pre>
      </div>

      <Separator />

      {/* Individual downloads */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Individual Files</h3>
        <div className="flex flex-wrap gap-2">
          {bundle.assets.map((asset) => (
            <Button
              key={asset.filename}
              variant="outline"
              size="sm"
              onClick={() => onDownloadSingle(asset)}
            >
              {asset.filename}
            </Button>
          ))}
        </div>
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
