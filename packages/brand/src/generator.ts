import type { LogoVariation, FontConfig, IconConfig, ColorPalette } from './types';
import { CURATED_FONTS } from './fonts';
import { getIconsForCompany } from './icons';
import { PALETTE_TEMPLATES, assignLetterColors, assignMonochromeColors } from './colors';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateLogos(companyName: string, count = 30): Promise<LogoVariation[]> {
  // Fetch icons based on company name
  const icons = await getIconsForCompany(companyName);
  if (icons.length === 0) return [];

  // Shuffle fonts and palettes for variety
  const fonts = shuffleArray(CURATED_FONTS).slice(0, 6);
  const paletteTemplates = shuffleArray(PALETTE_TEMPLATES).slice(0, 6);

  // Generate color palettes - mix of multicolor and monochrome
  const palettes: ColorPalette[] = [];
  for (const template of paletteTemplates) {
    palettes.push(assignLetterColors(companyName, template));
    palettes.push(assignMonochromeColors(companyName, template));
  }

  // Generate variations using prime-offset rotation to avoid repetition
  const variations: LogoVariation[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < count * 2 && variations.length < count; i++) {
    const icon = icons[i % icons.length];
    const font = fonts[(i * 3) % fonts.length];
    const palette = palettes[(i * 2) % palettes.length];

    const key = `${icon.id}-${font.family}-${palette.name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    variations.push({
      id: `logo-${i}-${Date.now()}`,
      config: {
        companyName,
        font,
        icon,
        colors: palette,
      },
    });
  }

  return variations;
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
