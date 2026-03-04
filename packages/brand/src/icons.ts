import type { IconConfig } from './types';

interface IconifySearchResponse {
  icons: string[];
  total: number;
}

export async function searchIcons(query: string, limit = 30): Promise<IconConfig[]> {
  const url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: IconifySearchResponse = await res.json();
  return data.icons.map((id) => ({
    id,
    name: id.split(':')[1] ?? id,
    svg: '',
  }));
}

export async function fetchIconSvg(iconId: string): Promise<string> {
  const [prefix, name] = iconId.split(':');
  if (!prefix || !name) return '';
  const url = `https://api.iconify.design/${prefix}/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) return '';
  return res.text();
}

export function colorizeIconSvg(svg: string, color: string): string {
  // Replace currentColor and any fill/stroke colors with the target color
  let result = svg.replace(/currentColor/g, color);
  // Set fill on the root svg if not already set
  if (!result.includes('fill=')) {
    result = result.replace('<svg', `<svg fill="${color}"`);
  }
  return result;
}

// Pre-defined icon sets for common business categories
const FALLBACK_ICONS = [
  'mdi:lightning-bolt',
  'mdi:rocket-launch',
  'mdi:star-four-points',
  'mdi:diamond-stone',
  'mdi:hexagon',
  'mdi:shield-check',
  'mdi:cube-outline',
  'mdi:leaf',
  'mdi:fire',
  'mdi:flash',
];

export async function getIconsForCompany(companyName: string): Promise<IconConfig[]> {
  const words = companyName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  // Search for icons based on company name words
  const searchPromises = words.map((word) => searchIcons(word, 10));
  const results = await Promise.all(searchPromises);
  const allIcons = results.flat();

  // Deduplicate by id
  const seen = new Set<string>();
  const unique = allIcons.filter((icon) => {
    if (seen.has(icon.id)) return false;
    seen.add(icon.id);
    return true;
  });

  // If we don't have enough icons, add fallbacks
  if (unique.length < 6) {
    for (const id of FALLBACK_ICONS) {
      if (!seen.has(id) && unique.length < 6) {
        unique.push({ id, name: id.split(':')[1] ?? id, svg: '' });
        seen.add(id);
      }
    }
  }

  return unique.slice(0, 8);
}
