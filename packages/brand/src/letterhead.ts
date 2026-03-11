import type { LogoConfig } from './types';

export interface LetterheadConfig {
  companyName: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  colors: {
    primary: string;
    secondary?: string;
    text?: string;
  };
  font: {
    family: string;
    category: string;
  };
  iconSvg?: string;
}

export interface LetterheadResult {
  svg: string;
  headerHtml: string;
  footerHtml: string;
  printCss: string;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function generateLetterhead(config: LetterheadConfig): LetterheadResult {
  const {
    companyName,
    tagline,
    address,
    phone,
    email,
    website,
    colors,
    font,
    iconSvg,
  } = config;
  const primary = colors.primary;
  const secondary = colors.secondary || colors.primary;
  const textColor = colors.text || '#333333';

  // SVG letterhead template (US Letter: 8.5" x 11" at 96 DPI = 816 x 1056)
  const width = 816;
  const height = 1056;
  const margin = 72; // 0.75"

  const svgParts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    `<rect width="${width}" height="${height}" fill="white"/>`,
    // Top accent bar
    `<rect x="0" y="0" width="${width}" height="6" fill="${primary}"/>`,
    // Header area
    `<g transform="translate(${margin}, 40)">`,
  ];

  // Icon if provided
  let logoOffset = 0;
  if (iconSvg) {
    svgParts.push(`<g transform="translate(0, 0) scale(0.5)">${iconSvg}</g>`);
    logoOffset = 40;
  }

  // Company name
  svgParts.push(
    `<text x="${logoOffset}" y="28" font-family="${escapeXml(font.family)}, ${font.category}" font-size="24" font-weight="700" fill="${primary}">${escapeXml(companyName)}</text>`,
  );

  // Tagline
  if (tagline) {
    svgParts.push(
      `<text x="${logoOffset}" y="46" font-family="${escapeXml(font.family)}, ${font.category}" font-size="11" fill="${textColor}" opacity="0.7">${escapeXml(tagline)}</text>`,
    );
  }

  // Contact info (right-aligned)
  const contactLines: string[] = [];
  if (address) contactLines.push(address);
  if (phone) contactLines.push(phone);
  if (email) contactLines.push(email);
  if (website) contactLines.push(website);

  contactLines.forEach((line, i) => {
    svgParts.push(
      `<text x="${width - margin * 2}" y="${18 + i * 16}" font-family="${escapeXml(font.family)}, ${font.category}" font-size="10" fill="${textColor}" text-anchor="end" opacity="0.6">${escapeXml(line)}</text>`,
    );
  });

  svgParts.push('</g>');

  // Divider line
  svgParts.push(
    `<line x1="${margin}" y1="100" x2="${width - margin}" y2="100" stroke="${primary}" stroke-width="1" opacity="0.3"/>`,
  );

  // Footer area
  svgParts.push(
    `<line x1="${margin}" y1="${height - 80}" x2="${width - margin}" y2="${height - 80}" stroke="${primary}" stroke-width="0.5" opacity="0.2"/>`,
    `<text x="${width / 2}" y="${height - 55}" font-family="${escapeXml(font.family)}, ${font.category}" font-size="9" fill="${textColor}" text-anchor="middle" opacity="0.5">${escapeXml(companyName)}${website ? ` · ${escapeXml(website)}` : ''}${email ? ` · ${escapeXml(email)}` : ''}</text>`,
    // Bottom accent bar
    `<rect x="0" y="${height - 6}" width="${width}" height="6" fill="${primary}"/>`,
  );

  svgParts.push('</svg>');

  // HTML header snippet
  const headerHtml = `<header style="border-bottom: 2px solid ${primary}; padding: 24px 0; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start;">
  <div>
    <h1 style="font-family: '${font.family}', ${font.category}; font-size: 24px; font-weight: 700; color: ${primary}; margin: 0;">${escapeXml(companyName)}</h1>
    ${tagline ? `<p style="font-family: '${font.family}', ${font.category}; font-size: 12px; color: ${textColor}; opacity: 0.7; margin: 4px 0 0;">${escapeXml(tagline)}</p>` : ''}
  </div>
  <div style="font-family: '${font.family}', ${font.category}; font-size: 11px; color: ${textColor}; opacity: 0.6; text-align: right;">
    ${contactLines.map(l => `<div>${escapeXml(l)}</div>`).join('\n    ')}
  </div>
</header>`;

  // HTML footer snippet
  const footerHtml = `<footer style="border-top: 1px solid ${primary}33; padding: 16px 0; margin-top: 48px; text-align: center;">
  <p style="font-family: '${font.family}', ${font.category}; font-size: 10px; color: ${textColor}; opacity: 0.5; margin: 0;">
    ${escapeXml(companyName)}${website ? ` &middot; ${escapeXml(website)}` : ''}${email ? ` &middot; ${escapeXml(email)}` : ''}
  </p>
</footer>`;

  // Print CSS
  const printCss = `@media print {
  @page {
    size: letter;
    margin: 0.75in 0.75in 1in;
  }

  .letterhead-header {
    border-bottom: 2px solid ${primary};
    padding-bottom: 16px;
    margin-bottom: 24px;
  }

  .letterhead-header h1 {
    font-family: '${font.family}', ${font.category};
    font-size: 20pt;
    font-weight: 700;
    color: ${primary};
  }

  .letterhead-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 0.5pt solid ${primary}33;
    padding-top: 8pt;
    text-align: center;
    font-family: '${font.family}', ${font.category};
    font-size: 8pt;
    color: ${textColor};
    opacity: 0.5;
  }

  body {
    font-family: '${font.family}', ${font.category};
    color: ${textColor};
    font-size: 11pt;
    line-height: 1.6;
  }
}`;

  return {
    svg: svgParts.join('\n'),
    headerHtml,
    footerHtml,
    printCss,
  };
}

export function letterheadFromLogo(config: LogoConfig, extras?: Partial<LetterheadConfig>): LetterheadResult {
  return generateLetterhead({
    companyName: config.companyName,
    colors: {
      primary: config.colors.iconColor,
      secondary: config.colors.letterColors[0],
    },
    font: {
      family: config.font.family,
      category: config.font.category,
    },
    iconSvg: config.icon.svg,
    ...extras,
  });
}
