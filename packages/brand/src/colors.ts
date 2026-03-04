import type { ColorPalette } from './types';

interface PaletteTemplate {
  name: string;
  colors: string[];
}

export const PALETTE_TEMPLATES: PaletteTemplate[] = [
  { name: 'Ocean', colors: ['#0077B6', '#00B4D8', '#0096C7', '#023E8A', '#48CAE4', '#90E0EF'] },
  { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFB627', '#E63946', '#FF8C42', '#FFA62B'] },
  { name: 'Forest', colors: ['#2D6A4F', '#40916C', '#52B788', '#1B4332', '#74C69D', '#95D5B2'] },
  { name: 'Berry', colors: ['#7B2D8E', '#9B59B6', '#C39BD3', '#6C3483', '#A569BD', '#D2B4DE'] },
  { name: 'Ember', colors: ['#D62828', '#F77F00', '#FCBF49', '#E85D04', '#DC2F02', '#F48C06'] },
  { name: 'Midnight', colors: ['#1B263B', '#415A77', '#778DA9', '#0D1B2A', '#2B4570', '#5C7FA3'] },
  { name: 'Coral', colors: ['#FF6B6B', '#FF8E8E', '#FFA5A5', '#EE6C4D', '#F4845F', '#F7A072'] },
  { name: 'Mint', colors: ['#06D6A0', '#1B9AAA', '#07BEB8', '#3DCCC7', '#68D8D6', '#9CEAEF'] },
  { name: 'Slate', colors: ['#2F3E46', '#354F52', '#52796F', '#84A98C', '#3A5A40', '#588157'] },
  { name: 'Royal', colors: ['#3A0CA3', '#4361EE', '#4895EF', '#4CC9F0', '#560BAD', '#7209B7'] },
  { name: 'Autumn', colors: ['#BC6C25', '#DDA15E', '#606C38', '#283618', '#FEFAE0', '#9B8816'] },
  { name: 'Neon', colors: ['#00F5D4', '#00BBF9', '#FEE440', '#F15BB5', '#9B5DE5', '#FB5607'] },
];

export function assignLetterColors(companyName: string, template: PaletteTemplate): ColorPalette {
  const letterColors: string[] = [];

  for (let i = 0; i < companyName.length; i++) {
    if (companyName[i] === ' ') {
      letterColors.push('transparent');
    } else {
      letterColors.push(template.colors[i % template.colors.length]);
    }
  }

  return {
    name: template.name,
    iconColor: template.colors[0],
    letterColors,
  };
}

// For monochrome logo styles - single color for all text
export function assignMonochromeColors(companyName: string, template: PaletteTemplate): ColorPalette {
  const mainColor = template.colors[0];
  const letterColors = Array.from(companyName).map((c) =>
    c === ' ' ? 'transparent' : mainColor,
  );

  return {
    name: `${template.name} Mono`,
    iconColor: template.colors[1] ?? mainColor,
    letterColors,
  };
}

function lightenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * amount));
  const g = Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
  const b = Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function getDarkModeColors(palette: ColorPalette): ColorPalette {
  return {
    ...palette,
    name: `${palette.name} (Dark)`,
    iconColor: lightenHex(palette.iconColor, 0.6),
    letterColors: palette.letterColors.map((c) =>
      c === 'transparent' ? 'transparent' : lightenHex(c, 0.5),
    ),
  };
}
