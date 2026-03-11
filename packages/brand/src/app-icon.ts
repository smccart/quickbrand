import type { LogoConfig } from './types';

export interface AppIconConfig {
  iconSvg: string;
  iconColor: string;
  backgroundColor?: string;
  borderRadius?: number; // 0-50 (percentage)
  padding?: number; // 0-50 (percentage)
  gradient?: {
    from: string;
    to: string;
    angle?: number;
  };
}

export interface AppIconResult {
  svg: string;
  sizes: AppIconSize[];
  manifestEntry: string;
  htmlSnippet: string;
}

export interface AppIconSize {
  size: number;
  svg: string;
  filename: string;
}

const STANDARD_SIZES = [16, 32, 48, 64, 128, 192, 256, 512, 1024];

function buildIconSvg(config: AppIconConfig, size: number): string {
  const {
    iconSvg,
    iconColor,
    backgroundColor = '#ffffff',
    borderRadius = 22,
    padding = 20,
    gradient,
  } = config;

  const radius = (borderRadius / 100) * size;
  const pad = (padding / 100) * size;
  const iconSize = size - pad * 2;

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
  ];

  if (gradient) {
    const angle = gradient.angle ?? 135;
    const rad = (angle * Math.PI) / 180;
    const x1 = 50 - Math.cos(rad) * 50;
    const y1 = 50 - Math.sin(rad) * 50;
    const x2 = 50 + Math.cos(rad) * 50;
    const y2 = 50 + Math.sin(rad) * 50;
    parts.push(
      '<defs>',
      `<linearGradient id="bg" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">`,
      `<stop offset="0%" stop-color="${gradient.from}"/>`,
      `<stop offset="100%" stop-color="${gradient.to}"/>`,
      '</linearGradient>',
      '</defs>',
      `<rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>`,
    );
  } else {
    parts.push(
      `<rect width="${size}" height="${size}" rx="${radius}" fill="${backgroundColor}"/>`,
    );
  }

  // Embed icon centered with color
  parts.push(
    `<g transform="translate(${pad}, ${pad})">`,
    `<g transform="scale(${iconSize / 24})" fill="${iconColor}">`,
    // Strip outer svg tags from iconSvg
    iconSvg.replace(/<\/?svg[^>]*>/g, ''),
    '</g>',
    '</g>',
    '</svg>',
  );

  return parts.join('\n');
}

export function generateAppIcon(config: AppIconConfig): AppIconResult {
  const sizes: AppIconSize[] = STANDARD_SIZES.map((size) => ({
    size,
    svg: buildIconSvg(config, size),
    filename: `app-icon-${size}x${size}.svg`,
  }));

  const svg = buildIconSvg(config, 512);

  const manifestEntry = JSON.stringify({
    icons: STANDARD_SIZES.filter(s => s >= 48).map(size => ({
      src: `/icons/app-icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: size >= 192 ? 'any maskable' : 'any',
    })),
  }, null, 2);

  const htmlSnippet = [
    '<link rel="icon" type="image/svg+xml" href="/icons/app-icon.svg" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/icons/app-icon-32x32.png" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="/icons/app-icon-16x16.png" />',
    '<link rel="apple-touch-icon" sizes="192x192" href="/icons/app-icon-192x192.png" />',
    '<link rel="apple-touch-icon" sizes="512x512" href="/icons/app-icon-512x512.png" />',
  ].join('\n');

  return { svg, sizes, manifestEntry, htmlSnippet };
}

export function appIconFromLogo(config: LogoConfig, options?: Partial<AppIconConfig>): AppIconResult {
  return generateAppIcon({
    iconSvg: config.icon.svg,
    iconColor: '#ffffff',
    backgroundColor: config.colors.iconColor,
    borderRadius: 22,
    padding: 20,
    ...options,
  });
}
