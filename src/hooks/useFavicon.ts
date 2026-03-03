import { useState, useEffect, useCallback } from 'react';
import type { LogoConfig, FaviconAsset, FaviconBundle } from '@/lib/types';
import { generateFaviconBundle, downloadFaviconZip } from '@/lib/favicon';

interface UseFaviconReturn {
  isGenerating: boolean;
  bundle: FaviconBundle | null;
  downloadAll: () => Promise<void>;
  downloadSingle: (asset: FaviconAsset) => void;
}

export function useFavicon(config: LogoConfig | null): UseFaviconReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bundle, setBundle] = useState<FaviconBundle | null>(null);

  useEffect(() => {
    if (!config) return;

    let cancelled = false;
    setIsGenerating(true);
    setBundle(null);

    generateFaviconBundle(config)
      .then((result) => {
        if (!cancelled) setBundle(result);
      })
      .catch((err) => {
        if (!cancelled) console.error('Favicon generation failed:', err);
      })
      .finally(() => {
        if (!cancelled) setIsGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [config?.icon.id, config?.colors.iconColor, config?.companyName]);

  const downloadAll = useCallback(async () => {
    if (!bundle || !config) return;
    await downloadFaviconZip(bundle, config.companyName);
  }, [bundle, config]);

  const downloadSingle = useCallback((asset: FaviconAsset) => {
    const url = URL.createObjectURL(asset.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = asset.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { isGenerating, bundle, downloadAll, downloadSingle };
}
