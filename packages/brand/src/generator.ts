import type { LogoVariation, FontConfig, IconConfig, ColorPalette, WordStyle } from './types';
import { CURATED_FONTS } from './fonts';
import { getIconsForCompany } from './icons';
import { PALETTE_TEMPLATES, assignLetterColors, assignMonochromeColors, assignWordGradients, assignSplitSolid, assignSplitDuotone, assignSplitGradient, buildAccentPalettes, splitBrandSegments } from './colors';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Word-style sizing presets for multi-word names
const WORD_STYLE_PRESETS: WordStyle[][] = [
  // Preset 0: equal
  [{ fontSize: 1.0, fontWeight: 700 }, { fontSize: 1.0, fontWeight: 700 }],
  // Preset 1: first word larger
  [{ fontSize: 1.3, fontWeight: 800 }, { fontSize: 1.0, fontWeight: 400 }],
  // Preset 2: second word larger
  [{ fontSize: 1.0, fontWeight: 400 }, { fontSize: 1.3, fontWeight: 800 }],
  // Preset 3: first word small+bold, second word big+light
  [{ fontSize: 0.85, fontWeight: 800 }, { fontSize: 1.15, fontWeight: 400 }],
];

// Build full palette list from templates (solid, mono, gradient, split modes)
function buildAllPalettes(companyName: string, accentColor?: string, secondaryColor?: string): ColorPalette[] {
  const palettes: ColorPalette[] = [];
  const hasSplittableSegments = splitBrandSegments(companyName).length >= 2;

  function addPalettesForTemplate(template: { name: string; colors: string[] }) {
    palettes.push(assignLetterColors(companyName, template));
    palettes.push(assignMonochromeColors(companyName, template));
    palettes.push(assignWordGradients(companyName, template));
    if (hasSplittableSegments) {
      palettes.push(assignSplitSolid(companyName, template));
      palettes.push(assignSplitDuotone(companyName, template));
      palettes.push(assignSplitGradient(companyName, template));
    }
  }

  // Accent-derived palettes first so they appear in early batches
  if (accentColor) {
    for (const template of buildAccentPalettes(accentColor, secondaryColor)) {
      addPalettesForTemplate(template);
    }
  }

  for (const template of PALETTE_TEMPLATES) {
    addPalettesForTemplate(template);
  }
  return palettes;
}

function getWordStylesForPreset(companyName: string, presetIndex: number): WordStyle[] | undefined {
  const words = companyName.split(' ').filter(Boolean);
  if (words.length < 2) return undefined;

  const preset = WORD_STYLE_PRESETS[presetIndex % WORD_STYLE_PRESETS.length];
  return words.map((_, i) => preset[Math.min(i, preset.length - 1)]);
}

/**
 * Generate a batch of logo variations using deterministic index math
 * into the full cartesian product space.
 */
export function generateLogosBatch(
  companyName: string,
  batchIndex: number,
  batchSize: number,
  icons: IconConfig[],
  accentColor?: string,
  secondaryColor?: string,
): LogoVariation[] {
  const fonts = CURATED_FONTS;
  const palettes = buildAllPalettes(companyName, accentColor, secondaryColor);
  const hasMultipleWords = companyName.split(' ').filter(Boolean).length >= 2;
  const styleCount = hasMultipleWords ? WORD_STYLE_PRESETS.length : 1;

  const iconCount = icons.length || 1;
  const fontCount = fonts.length;
  const paletteCount = palettes.length;

  const totalSpace = iconCount * fontCount * paletteCount * styleCount;
  const startIdx = batchIndex * batchSize;

  const variations: LogoVariation[] = [];

  for (let n = startIdx; n < startIdx + batchSize && n < totalSpace; n++) {
    const paletteIdx = n % paletteCount;
    const iconIdx = Math.floor(n / paletteCount) % iconCount;
    const fontIdx = Math.floor(n / (paletteCount * iconCount)) % fontCount;
    const styleIdx = Math.floor(n / (paletteCount * iconCount * fontCount)) % styleCount;

    const icon = icons[iconIdx];
    const font = fonts[fontIdx];
    const palette = palettes[paletteIdx];
    const wordStyles = getWordStylesForPreset(companyName, styleIdx);

    variations.push({
      id: `logo-${batchIndex}-${n}-${Date.now()}`,
      config: {
        companyName,
        font,
        icon,
        colors: palette,
        wordStyles,
      },
    });
  }

  return variations;
}

/**
 * Backward-compatible wrapper. Fetches icons internally, returns a single batch.
 */
export async function generateLogos(companyName: string, count = 30): Promise<LogoVariation[]> {
  const icons = await getIconsForCompany(companyName);
  if (icons.length === 0) return [];

  const shuffledIcons = shuffleArray(icons);
  return generateLogosBatch(companyName, 0, count, shuffledIcons);
}

// Regenerate with a specific icon/font/palette locked in
export function regenerateWithOverrides(
  companyName: string,
  overrides: {
    icon?: IconConfig;
    font?: FontConfig;
    palette?: ColorPalette;
  },
  count = 30,
): LogoVariation[] {
  const fonts = overrides.font ? [overrides.font] : shuffleArray(CURATED_FONTS).slice(0, 6);
  const icons = overrides.icon ? [overrides.icon] : [];

  const paletteTemplates = shuffleArray(PALETTE_TEMPLATES).slice(0, 6);
  const palettes = overrides.palette
    ? [overrides.palette]
    : paletteTemplates.flatMap((t) => [
        assignLetterColors(companyName, t),
        assignMonochromeColors(companyName, t),
        assignWordGradients(companyName, t),
      ]);

  const variations: LogoVariation[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < count * 2 && variations.length < count; i++) {
    const icon = icons[i % icons.length];
    const font = fonts[(i * 3) % fonts.length];
    const palette = palettes[(i * 2) % palettes.length];

    if (!icon || !font || !palette) continue;

    const key = `${icon.id}-${font.family}-${palette.name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    variations.push({
      id: `logo-${i}-${Date.now()}`,
      config: { companyName, font, icon, colors: palette },
    });
  }

  return variations;
}
