import type { LogoConfig, LayoutDirection } from './types';

const ICON_SIZE = 48;
const FONT_SIZE = 36;
const PADDING = 12;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildPreviewSvg(config: LogoConfig, layout: LayoutDirection): string {
  const { companyName, font, colors } = config;

  if (layout === 'horizontal') {
    return buildHorizontalSvg(companyName, font.family, font.weight, colors.iconColor, colors.letterColors);
  }
  return buildVerticalSvg(companyName, font.family, font.weight, colors.iconColor, colors.letterColors);
}

function buildHorizontalSvg(
  name: string,
  fontFamily: string,
  fontWeight: number,
  iconColor: string,
  letterColors: string[],
): string {
  // Estimate text width (rough: ~0.6 * fontSize per character)
  const charWidth = FONT_SIZE * 0.6;
  const textWidth = name.length * charWidth;
  const totalWidth = ICON_SIZE + PADDING + textWidth + PADDING * 2;
  const totalHeight = Math.max(ICON_SIZE, FONT_SIZE) + PADDING * 2;

  const textX = PADDING + ICON_SIZE + PADDING;
  const textY = totalHeight / 2;

  // Build individual letter tspans
  const letterSpans = Array.from(name)
    .map((char, i) => {
      const color = letterColors[i] ?? letterColors[0];
      if (char === ' ') return `<tspan fill="transparent"> </tspan>`;
      return `<tspan fill="${color}">${escapeXml(char)}</tspan>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <rect x="${PADDING}" y="${(totalHeight - ICON_SIZE) / 2}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="4" fill="${iconColor}" opacity="0.15"/>
  <text x="${PADDING + ICON_SIZE / 2}" y="${totalHeight / 2}" text-anchor="middle" dominant-baseline="central" fill="${iconColor}" font-size="${ICON_SIZE * 0.6}" font-family="sans-serif">&#x2B22;</text>
  <text x="${textX}" y="${textY}" dominant-baseline="central" font-family="'${fontFamily}', sans-serif" font-weight="${fontWeight}" font-size="${FONT_SIZE}">${letterSpans}</text>
</svg>`;
}

function buildVerticalSvg(
  name: string,
  fontFamily: string,
  fontWeight: number,
  iconColor: string,
  letterColors: string[],
): string {
  const charWidth = FONT_SIZE * 0.6;
  const textWidth = name.length * charWidth;
  const totalWidth = Math.max(ICON_SIZE, textWidth) + PADDING * 2;
  const totalHeight = ICON_SIZE + PADDING + FONT_SIZE + PADDING * 2;

  const iconX = totalWidth / 2;
  const textX = totalWidth / 2;
  const textY = PADDING + ICON_SIZE + PADDING + FONT_SIZE / 2;

  const letterSpans = Array.from(name)
    .map((char, i) => {
      const color = letterColors[i] ?? letterColors[0];
      if (char === ' ') return `<tspan fill="transparent"> </tspan>`;
      return `<tspan fill="${color}">${escapeXml(char)}</tspan>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <rect x="${(totalWidth - ICON_SIZE) / 2}" y="${PADDING}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="4" fill="${iconColor}" opacity="0.15"/>
  <text x="${iconX}" y="${PADDING + ICON_SIZE / 2}" text-anchor="middle" dominant-baseline="central" fill="${iconColor}" font-size="${ICON_SIZE * 0.6}" font-family="sans-serif">&#x2B22;</text>
  <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="central" font-family="'${fontFamily}', sans-serif" font-weight="${fontWeight}" font-size="${FONT_SIZE}">${letterSpans}</text>
</svg>`;
}
