import type { LogoConfig, ColorPalette, FontConfig, SemanticPalette } from './types';

export interface BrandGuidelinesConfig {
  companyName: string;
  tagline?: string;
  description?: string;
  colors: ColorPalette;
  font: FontConfig;
  palette?: SemanticPalette;
  logoUsage?: {
    minSize?: string;
    clearSpace?: string;
    backgrounds?: string[];
  };
}

export interface BrandGuidelinesResult {
  markdown: string;
  colorTable: string;
  typographySnippet: string;
}

function contrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function generateBrandGuidelines(config: BrandGuidelinesConfig): BrandGuidelinesResult {
  const {
    companyName,
    tagline,
    description,
    colors,
    font,
    palette,
    logoUsage,
  } = config;

  const uniqueColors = new Map<string, string>();
  uniqueColors.set('Icon / Primary', colors.iconColor);
  colors.letterColors.forEach((c, i) => {
    const key = colors.letterColors.length > 1 ? `Letter ${i + 1}` : 'Text';
    if (!Array.from(uniqueColors.values()).includes(c)) {
      uniqueColors.set(key, c);
    }
  });

  // Color table (markdown)
  const colorRows: string[] = ['| Role | Hex | Usage |', '|------|-----|-------|'];
  for (const [role, hex] of uniqueColors) {
    colorRows.push(`| ${role} | \`${hex}\` | Brand identity, ${role.toLowerCase()} elements |`);
  }

  if (palette) {
    const semantic = palette.colors;
    colorRows.push(
      `| Primary | \`${semantic.primary.hex}\` | Primary actions, links |`,
      `| Secondary | \`${semantic.secondary.hex}\` | Secondary elements |`,
      `| Surface | \`${semantic.surface.hex}\` | Backgrounds, cards |`,
      `| Error | \`${semantic.error.hex}\` | Error states, destructive actions |`,
      `| Warning | \`${semantic.warning.hex}\` | Warning states, caution |`,
      `| Success | \`${semantic.success.hex}\` | Success states, confirmation |`,
      `| Info | \`${semantic.info.hex}\` | Informational elements |`,
    );
  }

  const colorTable = colorRows.join('\n');

  // Typography snippet
  const typographySnippet = `/* ${companyName} Typography */
@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@${font.weight}&display=swap');

:root {
  --font-brand: '${font.family}', ${font.category};
  --font-weight-brand: ${font.weight};
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-brand);
  font-weight: var(--font-weight-brand);
}`;

  // Full markdown document
  const sections: string[] = [
    `# ${companyName} Brand Guidelines`,
    '',
    tagline ? `> ${tagline}` : '',
    '',
    description || `These guidelines define the visual identity of ${companyName}. Follow them to ensure consistent brand representation across all touchpoints.`,
    '',
    '---',
    '',
    '## 1. Logo',
    '',
    '### Usage Rules',
    `- **Minimum size**: ${logoUsage?.minSize || '32px height for digital, 0.5" for print'}`,
    `- **Clear space**: ${logoUsage?.clearSpace || 'Maintain padding equal to the icon height on all sides'}`,
    `- **Preferred backgrounds**: ${logoUsage?.backgrounds?.join(', ') || 'White, light gray, or brand primary color'}`,
    '',
    '### Do\'s',
    '- Use the provided SVG files for maximum quality',
    '- Scale proportionally (never stretch or distort)',
    '- Use the horizontal layout for wide spaces, vertical for narrow/square',
    '',
    '### Don\'ts',
    '- Don\'t change the logo colors outside the approved palette',
    '- Don\'t add effects (shadows, outlines, glows)',
    '- Don\'t place the logo on busy or low-contrast backgrounds',
    '- Don\'t rotate or skew the logo',
    '',
    '---',
    '',
    '## 2. Color Palette',
    '',
    colorTable,
    '',
    '### Color Usage',
    `- **Primary (${colors.iconColor})**: Use for key brand elements, icons, and primary CTAs`,
    `- **Text colors**: Use for headings and brand typography`,
    '- **Backgrounds**: Use white or very light tints of the primary color',
    '- **Dark mode**: Lighten brand colors by 10-15% for dark backgrounds',
    '',
    '---',
    '',
    '## 3. Typography',
    '',
    `**Primary Font**: ${font.family}`,
    `**Weight**: ${font.weight}`,
    `**Category**: ${font.category}`,
    '',
    '### Hierarchy',
    `| Element | Size | Weight | Font |`,
    `|---------|------|--------|------|`,
    `| H1 | 36px / 2.25rem | ${font.weight} | ${font.family} |`,
    `| H2 | 30px / 1.875rem | ${font.weight} | ${font.family} |`,
    `| H3 | 24px / 1.5rem | ${font.weight} | ${font.family} |`,
    `| H4 | 20px / 1.25rem | ${font.weight} | ${font.family} |`,
    `| Body | 16px / 1rem | 400 | System sans-serif |`,
    `| Small | 14px / 0.875rem | 400 | System sans-serif |`,
    `| Caption | 12px / 0.75rem | 500 | System sans-serif |`,
    '',
    '---',
    '',
    '## 4. Iconography',
    '',
    `- **Style**: Consistent with the brand icon (${colors.iconColor} on light, white on dark)`,
    '- **Size**: 20-24px for inline, 32-48px for feature icons',
    '- **Stroke width**: 1.5-2px for outlined icons',
    '- **Source**: Iconify, Lucide, or custom SVGs matching the brand aesthetic',
    '',
    '---',
    '',
    '## 5. Spacing & Layout',
    '',
    '- **Base unit**: 4px (0.25rem)',
    '- **Spacing scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96',
    '- **Border radius**: 8px (default), 12px (cards), 9999px (pills)',
    '- **Max content width**: 1200px',
    '',
    '---',
    '',
    '## 6. Voice & Tone',
    '',
    `- **Professional** yet approachable`,
    '- **Clear** and concise — avoid jargon',
    '- **Confident** without being arrogant',
    '- **Helpful** — always provide actionable guidance',
    '',
    '---',
    '',
    `*Generated for ${companyName} by FetchKit*`,
  ].filter(Boolean);

  return {
    markdown: sections.join('\n'),
    colorTable,
    typographySnippet,
  };
}

export function guidelinesFromLogo(config: LogoConfig, extras?: Partial<BrandGuidelinesConfig>): BrandGuidelinesResult {
  return generateBrandGuidelines({
    companyName: config.companyName,
    colors: config.colors,
    font: config.font,
    ...extras,
  });
}
