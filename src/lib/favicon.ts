import type { LogoConfig, FaviconAsset, FaviconBundle } from './types';
import { fetchIconSvg, colorizeIconSvg } from './icons';

const PNG_SIZES = [16, 32, 48, 180, 192, 512] as const;

// Duplicated from svg-export.ts to avoid coupling
function extractSvgContent(svg: string): string {
  return svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
}

function getViewBox(svg: string): string {
  const match = svg.match(/viewBox="([^"]+)"/);
  return match ? match[1] : '0 0 24 24';
}

export function buildFaviconSvg(iconSvg: string, iconColor: string): string {
  const colorized = colorizeIconSvg(iconSvg, iconColor);
  const inner = extractSvgContent(colorized);
  const viewBox = getViewBox(colorized);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <svg viewBox="${viewBox}" width="64" height="64">
    ${inner}
  </svg>
</svg>`;
}

export function renderSvgToPng(svgString: string, size: number): Promise<Blob> {
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

export async function buildIcoFile(pngBlobs: Map<number, Blob>): Promise<Blob> {
  const sizes = [16, 32, 48];
  const pngBuffers: ArrayBuffer[] = [];

  for (const size of sizes) {
    const blob = pngBlobs.get(size);
    if (!blob) throw new Error(`Missing PNG for size ${size}`);
    pngBuffers.push(await blob.arrayBuffer());
  }

  // ICO header: 6 bytes
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * sizes.length;
  let dataOffset = headerSize + dirSize;

  // Calculate total size
  const totalSize = dataOffset + pngBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const ico = new ArrayBuffer(totalSize);
  const view = new DataView(ico);

  // Header
  view.setUint16(0, 0, true);            // reserved
  view.setUint16(2, 1, true);            // type: 1 = ICO
  view.setUint16(4, sizes.length, true); // image count

  // Directory entries + data
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const pngData = pngBuffers[i];
    const entryOffset = headerSize + i * dirEntrySize;

    view.setUint8(entryOffset, size < 256 ? size : 0);     // width
    view.setUint8(entryOffset + 1, size < 256 ? size : 0); // height
    view.setUint8(entryOffset + 2, 0);                     // color palette
    view.setUint8(entryOffset + 3, 0);                     // reserved
    view.setUint16(entryOffset + 4, 1, true);              // color planes
    view.setUint16(entryOffset + 6, 32, true);             // bits per pixel
    view.setUint32(entryOffset + 8, pngData.byteLength, true);  // data size
    view.setUint32(entryOffset + 12, dataOffset, true);    // data offset

    // Copy PNG data
    new Uint8Array(ico, dataOffset, pngData.byteLength).set(new Uint8Array(pngData));
    dataOffset += pngData.byteLength;
  }

  return new Blob([ico], { type: 'image/x-icon' });
}

export function generateManifest(companyName: string): string {
  return JSON.stringify({
    name: companyName,
    short_name: companyName,
    icons: [
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  }, null, 2);
}

export function generateHtmlSnippet(): string {
  return `<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#ffffff">`;
}

function pngFilename(size: number): string {
  if (size === 180) return 'apple-touch-icon.png';
  return `favicon-${size}.png`;
}

export async function generateFaviconBundle(config: LogoConfig): Promise<FaviconBundle> {
  // Fetch and colorize icon
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

  // Build ICO from 16/32/48
  const icoBlob = await buildIcoFile(pngMap);

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
