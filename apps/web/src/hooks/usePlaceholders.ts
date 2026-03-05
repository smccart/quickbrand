import { useState, useCallback } from 'react';
import type { PlaceholderBundle, PlaceholderCategory, PlaceholderImage } from '@fetchkit/brand';
import { generatePlaceholderBundle } from '@fetchkit/brand';

const ALL_CATEGORIES: PlaceholderCategory[] = [
  'hero', 'avatar', 'product', 'chart', 'team', 'background', 'pattern', 'icon-grid',
  'screenshot-dashboard', 'screenshot-table', 'screenshot-chat', 'screenshot-editor', 'screenshot-settings', 'screenshot-landing',
];

interface UsePlaceholdersReturn {
  bundle: PlaceholderBundle | null;
  isGenerating: boolean;
  selectedCategories: PlaceholderCategory[];
  setSelectedCategories: (cats: PlaceholderCategory[]) => void;
  generate: (colors: string[]) => void;
  downloadAll: () => Promise<void>;
  downloadSingle: (image: PlaceholderImage) => void;
}

export function usePlaceholders(): UsePlaceholdersReturn {
  const [bundle, setBundle] = useState<PlaceholderBundle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<PlaceholderCategory[]>(ALL_CATEGORIES);

  const generate = useCallback((colors: string[]) => {
    setIsGenerating(true);
    // Generation is synchronous but we use setTimeout to avoid blocking UI
    setTimeout(() => {
      const result = generatePlaceholderBundle(colors, selectedCategories);
      setBundle(result);
      setIsGenerating(false);
    }, 0);
  }, [selectedCategories]);

  const downloadAll = useCallback(async () => {
    if (!bundle) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const image of bundle.images) {
      zip.file(`${image.category}.svg`, image.svg);
    }
    zip.file('manifest.json', JSON.stringify(bundle.manifest, null, 2));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placeholders.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  const downloadSingle = useCallback((image: PlaceholderImage) => {
    const blob = new Blob([image.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.category}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    bundle,
    isGenerating,
    selectedCategories,
    setSelectedCategories,
    generate,
    downloadAll,
    downloadSingle,
  };
}
