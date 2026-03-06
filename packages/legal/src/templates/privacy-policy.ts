import type { LegalInput } from '../types';

export function privacyPolicyTemplate(input: LegalInput): string {
  const { companyName, websiteUrl, contactEmail, effectiveDate, jurisdiction, includeGdpr, includeCcpa, appType } = input;
  const date = effectiveDate || new Date().toISOString().split('T')[0];
  const jur = jurisdiction || 'United States';
  const platform = appType === 'saas' ? 'platform' : appType === 'mobile-app' ? 'application' : appType === 'marketplace' ? 'marketplace' : 'website';

  let md = `# Privacy Policy

**Effective Date:** ${date}

This Privacy Policy describes how **${companyName}** ("we," "us," or "our") collects, uses, and shares information when you use our ${platform} at [${websiteUrl}](${websiteUrl}) (the "Service").

By using the Service, you agree to the collection and use of information as described in this policy.

## 1. Information We Collect

### Information You Provide

- **Account Information:** Name, email address, and password when you create an account.
- **Contact Information:** Email address or other details you provide when contacting us.
- **Payment Information:** Billing address and payment method details processed by our third-party payment processor.
- **User Content:** Any content you upload, submit, or transmit through the Service.

### Information Collected Automatically

- **Usage Data:** Pages visited, features used, time spent, and interaction patterns.
- **Device Information:** Browser type, operating system, device identifiers, and screen resolution.
- **Log Data:** IP address, access times, referring URLs, and server logs.
- **Cookies and Tracking:** We use cookies and similar technologies as described in our Cookie Policy.

## 2. How We Use Your Information

We use collected information to:

- Provide, maintain, and improve the Service
- Process transactions and send related notices
- Respond to your requests, comments, and questions
- Send technical notices, security alerts, and support messages
- Monitor and analyze usage trends and preferences
- Detect, investigate, and prevent fraud or abuse
- Comply with legal obligations

## 3. How We Share Your Information

We do not sell your personal information. We may share your information with:

- **Service Providers:** Third parties that perform services on our behalf (hosting, analytics, payment processing).
- **Legal Compliance:** When required by law, regulation, or legal process.
- **Business Transfers:** In connection with a merger, acquisition, or sale of assets.
- **With Your Consent:** When you direct us to share information with third parties.

## 4. Data Retention

We retain your personal information for as long as your account is active or as needed to provide the Service. We may retain certain information as required by law or for legitimate business purposes.

## 5. Data Security

We implement reasonable technical and organizational measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.

## 6. Your Rights

Depending on your location, you may have the right to:

- Access the personal information we hold about you
- Request correction of inaccurate information
- Request deletion of your personal information
- Object to or restrict processing of your information
- Data portability
- Withdraw consent

To exercise these rights, contact us at [${contactEmail}](mailto:${contactEmail}).

## 7. Third-Party Links

The Service may contain links to third-party websites. We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies.

## 8. Children's Privacy

The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child has provided us personal information, we will take steps to delete it.

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Service and updating the "Effective Date."
`;

  if (includeGdpr) {
    md += `
## 10. GDPR — European Users

If you are in the European Economic Area (EEA), United Kingdom, or Switzerland:

- **Legal Basis:** We process your data based on consent, contract performance, legitimate interests, or legal obligations.
- **Data Transfers:** We may transfer your data outside the EEA using Standard Contractual Clauses or other approved mechanisms.
- **Data Protection Officer:** Contact us at [${contactEmail}](mailto:${contactEmail}) for data protection inquiries.
- **Supervisory Authority:** You have the right to lodge a complaint with your local data protection authority.
`;
  }

  if (includeCcpa) {
    md += `
## ${includeGdpr ? '11' : '10'}. CCPA — California Residents

If you are a California resident under the California Consumer Privacy Act (CCPA):

- **Right to Know:** You can request the categories and specific pieces of personal information we have collected.
- **Right to Delete:** You can request deletion of your personal information, subject to certain exceptions.
- **Right to Opt-Out:** We do not sell personal information. If this changes, we will provide a "Do Not Sell My Personal Information" link.
- **Non-Discrimination:** We will not discriminate against you for exercising your CCPA rights.

To submit a request, contact us at [${contactEmail}](mailto:${contactEmail}).
`;
  }

  md += `
## Contact Us

If you have questions about this Privacy Policy, contact us at:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})

**${companyName}**
Jurisdiction: ${jur}
`;

  return md;
}
