export type SeoArtifactType =
  | 'meta-tags'
  | 'sitemap'
  | 'robots-txt'
  | 'json-ld';

export type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface SitemapPage {
  path: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: number;
}

export interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
}

export interface RobotsConfig {
  rules?: RobotsRule[];
  sitemapUrl?: string;
  crawlDelay?: number;
}

export type JsonLdType =
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'Product'
  | 'SoftwareApplication'
  | 'Review'
  | 'Article'
  | 'LocalBusiness'
  | 'Event'
  | 'Person';

export interface JsonLdEntity {
  type: JsonLdType;
  data?: Record<string, unknown>;
}

export interface SeoInput {
  siteName: string;
  siteUrl: string;
  title?: string;
  description?: string;
  locale?: string;
  ogImage?: string;
  twitterHandle?: string;
  pages?: SitemapPage[];
  robotsConfig?: RobotsConfig;
  jsonLdEntities?: JsonLdEntity[];
}

export interface SeoArtifact {
  type: SeoArtifactType;
  title: string;
  content: string;
  language: 'html' | 'xml' | 'text' | 'json';
  filename: string;
  metadata: {
    generatedAt: string;
    charCount: number;
  };
}

export interface SeoBundle {
  artifacts: SeoArtifact[];
  input: SeoInput;
}

// --- Typed data shapes for JSON-LD entities ---

export interface AddressData {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: AddressData;
  sameAs?: string[];
}

export interface WebSiteData {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}

export interface WebPageData {
  name: string;
  url: string;
  description?: string;
  breadcrumbs?: { name: string; url: string }[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQPageData {
  questions: { question: string; answer: string }[];
}

export interface ProductData {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  reviewCount?: number;
}

export interface SoftwareApplicationData {
  name: string;
  description?: string;
  operatingSystem?: string;
  applicationCategory?: string;
  price?: number;
  currency?: string;
  ratingValue?: number;
  reviewCount?: number;
}

export interface ReviewData {
  itemReviewed: string;
  author: string;
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
  reviewBody?: string;
  datePublished?: string;
}

export interface ArticleData {
  headline: string;
  description?: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  publisher?: string;
  publisherLogo?: string;
}

export interface LocalBusinessData {
  name: string;
  description?: string;
  image?: string;
  phone?: string;
  address?: AddressData;
  openingHours?: string[];
  priceRange?: string;
  geo?: { latitude: number; longitude: number };
}

export interface EventData {
  name: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  image?: string;
  performer?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'SoldOut' | 'PreOrder';
}

export interface PersonData {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: string;
  sameAs?: string[];
}

// --- Metadata registry for UI consumption ---

export const SEO_ARTIFACT_TYPES: Record<SeoArtifactType, { title: string; description: string }> = {
  'meta-tags': {
    title: 'Meta Tags',
    description: 'HTML meta tags for title, description, Open Graph, and Twitter Cards.',
  },
  'sitemap': {
    title: 'XML Sitemap',
    description: 'XML sitemap with page URLs, last modified dates, and priorities.',
  },
  'robots-txt': {
    title: 'robots.txt',
    description: 'Crawl directives for search engine bots with allow/disallow rules.',
  },
  'json-ld': {
    title: 'Schema.org JSON-LD',
    description: 'Structured data markup for rich search results and knowledge panels.',
  },
};

export const JSON_LD_TYPES: Record<JsonLdType, { title: string; description: string }> = {
  Organization: {
    title: 'Organization',
    description: 'Company or organization identity for knowledge panels.',
  },
  WebSite: {
    title: 'WebSite',
    description: 'Site-level metadata and sitelinks search box.',
  },
  WebPage: {
    title: 'WebPage',
    description: 'Individual page metadata and breadcrumbs.',
  },
  BreadcrumbList: {
    title: 'BreadcrumbList',
    description: 'Navigation breadcrumb trail for search results.',
  },
  FAQPage: {
    title: 'FAQPage',
    description: 'Frequently asked questions with expandable answers in search.',
  },
  Product: {
    title: 'Product',
    description: 'Product listings with price, availability, and reviews.',
  },
  SoftwareApplication: {
    title: 'SoftwareApplication',
    description: 'Software or app listing with ratings and pricing.',
  },
  Review: {
    title: 'Review',
    description: 'Individual review with star rating.',
  },
  Article: {
    title: 'Article',
    description: 'Blog post or news article with author and publish date.',
  },
  LocalBusiness: {
    title: 'LocalBusiness',
    description: 'Local business with address, hours, and contact info.',
  },
  Event: {
    title: 'Event',
    description: 'Event listing with dates, location, and ticket info.',
  },
  Person: {
    title: 'Person',
    description: 'Personal profile with job title and social links.',
  },
};
