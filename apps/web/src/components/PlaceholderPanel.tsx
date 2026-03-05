import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import type { PlaceholderBundle, PlaceholderCategory, PlaceholderImage } from '@fetchkit/brand';

interface PlaceholderPanelProps {
  bundle: PlaceholderBundle | null;
  isGenerating: boolean;
  selectedCategories: PlaceholderCategory[];
  onSelectedCategoriesChange: (cats: PlaceholderCategory[]) => void;
  onGenerate: (colors: string[]) => void;
  onDownloadAll: () => Promise<void>;
  onDownloadSingle: (image: PlaceholderImage) => void;
}

const BASIC_CATEGORIES: { value: PlaceholderCategory; label: string }[] = [
  { value: 'hero', label: 'Hero' },
  { value: 'avatar', label: 'Avatar' },
  { value: 'product', label: 'Product' },
  { value: 'chart', label: 'Chart' },
  { value: 'team', label: 'Team' },
  { value: 'background', label: 'Background' },
  { value: 'pattern', label: 'Pattern' },
  { value: 'icon-grid', label: 'Icon Grid' },
];

const SCREENSHOT_CATEGORIES: { value: PlaceholderCategory; label: string }[] = [
  { value: 'screenshot-dashboard', label: 'Dashboard' },
  { value: 'screenshot-table', label: 'Table View' },
  { value: 'screenshot-chat', label: 'Chat' },
  { value: 'screenshot-editor', label: 'Editor' },
  { value: 'screenshot-settings', label: 'Settings' },
  { value: 'screenshot-landing', label: 'Landing' },
];


export function PlaceholderPanel({
  bundle,
  isGenerating,
  selectedCategories,
  onSelectedCategoriesChange,
  onGenerate,
  onDownloadAll,
  onDownloadSingle,
}: PlaceholderPanelProps) {
  const [colorInput, setColorInput] = useState('#6366f1');

  function toggleCategory(cat: PlaceholderCategory) {
    if (selectedCategories.includes(cat)) {
      onSelectedCategoriesChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onSelectedCategoriesChange([...selectedCategories, cat]);
    }
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Brand Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="h-9 w-12 rounded border cursor-pointer"
            />
            <Input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              className="w-28 font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Categories</label>
          <div className="flex flex-wrap gap-1">
            {BASIC_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
                  selectedCategories.includes(cat.value)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <label className="text-sm font-medium pt-1">Screenshots</label>
          <div className="flex flex-wrap gap-1">
            {SCREENSHOT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
                  selectedCategories.includes(cat.value)
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onGenerate([colorInput])}
          disabled={isGenerating || selectedCategories.length === 0}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      {/* Results */}
      {bundle && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {bundle.images.length} placeholder{bundle.images.length !== 1 ? 's' : ''} generated
            </p>
            <Button variant="outline" onClick={onDownloadAll}>
              Download All as ZIP
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundle.images.map((image) => (
              <PlaceholderCard
                key={image.id}
                image={image}
                onDownload={onDownloadSingle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
