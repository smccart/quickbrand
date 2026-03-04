import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogoGrid } from '@/components/LogoGrid';
import { LogoCanvas } from '@/components/LogoCanvas';
import { IconPicker } from '@/components/IconPicker';
import { FontPicker } from '@/components/FontPicker';
import { ColorEditor } from '@/components/ColorEditor';
import type { LogoVariation, LogoConfig, FontConfig, IconConfig, ColorPalette } from '@agentkit/brand';

export default function RefinePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [variations, setVariations] = useState<LogoVariation[]>([]);
  const [selected, setSelected] = useState<LogoVariation | null>(null);

  useEffect(() => {
    const state = location.state as { variations?: LogoVariation[] } | null;
    if (state?.variations) {
      setVariations(state.variations);
    } else {
      navigate('/create');
    }
  }, [location.state, navigate]);

  const handleSelect = useCallback(
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

  const handleExport = () => {
    if (selected) {
      navigate('/create/export', { state: { config: selected.config } });
    }
  };

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Choose Your Logo</h1>
          <p className="text-sm text-muted-foreground">
            Click a logo to select it, then customize it below.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/create')}>
          Start Over
        </Button>
      </div>

      {/* Logo Grid */}
      <LogoGrid
        variations={variations}
        selectedId={selected?.id ?? null}
        onSelect={handleSelect}
      />

      {/* Refinement Panel */}
      {selected && (
        <div className="mt-8 border-t pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Preview */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-8 bg-white flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="horizontal" />
                </div>
                <div className="border rounded-xl p-8 bg-white flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="vertical" />
                </div>
                <div className="border rounded-xl p-8 bg-gray-900 flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="horizontal" />
                </div>
                <div className="border rounded-xl p-8 bg-gray-900 flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="vertical" />
                </div>
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
                onSelect={(icon: IconConfig) => updateConfig({ icon })}
              />
              <FontPicker
                currentFont={selected.config.font}
                onSelect={(font: FontConfig) => updateConfig({ font })}
              />
              <ColorEditor
                companyName={selected.config.companyName}
                currentColors={selected.config.colors}
                onChange={(colors: ColorPalette) => updateConfig({ colors })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
