import { colorizeIconSvg } from './icons';
import { extractSvgContent, getViewBox } from './svg-export';

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

export function buildIcoFile(pngBuffers: Map<number, ArrayBuffer>): Blob {
  const sizes = [16, 32, 48];
  const buffers: ArrayBuffer[] = [];

  for (const size of sizes) {
    const buffer = pngBuffers.get(size);
    if (!buffer) throw new Error(`Missing PNG buffer for size ${size}`);
    buffers.push(buffer);
  }

  // ICO header: 6 bytes
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * sizes.length;
  let dataOffset = headerSize + dirSize;

  // Calculate total size
  const totalSize = dataOffset + buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const ico = new ArrayBuffer(totalSize);
  const view = new DataView(ico);

  // Header
  view.setUint16(0, 0, true);            // reserved
  view.setUint16(2, 1, true);            // type: 1 = ICO
  view.setUint16(4, sizes.length, true); // image count

  // Directory entries + data
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const pngData = buffers[i];
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
