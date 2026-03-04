/**
 * Browser-only functions that depend on DOM/Canvas APIs.
 * These cannot run in Node.js and stay in the web app.
 */
import type { LogoConfig, LayoutDirection, ColorMode, FaviconAsset, FaviconBundle, SocialCardBundle, FontConfig } from '@fetchkit/brand';
import {
  buildExportSvg,
  buildFaviconSvg,
  buildIcoFile,
  generateManifest,
  generateHtmlSnippet,
  fetchIconSvg,
  getDarkModeColors,
  generateOgMetaTags,
} from '@fetchkit/brand';

// --- Font loading (browser) ---

const loadedFonts = new Set<string>();

export function loadFontForPreview(font: FontConfig): void {
  const key = `${font.family}:${font.weight}`;
  if (loadedFonts.has(key)) return;
  loadedFonts.add(key);

  const family = font.family.replace(/\s+/g, '+');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@${font.weight}&display=swap`;
  document.head.appendChild(link);
}

export function loadAllFonts(fonts: FontConfig[]): void {
  fonts.forEach(loadFontForPreview);
}

// --- SVG downloads (browser) ---

export async function downloadSvg(
  config: LogoConfig,
  layout: LayoutDirection,
  mode: ColorMode,
): Promise<void> {
  const svg = await buildExportSvg(config, layout, mode);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const name = config.companyName.toLowerCase().replace(/\s+/g, '-');

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-${layout}-${mode}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadAllSvgs(config: LogoConfig): Promise<void> {
  const { default: JSZip } = await import('jszip');

  const zip = new JSZip();
  const name = config.companyName.toLowerCase().replace(/\s+/g, '-');

  const [hLight, hDark, vLight, vDark] = await Promise.all([
    buildExportSvg(config, 'horizontal', 'light'),
    buildExportSvg(config, 'horizontal', 'dark'),
    buildExportSvg(config, 'vertical', 'light'),
    buildExportSvg(config, 'vertical', 'dark'),
  ]);

  zip.file(`${name}-horizontal-light.svg`, hLight);
  zip.file(`${name}-horizontal-dark.svg`, hDark);
  zip.file(`${name}-vertical-light.svg`, vLight);
  zip.file(`${name}-vertical-dark.svg`, vDark);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-logos.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Favicon rendering (browser, Canvas API) ---

const PNG_SIZES = [16, 32, 48, 180, 192, 512] as const;

function renderSvgToPng(svgString: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to load SVG as image'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  });
}

function pngFilename(size: number): string {
  if (size === 180) return 'apple-touch-icon.png';
  return `favicon-${size}.png`;
}

export async function generateFaviconBundle(config: LogoConfig): Promise<FaviconBundle> {
  const rawSvg = await fetchIconSvg(config.icon.id);
  if (!rawSvg) throw new Error('Failed to fetch icon SVG');

  const faviconSvg = buildFaviconSvg(rawSvg, config.colors.iconColor);

  // Render all PNG sizes in parallel
  const pngEntries = await Promise.all(
    PNG_SIZES.map(async (size) => {
      const blob = await renderSvgToPng(faviconSvg, size);
      return [size, blob] as const;
    }),
  );

  const pngMap = new Map(pngEntries);

  // Build ICO from 16/32/48 PNG buffers
  const icoBuffers = new Map<number, ArrayBuffer>();
  for (const size of [16, 32, 48] as const) {
    const blob = pngMap.get(size);
    if (!blob) throw new Error(`Missing PNG for size ${size}`);
    icoBuffers.set(size, await blob.arrayBuffer());
  }
  const icoBlob = buildIcoFile(icoBuffers);

  // Assemble assets
  const assets: FaviconAsset[] = [
    {
      filename: 'favicon.svg',
      blob: new Blob([faviconSvg], { type: 'image/svg+xml' }),
      mimeType: 'image/svg+xml',
    },
    {
      filename: 'favicon.ico',
      blob: icoBlob,
      mimeType: 'image/x-icon',
    },
    ...PNG_SIZES.map((size) => ({
      filename: pngFilename(size),
      blob: pngMap.get(size)!,
      mimeType: 'image/png',
      size,
    })),
  ];

  const manifestJson = generateManifest(config.companyName);
  assets.push({
    filename: 'manifest.json',
    blob: new Blob([manifestJson], { type: 'application/json' }),
    mimeType: 'application/json',
  });

  return {
    assets,
    htmlSnippet: generateHtmlSnippet(),
    manifestJson,
  };
}

export async function downloadFaviconZip(bundle: FaviconBundle, companyName: string): Promise<void> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  for (const asset of bundle.assets) {
    zip.file(asset.filename, asset.blob);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const name = companyName.toLowerCase().replace(/\s+/g, '-');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}-favicons.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Social card rendering (browser, Canvas API) ---

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
