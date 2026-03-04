import type { FontConfig } from './types';

export const CURATED_FONTS: FontConfig[] = [
  { family: 'Montserrat', weight: 700, category: 'sans-serif' },
  { family: 'Playfair Display', weight: 700, category: 'serif' },
  { family: 'Oswald', weight: 600, category: 'sans-serif' },
  { family: 'Raleway', weight: 700, category: 'sans-serif' },
  { family: 'Abril Fatface', weight: 400, category: 'display' },
  { family: 'Bebas Neue', weight: 400, category: 'display' },
  { family: 'Poppins', weight: 700, category: 'sans-serif' },
  { family: 'Inter', weight: 700, category: 'sans-serif' },
  { family: 'Lora', weight: 700, category: 'serif' },
  { family: 'Comfortaa', weight: 700, category: 'display' },
  { family: 'Righteous', weight: 400, category: 'display' },
  { family: 'Archivo Black', weight: 400, category: 'sans-serif' },
  { family: 'Pacifico', weight: 400, category: 'handwriting' },
  { family: 'Space Grotesk', weight: 700, category: 'sans-serif' },
  { family: 'DM Serif Display', weight: 400, category: 'serif' },
];

export function getFontUrl(font: FontConfig): string {
  const family = font.family.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${font.weight}&display=swap`;
}
