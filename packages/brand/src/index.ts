// Types
export type {
  FontConfig,
  IconConfig,
  ColorPalette,
  LogoConfig,
  LogoVariation,
  LayoutDirection,
  ColorMode,
  FaviconAsset,
  FaviconBundle,
  SocialCardBundle,
} from './types';

// Generator
export { generateLogos, regenerateWithOverrides } from './generator';

// Icons
export { searchIcons, fetchIconSvg, colorizeIconSvg, getIconsForCompany } from './icons';

// Fonts
export { CURATED_FONTS, getFontUrl } from './fonts';

// Colors
export {
  PALETTE_TEMPLATES,
  assignLetterColors,
  assignMonochromeColors,
  getDarkModeColors,
} from './colors';

// SVG
export { buildPreviewSvg } from './svg-builder';
export { buildExportSvg, extractSvgContent, getViewBox } from './svg-export';

// Favicon
export { buildFaviconSvg, buildIcoFile, generateManifest, generateHtmlSnippet } from './favicon';

// Social Cards (meta tags only — rendering is browser-dependent)
export { generateOgMetaTags } from './social-card';

// Design Tokens
export {
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateFontCss,
  generateFontLinkTag,
  generateTailwindFont,
} from './design-tokens';
