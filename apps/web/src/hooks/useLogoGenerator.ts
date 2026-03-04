import { useState, useCallback } from 'react';
import type { LogoVariation, LogoConfig, FontConfig, IconConfig, ColorPalette } from '@fetchkit/brand';
import { generateLogos, CURATED_FONTS } from '@fetchkit/brand';
import { loadAllFonts } from '@/lib/browser';

interface UseLogoGeneratorReturn {
  companyName: string;
  setCompanyName: (name: string) => void;
  variations: LogoVariation[];
  isGenerating: boolean;
  generate: () => Promise<void>;
  selectedVariation: LogoVariation | null;
  selectVariation: (id: string) => void;
  updateSelectedConfig: (updates: Partial<LogoConfig>) => void;
  updateFont: (font: FontConfig) => void;
  updateIcon: (icon: IconConfig) => void;
  updateColors: (colors: ColorPalette) => void;
  clearSelection: () => void;
}

export function useLogoGenerator(): UseLogoGeneratorReturn {
  const [companyName, setCompanyName] = useState('');
  const [variations, setVariations] = useState<LogoVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<LogoVariation | null>(null);

  const generate = useCallback(async () => {
    if (!companyName.trim()) return;
    setIsGenerating(true);
    setSelectedVariation(null);
    loadAllFonts(CURATED_FONTS);
    try {
      const results = await generateLogos(companyName.trim());
      setVariations(results);
    } finally {
      setIsGenerating(false);
    }
  }, [companyName]);

  const selectVariation = useCallback(
    (id: string) => {
      const found = variations.find((v) => v.id === id);
      if (found) setSelectedVariation({ ...found });
    },
    [variations],
  );

  const updateSelectedConfig = useCallback((updates: Partial<LogoConfig>) => {
    setSelectedVariation((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: { ...prev.config, ...updates },
      };
    });
  }, []);

  const updateFont = useCallback(
    (font: FontConfig) => updateSelectedConfig({ font }),
    [updateSelectedConfig],
  );

  const updateIcon = useCallback(
    (icon: IconConfig) => updateSelectedConfig({ icon }),
    [updateSelectedConfig],
  );

  const updateColors = useCallback(
    (colors: ColorPalette) => updateSelectedConfig({ colors }),
    [updateSelectedConfig],
  );

  const clearSelection = useCallback(() => setSelectedVariation(null), []);

  return {
    companyName,
    setCompanyName,
    variations,
    isGenerating,
    generate,
    selectedVariation,
    selectVariation,
    updateSelectedConfig,
    updateFont,
    updateIcon,
    updateColors,
    clearSelection,
  };
}
