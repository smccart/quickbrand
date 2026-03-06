// Types
export type {
  FontConfig,
  IconConfig,
  ColorPalette,
  ColorFillMode,
  GradientDef,
  GradientStop,
  WordStyle,
  LogoConfig,
  LogoVariation,
  LayoutDirection,
  ColorMode,
  FaviconAsset,
  FaviconBundle,
  SocialCardBundle,
  ColorHarmony,
  WcagLevel,
  ContrastResult,
  SemanticColor,
  SemanticPalette,
  PaletteExport,
  PlaceholderCategory,
  PlaceholderConfig,
  PlaceholderImage,
  PlaceholderBundle,
} from './types';

// Generator
export { generateLogos, generateLogosBatch, regenerateWithOverrides } from './generator';

// Icons
export { searchIcons, fetchIconSvg, colorizeIconSvg, getIconsForCompany } from './icons';

// Fonts
export { CURATED_FONTS, getFontUrl } from './fonts';

// Colors
export {
  PALETTE_TEMPLATES,
  assignLetterColors,
  assignMonochromeColors,
  assignWordGradients,
  assignSplitSolid,
  assignSplitDuotone,
  assignSplitGradient,
  splitBrandSegments,
  getDarkModeColors,
  semanticPaletteFromColorPalette,
  buildAccentPalettes,
} from './colors';

// Palette Generator
export {
  generateSemanticPalette,
  generatePaletteFromName,
  computeContrastRatio,
  generateShadeScale,
} from './palette-generator';

// Palette Export
export {
  generatePaletteCssVariables,
  generatePaletteTailwindConfig,
  generatePaletteTokensJson,
  bundlePaletteExport,
} from './palette-export';

// Placeholder Images
export {
  generatePlaceholder,
  generatePlaceholderBundle,
  svgToDataUri,
} from './placeholder-generator';

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
