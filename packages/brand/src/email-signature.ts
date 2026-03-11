import type { LogoConfig } from './types';

export interface EmailSignatureConfig {
  name: string;
  title?: string;
  companyName: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  colors: {
    primary: string;
    text?: string;
    secondaryText?: string;
  };
  font: {
    family: string;
    category: string;
  };
  iconSvg?: string;
  photoUrl?: string;
}

export interface EmailSignatureResult {
  html: string;
  plainText: string;
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function generateEmailSignature(config: EmailSignatureConfig): EmailSignatureResult {
  const {
    name,
    title,
    companyName,
    email,
    phone,
    website,
    linkedin,
    twitter,
    colors,
    font,
    photoUrl,
  } = config;
  const primary = colors.primary;
  const textColor = colors.text || '#333333';
  const secondaryText = colors.secondaryText || '#666666';
  const fontStack = `'${font.family}', ${font.category}, Arial, sans-serif`;

  // Build HTML email signature (table-based for email client compatibility)
  const rows: string[] = [];

  // Name row
  rows.push(
    `<tr><td style="padding: 0 0 2px 0;">`,
    `<span style="font-family: ${fontStack}; font-size: 16px; font-weight: 700; color: ${textColor};">${esc(name)}</span>`,
    `</td></tr>`,
  );

  // Title & company row
  if (title || companyName) {
    const parts: string[] = [];
    if (title) parts.push(esc(title));
    parts.push(`<span style="color: ${primary}; font-weight: 600;">${esc(companyName)}</span>`);
    rows.push(
      `<tr><td style="padding: 0 0 8px 0;">`,
      `<span style="font-family: ${fontStack}; font-size: 13px; color: ${secondaryText};">${parts.join(' · ')}</span>`,
      `</td></tr>`,
    );
  }

  // Divider
  rows.push(
    `<tr><td style="padding: 0 0 8px 0;">`,
    `<div style="width: 40px; height: 2px; background-color: ${primary};"></div>`,
    `</td></tr>`,
  );

  // Contact info
  const contactParts: string[] = [];
  if (email) {
    contactParts.push(`<a href="mailto:${esc(email)}" style="color: ${primary}; text-decoration: none;">${esc(email)}</a>`);
  }
  if (phone) {
    contactParts.push(`<a href="tel:${esc(phone.replace(/\s/g, ''))}" style="color: ${textColor}; text-decoration: none;">${esc(phone)}</a>`);
  }
  if (website) {
    const displayUrl = website.replace(/^https?:\/\//, '');
    contactParts.push(`<a href="${esc(website)}" style="color: ${primary}; text-decoration: none;">${esc(displayUrl)}</a>`);
  }

  if (contactParts.length) {
    rows.push(
      `<tr><td style="padding: 0 0 4px 0;">`,
      `<span style="font-family: ${fontStack}; font-size: 12px; color: ${secondaryText};">${contactParts.join(' &nbsp;·&nbsp; ')}</span>`,
      `</td></tr>`,
    );
  }

  // Social links
  const socialParts: string[] = [];
  if (linkedin) {
    socialParts.push(`<a href="${esc(linkedin)}" style="color: ${primary}; text-decoration: none; font-size: 12px;">LinkedIn</a>`);
  }
  if (twitter) {
    const handle = twitter.startsWith('@') ? twitter : `@${twitter}`;
    const twitterUrl = `https://twitter.com/${handle.slice(1)}`;
    socialParts.push(`<a href="${esc(twitterUrl)}" style="color: ${primary}; text-decoration: none; font-size: 12px;">${esc(handle)}</a>`);
  }

  if (socialParts.length) {
    rows.push(
      `<tr><td style="padding: 2px 0 0 0;">`,
      `<span style="font-family: ${fontStack}; font-size: 12px; color: ${secondaryText};">${socialParts.join(' &nbsp;·&nbsp; ')}</span>`,
      `</td></tr>`,
    );
  }

  // Assemble with optional photo
  let html: string;
  if (photoUrl) {
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.4;">
<tr>
<td style="vertical-align: top; padding-right: 14px;">
<img src="${esc(photoUrl)}" width="64" height="64" alt="${esc(name)}" style="border-radius: 50%; display: block;" />
</td>
<td style="vertical-align: top;">
<table cellpadding="0" cellspacing="0" border="0">
${rows.join('\n')}
</table>
</td>
</tr>
</table>`;
  } else {
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; line-height: 1.4;">
${rows.join('\n')}
</table>`;
  }

  // Plain text version
  const plainParts: string[] = [name];
  if (title) plainParts.push(`${title} · ${companyName}`);
  else plainParts.push(companyName);
  plainParts.push('---');
  if (email) plainParts.push(email);
  if (phone) plainParts.push(phone);
  if (website) plainParts.push(website);
  if (linkedin) plainParts.push(linkedin);
  if (twitter) plainParts.push(twitter);

  return {
    html,
    plainText: plainParts.join('\n'),
  };
}

export function emailSignatureFromLogo(config: LogoConfig, person: { name: string; title?: string; email?: string; phone?: string; website?: string; linkedin?: string; twitter?: string; photoUrl?: string }): EmailSignatureResult {
  return generateEmailSignature({
    ...person,
    companyName: config.companyName,
    colors: {
      primary: config.colors.iconColor,
      text: '#333333',
      secondaryText: '#666666',
    },
    font: {
      family: config.font.family,
      category: config.font.category,
    },
    iconSvg: config.icon.svg,
  });
}
