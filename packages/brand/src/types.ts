export interface FontConfig {
  family: string;
  weight: number;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
}

export interface IconConfig {
  id: string;
  name: string;
  svg: string;
}

// Gradient support
export interface GradientStop {
  color: string;
  offset: number; // 0–1
}

export interface GradientDef {
  id: string;
  stops: GradientStop[];
  angle: number; // degrees
  type: 'linear' | 'radial';
}

export type ColorFillMode = 'solid' | 'gradient';

export interface ColorPalette {
  name: string;
  iconColor: string;
  letterColors: string[];
  fillMode?: ColorFillMode;
  gradients?: GradientDef[]; // one per word
  iconGradient?: GradientDef;
}

// Word-level sizing/weight differentiation
export interface WordStyle {
  fontSize: number; // relative multiplier (1.0 = base)
  fontWeight: number;
  letterSpacing?: number; // em units
}

export interface LogoConfig {
  companyName: string;
  font: FontConfig;
  icon: IconConfig;
  colors: ColorPalette;
  wordStyles?: WordStyle[];
}

export interface LogoVariation {
  id: string;
  config: LogoConfig;
}

export type LayoutDirection = 'horizontal' | 'vertical';
export type ColorMode = 'light' | 'dark';

export interface FaviconAsset {
  filename: string;
  blob: Blob;
  mimeType: string;
  size?: number;
}

export interface FaviconBundle {
  assets: FaviconAsset[];
  htmlSnippet: string;
  manifestJson: string;
}

export interface SocialCardBundle {
  light: Blob;
  dark: Blob;
  metaTags: string;
}

// --- Color Palette Generator ---

export type ColorHarmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochromatic';

export type WcagLevel = 'AAA' | 'AA' | 'fail';

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  levelNormal: WcagLevel;
  levelLarge: WcagLevel;
}

export interface SemanticColor {
  hex: string;
  name: string;
  role: string;
  contrastOnWhite: ContrastResult;
  contrastOnBlack: ContrastResult;
  shades: Record<string, string>;
}

export interface SemanticPalette {
  name: string;
  harmony: ColorHarmony;
  seedColor: string;
  colors: {
    primary: SemanticColor;
    secondary: SemanticColor;
    surface: SemanticColor;
    error: SemanticColor;
    warning: SemanticColor;
    success: SemanticColor;
    info: SemanticColor;
  };
  light: Record<string, string>;
  dark: Record<string, string>;
  metadata: {
    generatedAt: string;
    guidelines: string[];
  };
}

export interface PaletteExport {
  cssVariables: string;
  tailwindConfig: string;
  tokensJson: string;
  palette: SemanticPalette;
}

// --- Placeholder Images ---

export type PlaceholderCategory =
  | 'hero'
  | 'avatar'
  | 'product'
  | 'chart'
  | 'team'
  | 'background'
  | 'pattern'
  | 'icon-grid'
  | 'screenshot-dashboard'
  | 'screenshot-table'
  | 'screenshot-chat'
  | 'screenshot-editor'
  | 'screenshot-settings'
  | 'screenshot-landing';

export interface PlaceholderConfig {
  category: PlaceholderCategory;
  width: number;
  height: number;
  colors: string[];
  label?: string;
}

export interface PlaceholderImage {
  id: string;
  category: PlaceholderCategory;
  svg: string;
  dataUri: string;
  width: number;
  height: number;
  metadata: {
    label: string;
    usage: string;
    suggestedAspectRatio: string;
  };
}

export interface PlaceholderBundle {
  images: PlaceholderImage[];
  manifest: {
    generatedAt: string;
    categories: PlaceholderCategory[];
    colorSource: string;
  };
}
