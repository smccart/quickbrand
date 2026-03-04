import { CURATED_FONTS } from '@fetchkit/brand';
import type { FontConfig } from '@fetchkit/brand';

interface FontPickerProps {
  currentFont: FontConfig;
  onSelect: (font: FontConfig) => void;
}

export function FontPicker({ currentFont, onSelect }: FontPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Font</h3>
      <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
        {CURATED_FONTS.map((font) => (
          <button
            key={font.family}
            onClick={() => onSelect(font)}
            className={`text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm ${
              font.family === currentFont.family ? 'bg-accent ring-1 ring-primary' : ''
            }`}
            style={{ fontFamily: `'${font.family}', sans-serif`, fontWeight: font.weight }}
          >
            {font.family}
          </button>
        ))}
      </div>
    </div>
  );
}
