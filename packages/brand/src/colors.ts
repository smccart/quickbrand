import type { ColorPalette, GradientDef, SemanticPalette } from './types';
import { generateSemanticPalette } from './palette-generator';

export interface PaletteTemplate {
  name: string;
  colors: string[];
}

// --- HSL helpers for accent-derived palettes ---

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = ((num >> 16) & 0xff) / 255;
  let g = ((num >> 8) & 0xff) / 255;
  let b = (num & 0xff) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function buildAccentPalettes(accentHex: string, secondaryHex?: string): PaletteTemplate[] {
  const { h, s, l } = hexToHsl(accentHex);
  const sat = Math.max(s, 0.5);

  const palettes: PaletteTemplate[] = [
    {
      name: 'Brand',
      colors: [
        accentHex,
        secondaryHex || hslToHex(h, sat, Math.min(l + 0.15, 0.85)),
        hslToHex(h, sat * 0.8, Math.max(l - 0.15, 0.2)),
        hslToHex(h + 15, sat, l),
        hslToHex(h - 15, sat, l),
        hslToHex(h, sat * 0.6, Math.min(l + 0.3, 0.9)),
      ],
    },
    {
      name: 'Brand Complement',
      colors: [
        accentHex,
        secondaryHex || hslToHex(h + 180, sat, l),
        hslToHex(h, sat, Math.min(l + 0.2, 0.85)),
        hslToHex(h + 180, sat, Math.min(l + 0.2, 0.85)),
        hslToHex(h + 30, sat * 0.7, l),
        hslToHex(h + 210, sat * 0.7, l),
      ],
    },
    {
      name: 'Brand Analogous',
      colors: [
        accentHex,
        secondaryHex || hslToHex(h + 30, sat, l),
        hslToHex(h - 30, sat, l),
        hslToHex(h + 60, sat * 0.8, Math.min(l + 0.1, 0.8)),
        hslToHex(h - 60, sat * 0.8, Math.min(l + 0.1, 0.8)),
        hslToHex(h, sat * 0.5, Math.min(l + 0.25, 0.9)),
      ],
    },
    {
      name: 'Brand Triadic',
      colors: [
        accentHex,
        secondaryHex || hslToHex(h + 120, sat, l),
        hslToHex(h + 240, sat, l),
        hslToHex(h, sat, Math.min(l + 0.2, 0.85)),
        hslToHex(h + 120, sat, Math.min(l + 0.2, 0.85)),
        hslToHex(h + 240, sat, Math.min(l + 0.2, 0.85)),
      ],
    },
  ];

  // When secondary is provided, add a dedicated primary+secondary duotone palette
  if (secondaryHex) {
    const { h: h2, s: s2, l: l2 } = hexToHsl(secondaryHex);
    const sat2 = Math.max(s2, 0.5);
    palettes.push({
      name: 'Brand Duotone',
      colors: [
        accentHex,
        secondaryHex,
        hslToHex(h, sat, Math.min(l + 0.2, 0.85)),
        hslToHex(h2, sat2, Math.min(l2 + 0.2, 0.85)),
        hslToHex(h, sat * 0.6, Math.max(l - 0.1, 0.2)),
        hslToHex(h2, sat2 * 0.6, Math.max(l2 - 0.1, 0.2)),
      ],
    });
  }

  return palettes;
}

export const PALETTE_TEMPLATES: PaletteTemplate[] = [
  // Original 12
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
  // Dark themes
  { name: 'Obsidian', colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#2B2D42'] },
  { name: 'Void', colors: ['#0B0C10', '#1F2833', '#C5C6C7', '#66FCF1', '#45A29E', '#202833'] },
  // Pastels
  { name: 'Blush', colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9DCC4', '#FEC89A', '#FFDDD2'] },
  { name: 'Lavender', colors: ['#E2CFEA', '#A06CD5', '#6247AA', '#B388EB', '#8B5CF6', '#C4B5FD'] },
  // Duotones
  { name: 'Electric', colors: ['#0D00A4', '#6002EE', '#FF6D00', '#FFAB00', '#304FFE', '#651FFF'] },
  { name: 'Contrast', colors: ['#0A1128', '#001F54', '#034078', '#1282A2', '#FEFCFB', '#6FFFE9'] },
  // Earth tones
  { name: 'Terra', colors: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F4A460'] },
  { name: 'Clay', colors: ['#6B4226', '#87603E', '#C19A6B', '#D4A574', '#E3C09C', '#F0D8B8'] },
  // Neon-on-dark
  { name: 'Cyber', colors: ['#39FF14', '#00FFFF', '#FF00FF', '#FFFF00', '#FF3131', '#7DF9FF'] },
  { name: 'Plasma', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF', '#06D6A0'] },
  // Cool tones
  { name: 'Arctic', colors: ['#A8DADC', '#457B9D', '#1D3557', '#F1FAEE', '#E63946', '#2A9D8F'] },
  { name: 'Steel', colors: ['#4A4E69', '#22223B', '#9A8C98', '#C9ADA7', '#F2E9E4', '#6B705C'] },
];

/**
 * Split a brand name into logical segments based on camelCase, spaces, and punctuation.
 * "FetchKit" → ["Fetch", "Kit"]
 * "Fetch Kit" → ["Fetch", "Kit"]
 * "FetchKit.com" → ["FetchKit", ".com"]
 * "myApp" → ["my", "App"]
 */
export function splitBrandSegments(name: string): string[] {
  const segments: string[] = [];
  let current = '';

  for (let i = 0; i < name.length; i++) {
    const ch = name[i];

    if (ch === ' ') {
      if (current) segments.push(current);
      current = '';
      continue;
    }

    // Punctuation starts a new segment (stays attached to what follows)
    if (/[^a-zA-Z0-9]/.test(ch)) {
      if (current) segments.push(current);
      current = ch;
      continue;
    }

    // CamelCase: uppercase after lowercase starts new segment
    if (/[A-Z]/.test(ch) && current.length > 0 && /[a-z]/.test(current[current.length - 1])) {
      segments.push(current);
      current = ch;
      continue;
    }

    current += ch;
  }
  if (current) segments.push(current);

  return segments;
}

/** Get the char index where the last segment starts in the original name */
function getLastSegmentStart(name: string, segments: string[]): number {
  if (segments.length < 2) return 0;
  const lastSeg = segments[segments.length - 1];
  // Walk backwards from end to find where last segment starts
  let pos = name.length - 1;
  let segPos = lastSeg.length - 1;
  while (pos >= 0 && segPos >= 0) {
    if (name[pos] === ' ') { pos--; continue; }
    pos--;
    segPos--;
  }
  return pos + 1;
}

// Split solid: prefix in neutral color, suffix in solid accent
export function assignSplitSolid(name: string, template: PaletteTemplate, neutralColor = '#FFFFFF'): ColorPalette {
  const segments = splitBrandSegments(name);
  if (segments.length < 2) return assignMonochromeColors(name, template);

  const suffixStart = getLastSegmentStart(name, segments);
  const accentColor = template.colors[0];

  const letterColors: string[] = [];
  for (let i = 0; i < name.length; i++) {
    if (name[i] === ' ') letterColors.push('transparent');
    else if (i >= suffixStart) letterColors.push(accentColor);
    else letterColors.push(neutralColor);
  }

  return {
    name: `${template.name} Split`,
    iconColor: accentColor,
    letterColors,
    fillMode: 'solid',
    segments,
  };
}

// Split duotone: prefix in one palette color, suffix in another
export function assignSplitDuotone(name: string, template: PaletteTemplate): ColorPalette {
  const segments = splitBrandSegments(name);
  if (segments.length < 2) return assignMonochromeColors(name, template);

  const suffixStart = getLastSegmentStart(name, segments);
  const prefixColor = template.colors[0];
  const suffixColor = template.colors[1 % template.colors.length];

  const letterColors: string[] = [];
  for (let i = 0; i < name.length; i++) {
    if (name[i] === ' ') letterColors.push('transparent');
    else if (i >= suffixStart) letterColors.push(suffixColor);
    else letterColors.push(prefixColor);
  }

  return {
    name: `${template.name} Duo`,
    iconColor: prefixColor,
    letterColors,
    fillMode: 'solid',
    segments,
  };
}

// Split gradient: prefix in neutral, suffix gets a gradient
export function assignSplitGradient(name: string, template: PaletteTemplate, neutralColor = '#FFFFFF'): ColorPalette {
  const segments = splitBrandSegments(name);
  if (segments.length < 2) return assignWordGradients(name, template);

  const suffixStart = getLastSegmentStart(name, segments);
  const lastIdx = segments.length - 1;
  const slugBase = template.name.toLowerCase().replace(/\s+/g, '-');

  const gradients: GradientDef[] = segments.map((_, si) => {
    if (si < lastIdx) {
      return {
        id: `grad-${slugBase}-split${si}`,
        stops: [{ color: neutralColor, offset: 0 }, { color: neutralColor, offset: 1 }],
        angle: 90,
        type: 'linear' as const,
      };
    }
    const c1 = template.colors[0];
    const c2 = template.colors[1 % template.colors.length];
    return {
      id: `grad-${slugBase}-split${si}`,
      stops: [{ color: c1, offset: 0 }, { color: c2, offset: 1 }],
      angle: 90,
      type: 'linear' as const,
    };
  });

  const iconGradient: GradientDef = {
    id: `grad-${slugBase}-split-icon`,
    stops: [
      { color: template.colors[0], offset: 0 },
      { color: template.colors[1], offset: 1 },
    ],
    angle: 135,
    type: 'linear',
  };

  // Solid fallback letterColors
  const letterColors: string[] = [];
  for (let i = 0; i < name.length; i++) {
    if (name[i] === ' ') letterColors.push('transparent');
    else if (i >= suffixStart) letterColors.push(template.colors[0]);
    else letterColors.push(neutralColor);
  }

  return {
    name: `${template.name} Split Grad`,
    iconColor: template.colors[0],
    letterColors,
    fillMode: 'gradient',
    gradients,
    iconGradient,
    segments,
  };
}

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
    fillMode: 'solid',
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
    fillMode: 'solid',
  };
}

// Gradient palette - one gradient per segment (camelCase/space/punctuation aware)
export function assignWordGradients(companyName: string, template: PaletteTemplate): ColorPalette {
  const segments = splitBrandSegments(companyName);
  const slugBase = template.name.toLowerCase().replace(/\s+/g, '-');

  const gradients: GradientDef[] = segments.map((_, segIdx) => {
    const c1 = template.colors[(segIdx * 2) % template.colors.length];
    const c2 = template.colors[(segIdx * 2 + 1) % template.colors.length];
    return {
      id: `grad-${slugBase}-seg${segIdx}`,
      stops: [
        { color: c1, offset: 0 },
        { color: c2, offset: 1 },
      ],
      angle: 90,
      type: 'linear' as const,
    };
  });

  const iconGradient: GradientDef = {
    id: `grad-${slugBase}-icon`,
    stops: [
      { color: template.colors[0], offset: 0 },
      { color: template.colors[1], offset: 1 },
    ],
    angle: 135,
    type: 'linear',
  };

  // Solid fallback letterColors (for dark mode, favicons, social cards)
  const letterColors: string[] = [];
  for (let i = 0; i < companyName.length; i++) {
    if (companyName[i] === ' ') {
      letterColors.push('transparent');
    } else {
      letterColors.push(template.colors[i % template.colors.length]);
    }
  }

  return {
    name: `${template.name} Gradient`,
    iconColor: template.colors[0],
    letterColors,
    fillMode: 'gradient',
    gradients,
    iconGradient,
    segments,
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
    // Resolve gradients to solid for dark mode
    fillMode: 'solid',
    gradients: undefined,
    iconGradient: undefined,
  };
}

export function semanticPaletteFromColorPalette(
  palette: ColorPalette,
): SemanticPalette {
  return generateSemanticPalette(palette.iconColor);
}
