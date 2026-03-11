import type { IconConfig } from './types';
import { generateFreepikIcons } from './freepik';

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

export async function fetchIconSvg(iconId: string, preloadedSvg?: string): Promise<string> {
  // If SVG is already available (e.g. Freepik AI icons), return it directly
  if (preloadedSvg) return preloadedSvg;

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

// Keyword expansion: maps common words/stems to more searchable icon terms
const KEYWORD_EXPANSIONS: Record<string, string[]> = {
  fetch: ['download', 'arrow-down', 'retrieve', 'dog', 'inbox'],
  kit: ['toolbox', 'package', 'box', 'wrench', 'briefcase'],
  code: ['code', 'terminal', 'brackets', 'developer', 'laptop-code'],
  dev: ['code', 'terminal', 'developer', 'laptop'],
  app: ['application', 'grid', 'smartphone', 'window'],
  web: ['globe', 'world', 'browser', 'network'],
  cloud: ['cloud', 'server', 'upload', 'storage'],
  data: ['database', 'chart', 'analytics', 'server'],
  ai: ['brain', 'robot', 'artificial-intelligence', 'neural'],
  smart: ['brain', 'lightbulb', 'sparkle', 'magic'],
  fast: ['rocket', 'lightning', 'speed', 'bolt'],
  quick: ['rocket', 'lightning', 'speed', 'timer'],
  shop: ['store', 'cart', 'shopping', 'bag'],
  store: ['store', 'shopping', 'cart', 'bag'],
  pay: ['credit-card', 'wallet', 'payment', 'money'],
  health: ['heart', 'medical', 'hospital', 'stethoscope'],
  med: ['medical', 'hospital', 'stethoscope', 'pill'],
  learn: ['book', 'school', 'graduation', 'academic'],
  edu: ['book', 'school', 'graduation', 'academic'],
  music: ['music', 'headphones', 'note', 'microphone'],
  play: ['play', 'game', 'controller', 'dice'],
  food: ['restaurant', 'utensils', 'chef', 'pizza'],
  travel: ['airplane', 'map', 'compass', 'suitcase'],
  home: ['house', 'home', 'building', 'door'],
  green: ['leaf', 'tree', 'plant', 'eco'],
  eco: ['leaf', 'recycle', 'earth', 'plant'],
  secure: ['shield', 'lock', 'key', 'guard'],
  safe: ['shield', 'lock', 'safe', 'guard'],
  social: ['people', 'chat', 'message', 'group'],
  chat: ['message', 'chat', 'bubble', 'comment'],
  mail: ['email', 'envelope', 'inbox', 'send'],
  photo: ['camera', 'image', 'picture', 'aperture'],
  design: ['palette', 'brush', 'pen', 'layout'],
  build: ['hammer', 'wrench', 'construction', 'gear'],
  lab: ['flask', 'experiment', 'science', 'beaker'],
  star: ['star', 'sparkle', 'award', 'premium'],
  flow: ['wave', 'water', 'stream', 'wind'],
  link: ['chain', 'link', 'connect', 'anchor'],
  hub: ['network', 'hub', 'connection', 'node'],
  sync: ['sync', 'refresh', 'arrows', 'cycle'],
  pixel: ['grid', 'pixel', 'square', 'mosaic'],
  bit: ['binary', 'chip', 'circuit', 'processor'],
  fire: ['fire', 'flame', 'hot', 'blaze'],
  nova: ['star', 'sparkle', 'explosion', 'supernova'],
  bolt: ['lightning', 'bolt', 'electric', 'power'],
  zen: ['lotus', 'meditation', 'peace', 'circle'],
  pro: ['crown', 'award', 'trophy', 'diamond'],
  max: ['arrow-up', 'expand', 'maximize', 'power'],
};

// Diverse abstract/geometric icons for backfilling — no single icon dominates
const GENERIC_ICONS = [
  'mdi:hexagon-outline',
  'mdi:diamond-stone',
  'mdi:star-four-points',
  'mdi:cube-outline',
  'mdi:compass',
  'mdi:infinity',
  'mdi:atom',
  'mdi:shape',
  'mdi:triangle-outline',
  'mdi:circle-slice-8',
  'mdi:creation',
  'mdi:crown',
  'mdi:shield-check',
  'mdi:leaf',
  'mdi:rocket-launch',
  'mdi:lightning-bolt',
  'mdi:fire',
  'mdi:star-circle',
  'mdi:flash',
  'mdi:pentagon-outline',
];

/**
 * Expand a brand name into semantically relevant search keywords.
 * Returns them in priority order: exact words first, then expanded terms.
 */
function expandBrandKeywords(companyName: string): string[] {
  const raw = companyName.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = raw.split(/\s+/).filter((w) => w.length > 1);
  const keywords: string[] = [];
  const seen = new Set<string>();

  const add = (kw: string) => {
    if (!seen.has(kw)) { seen.add(kw); keywords.push(kw); }
  };

  // Add the full name as a search term
  if (words.length > 1) add(raw);

  // For each word, add it + any expansions
  for (const word of words) {
    add(word);

    // Check exact match in expansions
    if (KEYWORD_EXPANSIONS[word]) {
      for (const exp of KEYWORD_EXPANSIONS[word]) add(exp);
    }

    // Check if any expansion key is a substring of the word (e.g., "fetchkit" contains "fetch" and "kit")
    for (const [key, expansions] of Object.entries(KEYWORD_EXPANSIONS)) {
      if (key !== word && word.includes(key) && key.length >= 3) {
        for (const exp of expansions) add(exp);
      }
    }
  }

  return keywords;
}

export async function getIconsForCompany(
  companyName: string,
  freepikApiKey?: string,
): Promise<IconConfig[]> {
  const keywords = expandBrandKeywords(companyName);

  // Search Iconify for each keyword (more relevant keywords first, fewer results per query)
  const iconifyPromise = (async () => {
    // Primary keywords (first 4) get more results; secondary get fewer
    const searchPromises = keywords.map((kw, i) =>
      searchIcons(kw, i < 4 ? 15 : 8),
    );
    const results = await Promise.all(searchPromises);

    // Score icons by which keyword tier they came from (lower index = higher relevance)
    const scored = new Map<string, { icon: IconConfig; score: number }>();
    for (let tier = 0; tier < results.length; tier++) {
      for (const icon of results[tier]) {
        if (!scored.has(icon.id)) {
          scored.set(icon.id, { icon, score: tier });
        }
      }
    }

    // Sort by relevance score (lower = better)
    return [...scored.values()]
      .sort((a, b) => a.score - b.score)
      .map((s) => s.icon);
  })();

  // Generate AI icons if Freepik key is available
  const freepikPromise = freepikApiKey
    ? generateFreepikIcons(companyName, freepikApiKey).catch(() => [] as IconConfig[])
    : Promise.resolve([] as IconConfig[]);

  const [iconifyIcons, aiIcons] = await Promise.all([iconifyPromise, freepikPromise]);

  // AI icons first, then relevance-ranked Iconify results
  const seen = new Set<string>();
  const unique: IconConfig[] = [];

  for (const icon of [...aiIcons, ...iconifyIcons]) {
    if (seen.has(icon.id)) continue;
    seen.add(icon.id);
    unique.push(icon);
  }

  // Always backfill with generic abstract icons so there's variety
  for (const id of GENERIC_ICONS) {
    if (!seen.has(id) && unique.length < 20) {
      unique.push({ id, name: id.split(':')[1] ?? id, svg: '' });
      seen.add(id);
    }
  }

  return unique.slice(0, 20);
}
