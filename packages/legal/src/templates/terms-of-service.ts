import type { LegalInput } from '../types';

export function termsOfServiceTemplate(input: LegalInput): string {
  const { companyName, websiteUrl, contactEmail, effectiveDate, jurisdiction, appType } = input;
  const date = effectiveDate || new Date().toISOString().split('T')[0];
  const jur = jurisdiction || 'United States';
  const platform = appType === 'saas' ? 'platform' : appType === 'mobile-app' ? 'application' : appType === 'marketplace' ? 'marketplace' : 'website';

  return `# Terms of Service

**Effective Date:** ${date}

These Terms of Service ("Terms") govern your use of the ${platform} operated by **${companyName}** ("we," "us," or "our") at [${websiteUrl}](${websiteUrl}) (the "Service").

By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.

## 1. Eligibility

You must be at least 13 years old to use the Service. By using the Service, you represent that you meet this age requirement and have the legal capacity to enter into these Terms.

## 2. Account Registration

- You may need to create an account to access certain features.
- You are responsible for maintaining the confidentiality of your account credentials.
- You agree to provide accurate and complete information and to update it as necessary.
- You are responsible for all activity under your account.

## 3. Acceptable Use

You agree not to:

- Violate any applicable laws or regulations
- Infringe on the intellectual property rights of others
- Upload malicious code, viruses, or harmful content
- Attempt to gain unauthorized access to the Service or its systems
- Use the Service for any fraudulent or deceptive purpose
- Interfere with or disrupt the Service or its infrastructure
- Harvest or collect user information without consent
- Use automated means to access the Service without our permission

## 4. Intellectual Property

- The Service and its original content, features, and functionality are owned by ${companyName} and are protected by copyright, trademark, and other intellectual property laws.
- You retain ownership of content you submit through the Service, but grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with the Service.

## 5. User Content

- You are solely responsible for content you post or transmit through the Service.
- We reserve the right to remove content that violates these Terms or is otherwise objectionable.
- We do not endorse or assume liability for any user-submitted content.

## 6. Payment and Billing

If the Service includes paid features:

- Fees are described on the Service and may change with notice.
- You agree to pay all applicable fees and authorize us to charge your payment method.
- Refunds are handled according to our refund policy, if any.

## 7. Termination

- We may suspend or terminate your access to the Service at any time, with or without cause or notice.
- You may terminate your account at any time by contacting us.
- Upon termination, your right to use the Service ceases immediately.
- Provisions that by their nature should survive termination will survive.

## 8. Disclaimers

THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or secure.

## 9. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${companyName.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, ARISING FROM YOUR USE OF THE SERVICE.

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

## 10. Indemnification

You agree to indemnify, defend, and hold harmless ${companyName} and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising from your use of the Service or violation of these Terms.

## 11. Governing Law

These Terms are governed by the laws of ${jur}, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of ${jur}.

## 12. Changes to These Terms

We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on the Service and updating the "Effective Date." Continued use of the Service after changes constitutes acceptance of the updated Terms.

## 13. Contact Us

If you have questions about these Terms, contact us at:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})

**${companyName}**
Jurisdiction: ${jur}
`;
}
