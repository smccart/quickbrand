import opentype from 'opentype.js';
import type { LogoConfig, LayoutDirection, ColorMode, GradientDef } from './types';
import { getDarkModeColors } from './colors';
import { fetchIconSvg, colorizeIconSvg } from './icons';

const ICON_SIZE = 64;
const FONT_SIZE = 48;
const PADDING = 16;

// Cache for loaded fonts
const fontCache = new Map<string, opentype.Font>();

async function loadFont(family: string, weight: number): Promise<opentype.Font> {
  const key = `${family}:${weight}`;
  if (fontCache.has(key)) return fontCache.get(key)!;

  // Fetch the font CSS to get the actual font file URL
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:wght@${weight}&display=swap`;
  const cssRes = await fetch(cssUrl);
  const cssText = await cssRes.text();

  // Extract the font URL from the CSS
  const urlMatch = cssText.match(/url\(([^)]+)\)/);
  if (!urlMatch) throw new Error(`Could not find font URL for ${family}`);

  const fontUrl = urlMatch[1].replace(/['"]/g, '');
  const fontRes = await fetch(fontUrl);
  const buffer = await fontRes.arrayBuffer();
  const font = opentype.parse(buffer);

  fontCache.set(key, font);
  return font;
}

interface LetterPath {
  pathData: string;
  color: string;
  x: number;
  width: number;
  wordIndex: number;
}

function textToLetterPaths(
  text: string,
  font: opentype.Font,
  fontSize: number,
  letterColors: string[],
  segments?: string[],
): LetterPath[] {
  const paths: LetterPath[] = [];
  let x = 0;
  const scale = fontSize / font.unitsPerEm;

  // Build per-character segment map if segments provided
  let segmentMap: number[] | undefined;
  if (segments) {
    segmentMap = [];
    let si = 0;
    let posInSeg = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        segmentMap.push(-1);
      } else {
        while (si < segments.length && posInSeg >= segments[si].length) {
          si++;
          posInSeg = 0;
        }
        segmentMap.push(si);
        posInSeg++;
      }
    }
  }

  let wordIndex = 0; // fallback for no segments

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ') {
      const spaceGlyph = font.charToGlyph(' ');
      x += (spaceGlyph.advanceWidth ?? font.unitsPerEm * 0.25) * scale;
      if (!segmentMap) wordIndex++;
      continue;
    }

    const glyph = font.charToGlyph(char);
    const path = glyph.getPath(x, fontSize, fontSize);
    const pathData = path.toSVG(2);

    // Extract just the d attribute from the path SVG
    const dMatch = pathData.match(/d="([^"]+)"/);
    if (dMatch) {
      const advanceWidth = (glyph.advanceWidth ?? 0) * scale;
      paths.push({
        pathData: dMatch[1],
        color: letterColors[i] ?? letterColors[0],
        x,
        width: advanceWidth,
        wordIndex: segmentMap ? (segmentMap[i] ?? 0) : wordIndex,
      });
      x += advanceWidth;
    }
  }

  return paths;
}

function buildExportGradientDefs(
  letterPaths: LetterPath[],
  gradients: GradientDef[],
  iconGradient?: GradientDef,
): string {
  // Compute word x-bounds for userSpaceOnUse gradients
  const wordBounds = new Map<number, { minX: number; maxX: number }>();
  for (const lp of letterPaths) {
    const bounds = wordBounds.get(lp.wordIndex);
    if (!bounds) {
      wordBounds.set(lp.wordIndex, { minX: lp.x, maxX: lp.x + lp.width });
    } else {
      bounds.minX = Math.min(bounds.minX, lp.x);
      bounds.maxX = Math.max(bounds.maxX, lp.x + lp.width);
    }
  }

  const defs: string[] = [];

  for (let wi = 0; wi < gradients.length; wi++) {
    const grad = gradients[wi];
    const bounds = wordBounds.get(wi);
    if (!bounds) continue;

    const stops = grad.stops
      .map((s) => `    <stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`)
      .join('\n');
    defs.push(
      `  <linearGradient id="${grad.id}" gradientUnits="userSpaceOnUse" x1="${bounds.minX}" y1="0" x2="${bounds.maxX}" y2="0">\n${stops}\n  </linearGradient>`,
    );
  }

  if (iconGradient) {
    const stops = iconGradient.stops
      .map((s) => `    <stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`)
      .join('\n');
    defs.push(
      `  <linearGradient id="${iconGradient.id}" x1="0%" y1="0%" x2="100%" y2="100%">\n${stops}\n  </linearGradient>`,
    );
  }

  return defs.length > 0 ? `<defs>\n${defs.join('\n')}\n</defs>` : '';
}

export async function buildExportSvg(
  config: LogoConfig,
  layout: LayoutDirection,
  mode: ColorMode,
): Promise<string> {
  const colors = mode === 'dark' ? getDarkModeColors(config.colors) : config.colors;
  const font = await loadFont(config.font.family, config.font.weight);

  // Get icon SVG
  let iconSvg = await fetchIconSvg(config.icon.id);
  const isGradient = colors.fillMode === 'gradient' && colors.gradients?.length;

  if (isGradient && colors.iconGradient && iconSvg.includes('currentColor')) {
    // For gradient icons, we'll inject the gradient into the export SVG and
    // replace currentColor with url(#gradientId)
    iconSvg = iconSvg.replace(/currentColor/g, `url(#${colors.iconGradient.id})`);
  } else {
    iconSvg = colorizeIconSvg(iconSvg, colors.iconColor);
  }

  // Convert text to paths
  const letterPaths = textToLetterPaths(
    config.companyName,
    font,
    FONT_SIZE,
    colors.letterColors,
    colors.segments,
  );

  // Calculate text bounds
  const textWidth = letterPaths.length > 0
    ? letterPaths[letterPaths.length - 1].x + letterPaths[letterPaths.length - 1].width
    : 0;

  // Build gradient defs if needed
  const gradientDefs = isGradient
    ? buildExportGradientDefs(letterPaths, colors.gradients!, colors.iconGradient)
    : '';

  if (layout === 'horizontal') {
    return buildHorizontalExportSvg(iconSvg, letterPaths, textWidth, colors.iconColor, gradientDefs, isGradient ? colors.gradients : undefined);
  }
  return buildVerticalExportSvg(iconSvg, letterPaths, textWidth, colors.iconColor, gradientDefs, isGradient ? colors.gradients : undefined);
}

function buildHorizontalExportSvg(
  iconSvg: string,
  letterPaths: LetterPath[],
  textWidth: number,
  _iconColor: string,
  gradientDefs: string,
  gradients?: GradientDef[],
): string {
  const totalWidth = ICON_SIZE + PADDING + textWidth + PADDING * 2;
  const totalHeight = Math.max(ICON_SIZE, FONT_SIZE) + PADDING * 2;

  const iconY = (totalHeight - ICON_SIZE) / 2;
  const textGroupX = PADDING + ICON_SIZE + PADDING;
  const textGroupY = (totalHeight - FONT_SIZE) / 2;

  const pathElements = letterPaths
    .map((lp) => {
      const fill = gradients
        ? `url(#${gradients[lp.wordIndex % gradients.length].id})`
        : lp.color;
      return `    <path d="${lp.pathData}" fill="${fill}"/>`;
    })
    .join('\n');

  const iconInner = extractSvgContent(iconSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  ${gradientDefs}
  <g transform="translate(${PADDING}, ${iconY})">
    <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${getViewBox(iconSvg)}">
      ${iconInner}
    </svg>
  </g>
  <g transform="translate(${textGroupX}, ${textGroupY})">
${pathElements}
  </g>
</svg>`;
}

function buildVerticalExportSvg(
  iconSvg: string,
  letterPaths: LetterPath[],
  textWidth: number,
  _iconColor: string,
  gradientDefs: string,
  gradients?: GradientDef[],
): string {
  const totalWidth = Math.max(ICON_SIZE, textWidth) + PADDING * 2;
  const totalHeight = ICON_SIZE + PADDING + FONT_SIZE + PADDING * 2;

  const iconX = (totalWidth - ICON_SIZE) / 2;
  const textGroupX = (totalWidth - textWidth) / 2;
  const textGroupY = PADDING + ICON_SIZE + PADDING;

  const pathElements = letterPaths
    .map((lp) => {
      const fill = gradients
        ? `url(#${gradients[lp.wordIndex % gradients.length].id})`
        : lp.color;
      return `    <path d="${lp.pathData}" fill="${fill}"/>`;
    })
    .join('\n');

  const iconInner = extractSvgContent(iconSvg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  ${gradientDefs}
  <g transform="translate(${iconX}, ${PADDING})">
    <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${getViewBox(iconSvg)}">
      ${iconInner}
    </svg>
  </g>
  <g transform="translate(${textGroupX}, ${textGroupY})">
${pathElements}
  </g>
</svg>`;
}

export function extractSvgContent(svg: string): string {
  return svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
}

export function getViewBox(svg: string): string {
  const match = svg.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 24 24';
}
