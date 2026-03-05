import type {
  PlaceholderBundle,
  PlaceholderCategory,
  PlaceholderConfig,
  PlaceholderImage,
} from './types';
import {
  createGradientDef,
  createRadialGradientDef,
  createPatternDef,
  createNoiseDef,
  createGeometricShapes,
} from './placeholder-patterns';
import {
  buildScreenshotDashboard,
  buildScreenshotTable,
  buildScreenshotChat,
  buildScreenshotEditor,
  buildScreenshotSettings,
  buildScreenshotLanding,
} from './placeholder-screenshots';

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#e2e8f0', '#f8fafc'];

const CATEGORY_DEFAULTS: Record<PlaceholderCategory, { w: number; h: number; label: string; usage: string; ratio: string }> = {
  hero: { w: 1200, h: 600, label: 'Hero Section', usage: 'Use as hero section background or banner image at 1200x600.', ratio: '2:1' },
  avatar: { w: 200, h: 200, label: 'Avatar', usage: 'Use as user avatar or profile image placeholder at 200x200.', ratio: '1:1' },
  product: { w: 400, h: 400, label: 'Product Image', usage: 'Use as product photo placeholder in cards or grids at 400x400.', ratio: '1:1' },
  chart: { w: 600, h: 400, label: 'Chart Placeholder', usage: 'Use as dashboard chart or data visualization placeholder at 600x400.', ratio: '3:2' },
  team: { w: 800, h: 400, label: 'Team Section', usage: 'Use as team photo or about-us section placeholder at 800x400.', ratio: '2:1' },
  background: { w: 1920, h: 1080, label: 'Background', usage: 'Use as full-page background image or texture at 1920x1080.', ratio: '16:9' },
  pattern: { w: 400, h: 400, label: 'Pattern Tile', usage: 'Use as repeating pattern tile for backgrounds or decorative elements at 400x400.', ratio: '1:1' },
  'icon-grid': { w: 600, h: 400, label: 'Icon Grid', usage: 'Use as feature grid or icon showcase placeholder at 600x400.', ratio: '3:2' },
  'screenshot-dashboard': { w: 1280, h: 800, label: 'Dashboard', usage: 'Use as SaaS dashboard screenshot placeholder at 1280x800.', ratio: '16:10' },
  'screenshot-table': { w: 1280, h: 800, label: 'Table View', usage: 'Use as data table screenshot placeholder at 1280x800.', ratio: '16:10' },
  'screenshot-chat': { w: 1280, h: 800, label: 'Chat', usage: 'Use as chat/messaging interface screenshot placeholder at 1280x800.', ratio: '16:10' },
  'screenshot-editor': { w: 1280, h: 800, label: 'Editor', usage: 'Use as editor/workspace screenshot placeholder at 1280x800.', ratio: '16:10' },
  'screenshot-settings': { w: 1280, h: 800, label: 'Settings', usage: 'Use as settings/form page screenshot placeholder at 1280x800.', ratio: '16:10' },
  'screenshot-landing': { w: 1280, h: 800, label: 'Landing Page', usage: 'Use as landing page screenshot placeholder at 1280x800.', ratio: '16:10' },
};

export function c(colors: string[], i: number): string {
  return colors[i % colors.length];
}

export function wrapSvg(w: number, h: number, defs: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${body}</svg>`;
}

// --- Category Builders ---

function buildHero(w: number, h: number, colors: string[], label: string): string {
  const defs = createGradientDef('bg', [c(colors, 0), c(colors, 1)], 135);
  const shapes = createGeometricShapes(colors, { w, h });
  const body = [
    `<rect width="${w}" height="${h}" fill="url(#bg)" />`,
    shapes,
    `<text x="${w / 2}" y="${h / 2 - 10}" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="48" font-weight="700" opacity="0.9">${label}</text>`,
    `<text x="${w / 2}" y="${h / 2 + 30}" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="18" opacity="0.6">1200 × 600</text>`,
  ].join('');
  return wrapSvg(w, h, defs, body);
}

function buildAvatar(w: number, h: number, colors: string[]): string {
  const defs = createRadialGradientDef('bg', [c(colors, 0), c(colors, 1)]);
  const body = [
    `<rect width="${w}" height="${h}" rx="${w / 2}" fill="url(#bg)" />`,
    `<circle cx="${w / 2}" cy="${h * 0.38}" r="${w * 0.18}" fill="white" opacity="0.8" />`,
    `<ellipse cx="${w / 2}" cy="${h * 0.82}" rx="${w * 0.3}" ry="${w * 0.22}" fill="white" opacity="0.8" />`,
  ].join('');
  return wrapSvg(w, h, defs, body);
}

function buildProduct(w: number, h: number, colors: string[], label: string): string {
  const defs = createGradientDef('bg', [c(colors, 3) || '#f1f5f9', c(colors, 4) || '#e2e8f0'], 180);
  const body = [
    `<rect width="${w}" height="${h}" fill="url(#bg)" />`,
    `<rect x="${w * 0.15}" y="${h * 0.1}" width="${w * 0.7}" height="${h * 0.65}" rx="12" fill="white" opacity="0.9" />`,
    `<rect x="${w * 0.25}" y="${h * 0.18}" width="${w * 0.5}" height="${h * 0.35}" rx="6" fill="${c(colors, 0)}" opacity="0.15" />`,
    `<rect x="${w * 0.15}" y="${h * 0.82}" width="${w * 0.45}" height="8" rx="4" fill="${c(colors, 0)}" opacity="0.2" />`,
    `<rect x="${w * 0.15}" y="${h * 0.9}" width="${w * 0.25}" height="6" rx="3" fill="${c(colors, 1)}" opacity="0.15" />`,
    `<text x="${w / 2}" y="${h * 0.4}" text-anchor="middle" fill="${c(colors, 0)}" font-family="system-ui,sans-serif" font-size="14" opacity="0.5">${label}</text>`,
  ].join('');
  return wrapSvg(w, h, defs, body);
}

function buildChart(w: number, h: number, colors: string[]): string {
  const defs = '';
  const barW = w * 0.08;
  const gap = w * 0.04;
  const startX = w * 0.12;
  const baseY = h * 0.85;
  const maxH = h * 0.6;
  const bars = [0.6, 0.8, 0.45, 0.9, 0.55, 0.7].map((ratio, i) => {
    const barH = maxH * ratio;
    const x = startX + i * (barW + gap);
    return `<rect x="${x}" y="${baseY - barH}" width="${barW}" height="${barH}" rx="4" fill="${c(colors, i)}" opacity="0.7" />`;
  });
  // Grid lines
  const gridLines = [0.2, 0.4, 0.6, 0.8].map(
    (r) => `<line x1="${w * 0.1}" y1="${baseY - maxH * r}" x2="${w * 0.9}" y2="${baseY - maxH * r}" stroke="${c(colors, 3) || '#e2e8f0'}" stroke-width="0.5" opacity="0.4" />`,
  );
  // Axes
  const body = [
    `<rect width="${w}" height="${h}" fill="#fafafa" />`,
    ...gridLines,
    `<line x1="${w * 0.1}" y1="${baseY}" x2="${w * 0.9}" y2="${baseY}" stroke="#cbd5e1" stroke-width="1" />`,
    `<line x1="${w * 0.1}" y1="${baseY - maxH}" x2="${w * 0.1}" y2="${baseY}" stroke="#cbd5e1" stroke-width="1" />`,
    ...bars,
    `<text x="${w / 2}" y="${h * 0.07}" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="14" font-weight="600">Chart Placeholder</text>`,
  ].join('');
  return wrapSvg(w, h, defs, body);
}

function buildTeam(w: number, h: number, colors: string[]): string {
  const defs = createGradientDef('bg', [c(colors, 3) || '#f1f5f9', c(colors, 4) || '#fafafa'], 180);
  const avatars = [0.2, 0.4, 0.6, 0.8].map((xRatio, i) => {
    const cx = w * xRatio;
    const cy = h * 0.4;
    const r = Math.min(w, h) * 0.12;
    return [
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c(colors, i)}" opacity="0.7" />`,
      `<circle cx="${cx}" cy="${cy - r * 0.15}" r="${r * 0.35}" fill="white" opacity="0.8" />`,
      `<ellipse cx="${cx}" cy="${cy + r * 0.55}" rx="${r * 0.5}" ry="${r * 0.35}" fill="white" opacity="0.8" />`,
      `<rect x="${cx - r * 0.6}" y="${h * 0.68}" width="${r * 1.2}" height="8" rx="4" fill="${c(colors, i)}" opacity="0.2" />`,
      `<rect x="${cx - r * 0.4}" y="${h * 0.73}" width="${r * 0.8}" height="5" rx="3" fill="${c(colors, i)}" opacity="0.12" />`,
    ].join('');
  });
  const body = [
    `<rect width="${w}" height="${h}" fill="url(#bg)" />`,
    `<text x="${w / 2}" y="${h * 0.1}" text-anchor="middle" fill="#475569" font-family="system-ui,sans-serif" font-size="16" font-weight="600">Meet the Team</text>`,
    ...avatars,
  ].join('');
  return wrapSvg(w, h, defs, body);
}

function buildBackground(w: number, h: number, colors: string[]): string {
  const gradDef = createRadialGradientDef('bg', [c(colors, 0), c(colors, 1), c(colors, 2) || c(colors, 0)]);
  const noiseDef = createNoiseDef('noise', 0.03);
  const shapes = createGeometricShapes(colors, { w, h });
  const body = [
    `<rect width="${w}" height="${h}" fill="url(#bg)" />`,
    `<rect width="${w}" height="${h}" filter="url(#noise)" opacity="0.5" />`,
    shapes,
  ].join('');
  return wrapSvg(w, h, `${gradDef}${noiseDef}`, body);
}

function buildPattern(w: number, h: number, colors: string[]): string {
  const dotsDef = createPatternDef('dots', 'dots', c(colors, 0), 24);
  const hexDef = createPatternDef('hex', 'hexagons', c(colors, 1), 36);
  const body = [
    `<rect width="${w}" height="${h}" fill="${c(colors, 3) || '#fafafa'}" />`,
    `<rect width="${w}" height="${h}" fill="url(#dots)" />`,
    `<rect width="${w}" height="${h}" fill="url(#hex)" />`,
  ].join('');
  return wrapSvg(w, h, `${dotsDef}${hexDef}`, body);
}

function buildIconGrid(w: number, h: number, colors: string[]): string {
  const cols = 4;
  const rows = 3;
  const cellW = w / (cols + 1);
  const cellH = h / (rows + 1);
  const iconSize = Math.min(cellW, cellH) * 0.5;
  const icons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = cellW * (col + 1);
      const cy = cellH * (row + 1);
      const i = row * cols + col;
      icons.push(
        `<rect x="${cx - iconSize / 2}" y="${cy - iconSize / 2}" width="${iconSize}" height="${iconSize}" rx="${iconSize * 0.2}" fill="${c(colors, i)}" opacity="0.2" />`,
        `<rect x="${cx - iconSize * 0.2}" y="${cy - iconSize * 0.2}" width="${iconSize * 0.4}" height="${iconSize * 0.4}" rx="${iconSize * 0.08}" fill="${c(colors, i)}" opacity="0.5" />`,
      );
    }
  }
  const body = [
    `<rect width="${w}" height="${h}" fill="#fafafa" />`,
    ...icons,
  ].join('');
  return wrapSvg(w, h, '', body);
}

// --- Public API ---

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function generatePlaceholder(config: PlaceholderConfig): PlaceholderImage {
  const colors = config.colors.length > 0 ? config.colors : DEFAULT_COLORS;
  const defaults = CATEGORY_DEFAULTS[config.category];
  const w = config.width || defaults.w;
  const h = config.height || defaults.h;
  const label = config.label || defaults.label;

  let svg: string;
  switch (config.category) {
    case 'hero':
      svg = buildHero(w, h, colors, label);
      break;
    case 'avatar':
      svg = buildAvatar(w, h, colors);
      break;
    case 'product':
      svg = buildProduct(w, h, colors, label);
      break;
    case 'chart':
      svg = buildChart(w, h, colors);
      break;
    case 'team':
      svg = buildTeam(w, h, colors);
      break;
    case 'background':
      svg = buildBackground(w, h, colors);
      break;
    case 'pattern':
      svg = buildPattern(w, h, colors);
      break;
    case 'icon-grid':
      svg = buildIconGrid(w, h, colors);
      break;
    case 'screenshot-dashboard':
      svg = buildScreenshotDashboard(w, h, colors);
      break;
    case 'screenshot-table':
      svg = buildScreenshotTable(w, h, colors);
      break;
    case 'screenshot-chat':
      svg = buildScreenshotChat(w, h, colors);
      break;
    case 'screenshot-editor':
      svg = buildScreenshotEditor(w, h, colors);
      break;
    case 'screenshot-settings':
      svg = buildScreenshotSettings(w, h, colors);
      break;
    case 'screenshot-landing':
      svg = buildScreenshotLanding(w, h, colors);
      break;
  }

  return {
    id: `placeholder-${config.category}-${Date.now()}`,
    category: config.category,
    svg,
    dataUri: svgToDataUri(svg),
    width: w,
    height: h,
    metadata: {
      label: defaults.label,
      usage: defaults.usage,
      suggestedAspectRatio: defaults.ratio,
    },
  };
}

export function generatePlaceholderBundle(
  colors: string[] = DEFAULT_COLORS,
  categories?: PlaceholderCategory[],
): PlaceholderBundle {
  const cats = categories ?? (Object.keys(CATEGORY_DEFAULTS) as PlaceholderCategory[]);
  const images = cats.map((category) =>
    generatePlaceholder({
      category,
      width: CATEGORY_DEFAULTS[category].w,
      height: CATEGORY_DEFAULTS[category].h,
      colors,
    }),
  );

  return {
    images,
    manifest: {
      generatedAt: new Date().toISOString(),
      categories: cats,
      colorSource: colors[0] || 'default',
    },
  };
}
