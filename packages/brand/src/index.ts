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

// Freepik AI Icons
export { generateFreepikIcon, generateFreepikIcons } from './freepik';

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

// Letterhead
export { generateLetterhead, letterheadFromLogo } from './letterhead';
export type { LetterheadConfig, LetterheadResult } from './letterhead';

// App Icon
export { generateAppIcon, appIconFromLogo } from './app-icon';
export type { AppIconConfig, AppIconResult, AppIconSize } from './app-icon';

// Brand Guidelines
export { generateBrandGuidelines, guidelinesFromLogo } from './brand-guidelines';
export type { BrandGuidelinesConfig, BrandGuidelinesResult } from './brand-guidelines';

// Email Signature
export { generateEmailSignature, emailSignatureFromLogo } from './email-signature';
export type { EmailSignatureConfig, EmailSignatureResult } from './email-signature';

// Design Tokens
export {
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateFontCss,
  generateFontLinkTag,
  generateTailwindFont,
} from './design-tokens';
