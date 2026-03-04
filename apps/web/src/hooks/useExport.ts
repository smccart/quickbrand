import { useState, useCallback } from 'react';
import type { LogoConfig, LayoutDirection, ColorMode } from '@agentkit/brand';
import { downloadSvg, downloadAllSvgs } from '@/lib/browser';

interface UseExportReturn {
  isExporting: boolean;
  exportSingle: (config: LogoConfig, layout: LayoutDirection, mode: ColorMode) => Promise<void>;
  exportAll: (config: LogoConfig) => Promise<void>;
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);

  const exportSingle = useCallback(
    async (config: LogoConfig, layout: LayoutDirection, mode: ColorMode) => {
      setIsExporting(true);
      try {
        await downloadSvg(config, layout, mode);
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  const exportAll = useCallback(async (config: LogoConfig) => {
    setIsExporting(true);
    try {
      await downloadAllSvgs(config);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { isExporting, exportSingle, exportAll };
}
