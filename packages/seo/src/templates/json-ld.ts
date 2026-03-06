import type { SeoInput, JsonLdEntity, AddressData } from '../types';

export function jsonLdTemplate(input: SeoInput): { content: string; language: 'html'; filename: string } {
  const entities = input.jsonLdEntities || [
    { type: 'Organization' as const },
    { type: 'WebSite' as const },
  ];

  const scripts = entities.map((entity) => {
    const obj = buildJsonLd(entity, input);
    return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
  });

  return { content: scripts.join('\n\n'), language: 'html', filename: 'json-ld.html' };
}

function buildJsonLd(entity: JsonLdEntity, input: SeoInput): Record<string, unknown> {
  const d = entity.data || {};
  const builders: Record<string, () => Record<string, unknown>> = {
    Organization: () => buildOrganization(d, input),
    WebSite: () => buildWebSite(d, input),
    WebPage: () => buildWebPage(d, input),
    BreadcrumbList: () => buildBreadcrumbList(d, input),
    FAQPage: () => buildFAQPage(d),
    Product: () => buildProduct(d),
    SoftwareApplication: () => buildSoftwareApplication(d),
    Review: () => buildReview(d),
    Article: () => buildArticle(d, input),
    LocalBusiness: () => buildLocalBusiness(d, input),
    Event: () => buildEvent(d),
    Person: () => buildPerson(d),
  };

  const builder = builders[entity.type];
  if (!builder) {
    return { '@context': 'https://schema.org', '@type': entity.type, ...d };
  }
  return builder();
}

function buildOrganization(d: Record<string, unknown>, input: SeoInput): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: d.name || input.siteName,
    url: d.url || input.siteUrl,
  };
  if (d.logo) obj.logo = d.logo;
  if (d.description || input.description) obj.description = d.description || input.description;
  if (d.email) obj.email = d.email;
  if (d.phone) obj.telephone = d.phone;
  if (d.address) obj.address = formatAddress(d.address as AddressData);
  if (d.sameAs && Array.isArray(d.sameAs)) obj.sameAs = d.sameAs;
  return obj;
}

function buildWebSite(d: Record<string, unknown>, input: SeoInput): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: d.name || input.siteName,
    url: d.url || input.siteUrl,
  };
  if (d.description || input.description) obj.description = d.description || input.description;
  if (d.searchUrl) {
    obj.potentialAction = {
      '@type': 'SearchAction',
      target: `${d.searchUrl}{search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }
  return obj;
}

function buildWebPage(d: Record<string, unknown>, input: SeoInput): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: d.name || input.title || input.siteName,
    url: d.url || input.siteUrl,
  };
  if (d.description || input.description) obj.description = d.description || input.description;
  if (d.breadcrumbs && Array.isArray(d.breadcrumbs)) {
    obj.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: (d.breadcrumbs as { name: string; url: string }[]).map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }
  return obj;
}

function buildBreadcrumbList(d: Record<string, unknown>, input: SeoInput): Record<string, unknown> {
  const items = (d.items as { name: string; url: string }[]) || [
    { name: 'Home', url: input.siteUrl },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildFAQPage(d: Record<string, unknown>): Record<string, unknown> {
  const questions = (d.questions as { question: string; answer: string }[]) || [];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

function buildProduct(d: Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: d.name || 'Product',
  };
  if (d.description) obj.description = d.description;
  if (d.image) obj.image = d.image;
  if (d.brand) obj.brand = { '@type': 'Brand', name: d.brand };
  if (d.sku) obj.sku = d.sku;
  if (d.price !== undefined) {
    obj.offers = {
      '@type': 'Offer',
      price: d.price,
      priceCurrency: d.currency || 'USD',
      availability: `https://schema.org/${d.availability || 'InStock'}`,
    };
  }
  if (d.ratingValue !== undefined) {
    obj.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: d.ratingValue,
      reviewCount: d.reviewCount || 1,
    };
  }
  return obj;
}

function buildSoftwareApplication(d: Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: d.name || 'Application',
  };
  if (d.description) obj.description = d.description;
  if (d.operatingSystem) obj.operatingSystem = d.operatingSystem;
  if (d.applicationCategory) obj.applicationCategory = d.applicationCategory;
  if (d.price !== undefined) {
    obj.offers = {
      '@type': 'Offer',
      price: d.price,
      priceCurrency: d.currency || 'USD',
    };
  }
  if (d.ratingValue !== undefined) {
    obj.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: d.ratingValue,
      reviewCount: d.reviewCount || 1,
    };
  }
  return obj;
}

function buildReview(d: Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Thing',
      name: d.itemReviewed || 'Item',
    },
    author: {
      '@type': 'Person',
      name: d.author || 'Anonymous',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: d.ratingValue ?? 5,
      bestRating: d.bestRating ?? 5,
      worstRating: d.worstRating ?? 1,
    },
  };
  if (d.reviewBody) obj.reviewBody = d.reviewBody;
  if (d.datePublished) obj.datePublished = d.datePublished;
  return obj;
}

function buildArticle(d: Record<string, unknown>, input: SeoInput): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.headline || input.title || input.siteName,
  };
  if (d.description || input.description) obj.description = d.description || input.description;
  if (d.image) obj.image = d.image;
  if (d.author) obj.author = { '@type': 'Person', name: d.author };
  if (d.datePublished) obj.datePublished = d.datePublished;
  if (d.dateModified) obj.dateModified = d.dateModified;
  if (d.publisher || input.siteName) {
    const publisher: Record<string, unknown> = {
      '@type': 'Organization',
      name: d.publisher || input.siteName,
    };
    if (d.publisherLogo) publisher.logo = { '@type': 'ImageObject', url: d.publisherLogo };
    obj.publisher = publisher;
  }
  return obj;
}

function buildLocalBusiness(d: Record<string, unknown>, input: SeoInput): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: d.name || input.siteName,
    url: input.siteUrl,
  };
  if (d.description || input.description) obj.description = d.description || input.description;
  if (d.image) obj.image = d.image;
  if (d.phone) obj.telephone = d.phone;
  if (d.address) obj.address = formatAddress(d.address as AddressData);
  if (d.openingHours && Array.isArray(d.openingHours)) obj.openingHoursSpecification = d.openingHours;
  if (d.priceRange) obj.priceRange = d.priceRange;
  if (d.geo && typeof d.geo === 'object') {
    const geo = d.geo as { latitude: number; longitude: number };
    obj.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }
  return obj;
}

function buildEvent(d: Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: d.name || 'Event',
    startDate: d.startDate || new Date().toISOString(),
  };
  if (d.endDate) obj.endDate = d.endDate;
  if (d.location) {
    obj.location = {
      '@type': 'Place',
      name: d.location,
    };
  }
  if (d.description) obj.description = d.description;
  if (d.image) obj.image = d.image;
  if (d.performer) {
    obj.performer = { '@type': 'Person', name: d.performer };
  }
  if (d.price !== undefined) {
    obj.offers = {
      '@type': 'Offer',
      price: d.price,
      priceCurrency: d.currency || 'USD',
      availability: `https://schema.org/${d.availability || 'InStock'}`,
    };
  }
  return obj;
}

function buildPerson(d: Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: d.name || 'Person',
  };
  if (d.url) obj.url = d.url;
  if (d.image) obj.image = d.image;
  if (d.jobTitle) obj.jobTitle = d.jobTitle;
  if (d.worksFor) obj.worksFor = { '@type': 'Organization', name: d.worksFor };
  if (d.sameAs && Array.isArray(d.sameAs)) obj.sameAs = d.sameAs;
  return obj;
}

function formatAddress(addr: AddressData): Record<string, unknown> {
  const obj: Record<string, unknown> = { '@type': 'PostalAddress' };
  if (addr.streetAddress) obj.streetAddress = addr.streetAddress;
  if (addr.city) obj.addressLocality = addr.city;
  if (addr.state) obj.addressRegion = addr.state;
  if (addr.postalCode) obj.postalCode = addr.postalCode;
  if (addr.country) obj.addressCountry = addr.country;
  return obj;
}
