export type {
  SeoArtifactType,
  SeoInput,
  SeoArtifact,
  SeoBundle,
  SitemapPage,
  ChangeFreq,
  RobotsConfig,
  RobotsRule,
  JsonLdType,
  JsonLdEntity,
  AddressData,
  OrganizationData,
  WebSiteData,
  WebPageData,
  BreadcrumbItem,
  FAQPageData,
  ProductData,
  SoftwareApplicationData,
  ReviewData,
  ArticleData,
  LocalBusinessData,
  EventData,
  PersonData,
} from './types';

export { SEO_ARTIFACT_TYPES, JSON_LD_TYPES } from './types';
export { generateArtifact, generateBundle } from './generator';
