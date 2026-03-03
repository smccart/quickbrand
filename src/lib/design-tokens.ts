import type { ColorPalette, FontConfig } from './types';
import { getFontUrl } from './fonts';

const SEMANTIC_NAMES = ['primary', 'secondary', 'accent', 'muted', 'highlight', 'surface'];

function getUniqueColors(colors: ColorPalette): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const c of [colors.iconColor, ...colors.letterColors]) {
    const lower = c.toLowerCase();
    if (lower !== 'transparent' && !seen.has(lower)) {
      seen.add(lower);
      unique.push(c);
    }
  }
  return unique;
}

function semanticName(index: number): string {
  return SEMANTIC_NAMES[index] ?? `color-${index + 1}`;
}

// --- Color exports ---

export function generateCssVariables(colors: ColorPalette): string {
  const unique = getUniqueColors(colors);
  const vars = unique.map((c, i) => `  --brand-${semanticName(i)}: ${c};`);
  vars.push(`  --brand-icon: ${colors.iconColor};`);
  return `:root {\n${vars.join('\n')}\n}`;
}

export function generateTailwindColors(colors: ColorPalette): string {
  const unique = getUniqueColors(colors);
  const entries = unique.map((c, i) => `      ${semanticName(i)}: '${c}',`);
  entries.push(`      icon: '${colors.iconColor}',`);
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
${entries.join('\n')}
        },
      },
    },
  },
};`;
}

export function generateColorTokensJson(colors: ColorPalette): string {
  const unique = getUniqueColors(colors);
  const tokens: Record<string, { value: string; type: string }> = {};
  unique.forEach((c, i) => {
    tokens[semanticName(i)] = { value: c, type: 'color' };
  });
  tokens.icon = { value: colors.iconColor, type: 'color' };
  return JSON.stringify({ brand: { color: tokens } }, null, 2);
}

// --- Typography exports ---

export function generateFontCss(font: FontConfig): string {
  return `.brand-heading {
  font-family: '${font.family}', ${font.category};
  font-weight: ${font.weight};
}`;
}

export function generateFontLinkTag(font: FontConfig): string {
  return `<link rel="stylesheet" href="${getFontUrl(font)}">`;
}

export function generateTailwindFont(font: FontConfig): string {
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        brand: ['${font.family}', '${font.category}'],
      },
    },
  },
};`;
}
