import { PALETTE_TEMPLATES, assignLetterColors, assignMonochromeColors } from '@fetchkit/brand';
import type { ColorPalette } from '@fetchkit/brand';

interface ColorEditorProps {
  companyName: string;
  currentColors: ColorPalette;
  onChange: (colors: ColorPalette) => void;
}

export function ColorEditor({ companyName, currentColors, onChange }: ColorEditorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Colors</h3>

      {/* Current color preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Icon:</span>
          <input
            type="color"
            value={currentColors.iconColor}
            onChange={(e) =>
              onChange({ ...currentColors, iconColor: e.target.value })
            }
            className="w-6 h-6 rounded cursor-pointer border-0"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Letters:</span>
          {Array.from(companyName).map((char, i) => {
            if (char === ' ') return <span key={i} className="w-2" />;
            const color = currentColors.letterColors[i] ?? currentColors.letterColors[0];
            return (
              <div key={i} className="flex flex-col items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...currentColors.letterColors];
                    newColors[i] = e.target.value;
                    onChange({ ...currentColors, letterColors: newColors });
                  }}
                  className="w-5 h-5 rounded cursor-pointer border-0"
                />
                <span className="text-[10px] text-muted-foreground">{char}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Palette presets */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Presets:</span>
        <div className="grid grid-cols-2 gap-1">
          {PALETTE_TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => onChange(assignLetterColors(companyName, template))}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-accent transition-colors ${
                currentColors.name === template.name ? 'bg-accent ring-1 ring-primary' : ''
              }`}
            >
              <div className="flex gap-0.5">
                {template.colors.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span>{template.name}</span>
            </button>
          ))}
        </div>
        <div className="pt-1">
          <span className="text-xs text-muted-foreground">Mono:</span>
          <div className="grid grid-cols-3 gap-1 mt-1">
            {PALETTE_TEMPLATES.slice(0, 6).map((template) => (
              <button
                key={`mono-${template.name}`}
                onClick={() => onChange(assignMonochromeColors(companyName, template))}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs hover:bg-accent transition-colors ${
                  currentColors.name === `${template.name} Mono` ? 'bg-accent ring-1 ring-primary' : ''
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: template.colors[0] }}
                />
                <span>{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
