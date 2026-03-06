import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoGrid } from '@/components/LogoGrid';
import { LogoCanvas } from '@/components/LogoCanvas';
import { IconPicker } from '@/components/IconPicker';
import { FontPicker } from '@/components/FontPicker';
import { ColorEditor } from '@/components/ColorEditor';
import { useInfiniteLogos } from '@/hooks/useInfiniteLogos';
import { useSiteColor } from '@/hooks/useSiteColor';
import type { FontConfig, IconConfig, ColorPalette } from '@fetchkit/brand';

const DEFAULT_NAME = 'FetchKit';

export default function RefinePage() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(DEFAULT_NAME);
  const { color: accentColor, secondaryColor } = useSiteColor();
  const debouncedRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const initialRef = useRef(true);

  const {
    variations,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    generateInitial,
    loadMore,
    selected,
    select,
    updateFont,
    updateIcon,
    updateColors,
  } = useInfiniteLogos(companyName, accentColor, secondaryColor);

  // Generate on mount immediately, then debounce subsequent changes
  useEffect(() => {
    if (!companyName.trim()) return;

    if (initialRef.current) {
      initialRef.current = false;
      generateInitial();
      return;
    }

    clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(() => {
      generateInitial();
    }, 500);

    return () => clearTimeout(debouncedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, accentColor, secondaryColor]);

  const handleExport = () => {
    if (selected) {
      navigate('/create/export', { state: { config: selected.config } });
    }
  };

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create Your Logo</h1>
          <p className="text-sm text-muted-foreground">
            {isInitialLoading
              ? 'Searching for icons and generating logos...'
              : 'Click a logo to select it, then customize it below. Scroll for more variations.'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-8">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Company Name</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name..."
            className="w-64"
          />
        </div>
      </div>

      {/* Logo Grid with Infinite Scroll */}
      <LogoGrid
        variations={variations}
        selectedId={selected?.id ?? null}
        onSelect={select}
        onLoadMore={loadMore}
        isLoadingMore={isInitialLoading || isLoadingMore}
        hasMore={hasMore}
      />

      {/* Refinement Panel */}
      {selected && (
        <div className="mt-8 border-t pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Preview */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { layout: 'horizontal', label: 'Horizontal' },
                  { layout: 'vertical', label: 'Stacked' },
                  { layout: 'icon-right', label: 'Icon Right' },
                  { layout: 'overlap', label: 'Watermark' },
                ] as const).map(({ layout, label }) => (
                  <div key={layout} className="border rounded-xl p-6 bg-white flex flex-col items-center gap-3">
                    <div className="flex-1 flex items-center justify-center min-h-24">
                      <LogoCanvas config={selected.config} layout={layout} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleExport}>
                  Export This Logo
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6 border rounded-xl p-4">
              <IconPicker
                currentIcon={selected.config.icon}
                onSelect={(icon: IconConfig) => updateIcon(icon)}
              />
              <FontPicker
                currentFont={selected.config.font}
                onSelect={(font: FontConfig) => updateFont(font)}
              />
              <ColorEditor
                companyName={selected.config.companyName}
                currentColors={selected.config.colors}
                onChange={(colors: ColorPalette) => updateColors(colors)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
