import { useState, useCallback, useRef } from 'react';
import type { LogoVariation, LogoConfig, FontConfig, IconConfig, ColorPalette } from '@fetchkit/brand';
import { generateLogosBatch, getIconsForCompany, CURATED_FONTS } from '@fetchkit/brand';
import { loadAllFonts } from '@/lib/browser';

const BATCH_SIZE = 12;

export function useInfiniteLogos(companyName: string, accentColor?: string, secondaryColor?: string) {
  const [variations, setVariations] = useState<LogoVariation[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState<LogoVariation | null>(null);

  const iconsRef = useRef<IconConfig[]>([]);
  const batchIndexRef = useRef(0);
  const accentRef = useRef(accentColor);
  accentRef.current = accentColor;
  const secondaryRef = useRef(secondaryColor);
  secondaryRef.current = secondaryColor;

  const generateInitial = useCallback(async () => {
    if (!companyName.trim()) return;
    setIsInitialLoading(true);
    setSelected(null);
    setVariations([]);
    batchIndexRef.current = 0;

    loadAllFonts(CURATED_FONTS);

    try {
      const icons = await getIconsForCompany(companyName.trim());
      iconsRef.current = icons;

      if (icons.length === 0) {
        setHasMore(false);
        return;
      }

      const batch = generateLogosBatch(companyName.trim(), 0, BATCH_SIZE, icons, accentRef.current, secondaryRef.current);
      setVariations(batch);
      batchIndexRef.current = 1;
      setHasMore(batch.length === BATCH_SIZE);
    } finally {
      setIsInitialLoading(false);
    }
  }, [companyName]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || iconsRef.current.length === 0) return;
    setIsLoadingMore(true);

    // Use requestAnimationFrame to keep UI responsive
    requestAnimationFrame(() => {
      const batch = generateLogosBatch(
        companyName.trim(),
        batchIndexRef.current,
        BATCH_SIZE,
        iconsRef.current,
        accentRef.current,
        secondaryRef.current,
      );

      if (batch.length === 0) {
        setHasMore(false);
      } else {
        setVariations((prev) => [...prev, ...batch]);
        batchIndexRef.current += 1;
      }
      setIsLoadingMore(false);
    });
  }, [companyName, isLoadingMore, hasMore]);

  const select = useCallback(
    (id: string) => {
      const found = variations.find((v) => v.id === id);
      if (found) setSelected({ ...found, config: { ...found.config } });
    },
    [variations],
  );

  const updateConfig = useCallback((updates: Partial<LogoConfig>) => {
    setSelected((prev) => {
      if (!prev) return prev;
      return { ...prev, config: { ...prev.config, ...updates } };
    });
  }, []);

  const updateFont = useCallback(
    (font: FontConfig) => updateConfig({ font }),
    [updateConfig],
  );

  const updateIcon = useCallback(
    (icon: IconConfig) => updateConfig({ icon }),
    [updateConfig],
  );

  const updateColors = useCallback(
    (colors: ColorPalette) => updateConfig({ colors }),
    [updateConfig],
  );

  return {
    variations,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    generateInitial,
    loadMore,
    selected,
    select,
    updateConfig,
    updateFont,
    updateIcon,
    updateColors,
  };
}
