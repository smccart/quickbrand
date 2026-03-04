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

export interface ColorPalette {
  name: string;
  iconColor: string;
  letterColors: string[];
}

export interface LogoConfig {
  companyName: string;
  font: FontConfig;
  icon: IconConfig;
  colors: ColorPalette;
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
