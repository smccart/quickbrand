import type { LogoConfig, ColorMode, SocialCardBundle } from './types';
import { fetchIconSvg } from './icons';
import { getDarkModeColors } from './colors';
import { loadFontForPreview } from './fonts';
import { buildFaviconSvg } from './favicon';

const WIDTH = 1200;
const HEIGHT = 630;
const ICON_SIZE = 120;
const FONT_SIZE = 56;
const ACCENT_BAR_WIDTH = 200;
const ACCENT_BAR_HEIGHT = 4;
const DARK_BG = '#1a1a2e';

function renderSvgToImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load SVG as image'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

export async function renderSocialCard(
  config: LogoConfig,
  mode: ColorMode,
): Promise<Blob> {
  const colors = mode === 'dark' ? getDarkModeColors(config.colors) : config.colors;
  const isDark = mode === 'dark';

  // Ensure font is loaded for canvas rendering
  loadFontForPreview(config.font);

  // Fetch and prepare icon
  const rawSvg = await fetchIconSvg(config.icon.id);
  if (!rawSvg) throw new Error('Failed to fetch icon SVG');

  const iconSvg = buildFaviconSvg(rawSvg, colors.iconColor);
  const iconImg = await renderSvgToImage(iconSvg);

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background
  ctx.fillStyle = isDark ? DARK_BG : '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Icon — centered horizontally, positioned in upper area
  const iconX = (WIDTH - ICON_SIZE) / 2;
  const iconY = HEIGHT * 0.22;
  ctx.drawImage(iconImg, iconX, iconY, ICON_SIZE, ICON_SIZE);

  // Company name — centered below icon
  const textY = iconY + ICON_SIZE + FONT_SIZE + 24;
  ctx.font = `${config.font.weight} ${FONT_SIZE}px '${config.font.family}', ${config.font.category}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Draw per-letter colors
  const text = config.companyName;
  const textMetrics = ctx.measureText(text);
  const totalWidth = textMetrics.width;
  let cursorX = (WIDTH - totalWidth) / 2;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const color = colors.letterColors[i] ?? colors.iconColor;
    ctx.fillStyle = color === 'transparent' ? (isDark ? '#ffffff' : '#000000') : color;
    ctx.textAlign = 'left';
    ctx.fillText(char, cursorX, textY);
    cursorX += ctx.measureText(char).width;
  }

  // Accent bar — centered below text
  const barY = textY + 24;
  ctx.fillStyle = colors.iconColor;
  ctx.fillRect((WIDTH - ACCENT_BAR_WIDTH) / 2, barY, ACCENT_BAR_WIDTH, ACCENT_BAR_HEIGHT);

  return canvasToBlob(canvas);
}

export function generateOgMetaTags(): string {
  return `<meta property="og:image" content="/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="/og-image.png">`;
}

export async function generateSocialCards(config: LogoConfig): Promise<SocialCardBundle> {
  const [light, dark] = await Promise.all([
    renderSocialCard(config, 'light'),
    renderSocialCard(config, 'dark'),
  ]);

  return {
    light,
    dark,
    metaTags: generateOgMetaTags(),
  };
}

export async function downloadSocialCardZip(
  bundle: SocialCardBundle,
  companyName: string,
): Promise<void> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  zip.file('og-image.png', bundle.light);
  zip.file('og-image-dark.png', bundle.dark);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const name = companyName.toLowerCase().replace(/\s+/g, '-');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-social-cards.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
