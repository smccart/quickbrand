export type LegalDocType =
  | 'privacy-policy'
  | 'terms-of-service'
  | 'cookie-consent'
  | 'disclaimer'
  | 'acceptable-use'
  | 'dmca';

export interface LegalInput {
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  effectiveDate?: string;
  jurisdiction?: string;
  includeGdpr?: boolean;
  includeCcpa?: boolean;
  appType?: 'website' | 'saas' | 'mobile-app' | 'marketplace';
}

export interface LegalDocument {
  type: LegalDocType;
  title: string;
  markdown: string;
  html: string;
  metadata: {
    generatedAt: string;
    effectiveDate: string;
    jurisdiction: string;
    wordCount: number;
  };
}

export interface LegalBundle {
  documents: LegalDocument[];
  input: LegalInput;
}

export const LEGAL_DOC_TYPES: Record<LegalDocType, { title: string; description: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How your service collects, uses, stores, and shares personal data.',
  },
  'terms-of-service': {
    title: 'Terms of Service',
    description: 'Rules and conditions users must agree to when using your service.',
  },
  'cookie-consent': {
    title: 'Cookie Consent Banner',
    description: 'Cookie types used, consent mechanism, and opt-out instructions.',
  },
  disclaimer: {
    title: 'Disclaimer',
    description: 'Liability limitations, accuracy statements, and professional advice caveats.',
  },
  'acceptable-use': {
    title: 'Acceptable Use Policy',
    description: 'Prohibited conduct, enforcement actions, and abuse reporting.',
  },
  dmca: {
    title: 'DMCA Policy',
    description: 'Copyright takedown procedures, counter-notices, and designated agent.',
  },
};
