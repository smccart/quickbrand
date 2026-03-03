import { useState, useEffect, useCallback } from 'react';
import type { LogoConfig, SocialCardBundle } from '@/lib/types';
import { generateSocialCards, downloadSocialCardZip } from '@/lib/social-card';

interface UseSocialCardsReturn {
  isGenerating: boolean;
  cards: SocialCardBundle | null;
  downloadAll: () => Promise<void>;
  downloadSingle: (variant: 'light' | 'dark') => void;
}

export function useSocialCards(config: LogoConfig | null): UseSocialCardsReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState<SocialCardBundle | null>(null);

  useEffect(() => {
    if (!config) return;

    let cancelled = false;
    setIsGenerating(true);
    setCards(null);

    generateSocialCards(config)
      .then((result) => {
        if (!cancelled) setCards(result);
      })
      .catch((err) => {
        if (!cancelled) console.error('Social card generation failed:', err);
      })
      .finally(() => {
        if (!cancelled) setIsGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [config?.icon.id, config?.colors.iconColor, config?.companyName, config?.font.family]);

  const downloadAll = useCallback(async () => {
    if (!cards || !config) return;
    await downloadSocialCardZip(cards, config.companyName);
  }, [cards, config]);

  const downloadSingle = useCallback(
    (variant: 'light' | 'dark') => {
      if (!cards) return;
      const blob = variant === 'light' ? cards.light : cards.dark;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = variant === 'light' ? 'og-image.png' : 'og-image-dark.png';
      a.click();
      URL.revokeObjectURL(url);
    },
    [cards],
  );

  return { isGenerating, cards, downloadAll, downloadSingle };
}
