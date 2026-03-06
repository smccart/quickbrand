import type { LogoConfig, LayoutDirection, GradientDef } from './types';

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

function buildGradientDefs(gradients: GradientDef[], iconGradient?: GradientDef): string {
  const allGradients = [...gradients];
  if (iconGradient) allGradients.push(iconGradient);
  if (allGradients.length === 0) return '';

  const defs = allGradients.map((g) => {
    const rad = (g.angle * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(rad) * 50);
    const y1 = Math.round(50 - Math.sin(rad) * 50);
    const x2 = Math.round(50 + Math.cos(rad) * 50);
    const y2 = Math.round(50 + Math.sin(rad) * 50);
    const stops = g.stops
      .map((s) => `    <stop offset="${s.offset * 100}%" stop-color="${s.color}"/>`)
      .join('\n');
    return `  <linearGradient id="${g.id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">\n${stops}\n  </linearGradient>`;
  });

  return `<defs>\n${defs.join('\n')}\n</defs>`;
}

export function buildPreviewSvg(config: LogoConfig, layout: LayoutDirection): string {
  const { companyName, font, colors } = config;
  const isGradient = colors.fillMode === 'gradient' && colors.gradients?.length;

  if (layout === 'horizontal') {
    return buildHorizontalSvg(companyName, font.family, font.weight, colors.iconColor, colors.letterColors, isGradient ? colors.gradients : undefined, isGradient ? colors.iconGradient : undefined, colors.segments);
  }
  return buildVerticalSvg(companyName, font.family, font.weight, colors.iconColor, colors.letterColors, isGradient ? colors.gradients : undefined, isGradient ? colors.iconGradient : undefined, colors.segments);
}

function buildWordTexts(
  name: string,
  fontFamily: string,
  fontWeight: number,
  letterColors: string[],
  gradients: GradientDef[] | undefined,
  segments: string[] | undefined,
  anchorX: number,
  y: number,
  textAnchor: 'start' | 'middle',
): string {
  if (!gradients || gradients.length === 0) {
    const letterSpans = Array.from(name)
      .map((char, i) => {
        const color = letterColors[i] ?? letterColors[0];
        if (char === ' ') return `<tspan fill="transparent"> </tspan>`;
        return `<tspan fill="${color}">${escapeXml(char)}</tspan>`;
      })
      .join('');
    return `<text x="${anchorX}" y="${y}" ${textAnchor === 'middle' ? 'text-anchor="middle" ' : ''}dominant-baseline="central" font-family="'${fontFamily}', sans-serif" font-weight="${fontWeight}" font-size="${FONT_SIZE}">${letterSpans}</text>`;
  }

  // Gradient mode: one <text> per segment (or per space-separated word as fallback)
  const parts = segments || name.split(' ');
  const charWidth = FONT_SIZE * 0.6;
  const spaceWidth = charWidth;
  const texts: string[] = [];
  let xOffset = textAnchor === 'middle' ? anchorX - (name.length * charWidth) / 2 : anchorX;

  // Walk through the original name to correctly position segments
  let nameIdx = 0;
  for (let pi = 0; pi < parts.length; pi++) {
    // Skip spaces in original name
    while (nameIdx < name.length && name[nameIdx] === ' ') {
      xOffset += spaceWidth;
      nameIdx++;
    }

    const part = parts[pi];
    const grad = gradients[pi % gradients.length];
    texts.push(
      `<text x="${xOffset}" y="${y}" dominant-baseline="central" font-family="'${fontFamily}', sans-serif" font-weight="${fontWeight}" font-size="${FONT_SIZE}" fill="url(#${grad.id})">${escapeXml(part)}</text>`,
    );
    xOffset += part.length * charWidth;
    nameIdx += part.length;
  }

  return texts.join('\n  ');
}

function buildHorizontalSvg(
  name: string,
  fontFamily: string,
  fontWeight: number,
  iconColor: string,
  letterColors: string[],
  gradients?: GradientDef[],
  iconGradient?: GradientDef,
  segments?: string[],
): string {
  const charWidth = FONT_SIZE * 0.6;
  const textWidth = name.length * charWidth;
  const totalWidth = ICON_SIZE + PADDING + textWidth + PADDING * 2;
  const totalHeight = Math.max(ICON_SIZE, FONT_SIZE) + PADDING * 2;

  const textX = PADDING + ICON_SIZE + PADDING;
  const textY = totalHeight / 2;

  const defs = (gradients || iconGradient) ? buildGradientDefs(gradients ?? [], iconGradient) : '';
  const iconFill = iconGradient ? `url(#${iconGradient.id})` : iconColor;

  const textContent = buildWordTexts(name, fontFamily, fontWeight, letterColors, gradients, segments, textX, textY, 'start');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  ${defs}
  <rect x="${PADDING}" y="${(totalHeight - ICON_SIZE) / 2}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="4" fill="${iconFill}" opacity="0.15"/>
  <text x="${PADDING + ICON_SIZE / 2}" y="${totalHeight / 2}" text-anchor="middle" dominant-baseline="central" fill="${iconFill}" font-size="${ICON_SIZE * 0.6}" font-family="sans-serif">&#x2B22;</text>
  ${textContent}
</svg>`;
}

function buildVerticalSvg(
  name: string,
  fontFamily: string,
  fontWeight: number,
  iconColor: string,
  letterColors: string[],
  gradients?: GradientDef[],
  iconGradient?: GradientDef,
  segments?: string[],
): string {
  const charWidth = FONT_SIZE * 0.6;
  const textWidth = name.length * charWidth;
  const totalWidth = Math.max(ICON_SIZE, textWidth) + PADDING * 2;
  const totalHeight = ICON_SIZE + PADDING + FONT_SIZE + PADDING * 2;

  const iconX = totalWidth / 2;
  const textX = totalWidth / 2;
  const textY = PADDING + ICON_SIZE + PADDING + FONT_SIZE / 2;

  const defs = (gradients || iconGradient) ? buildGradientDefs(gradients ?? [], iconGradient) : '';
  const iconFill = iconGradient ? `url(#${iconGradient.id})` : iconColor;

  const textContent = buildWordTexts(name, fontFamily, fontWeight, letterColors, gradients, segments, textX, textY, 'middle');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  ${defs}
  <rect x="${(totalWidth - ICON_SIZE) / 2}" y="${PADDING}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="4" fill="${iconFill}" opacity="0.15"/>
  <text x="${iconX}" y="${PADDING + ICON_SIZE / 2}" text-anchor="middle" dominant-baseline="central" fill="${iconFill}" font-size="${ICON_SIZE * 0.6}" font-family="sans-serif">&#x2B22;</text>
  ${textContent}
</svg>`;
}
