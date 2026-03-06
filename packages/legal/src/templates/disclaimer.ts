import type { LegalInput } from '../types';

export function disclaimerTemplate(input: LegalInput): string {
  const { companyName, websiteUrl, contactEmail, effectiveDate, jurisdiction } = input;
  const date = effectiveDate || new Date().toISOString().split('T')[0];
  const jur = jurisdiction || 'United States';

  return `# Disclaimer

**Effective Date:** ${date}

The information provided by **${companyName}** ("we," "us," or "our") on [${websiteUrl}](${websiteUrl}) (the "Service") is for general informational purposes only.

## 1. No Professional Advice

The content on the Service does not constitute professional advice — including but not limited to legal, financial, medical, or technical advice. You should consult a qualified professional before making decisions based on information found on the Service.

## 2. Accuracy of Information

We make reasonable efforts to ensure the information on the Service is accurate and up to date. However, we make no warranties or representations, express or implied, about the completeness, accuracy, reliability, or suitability of the information.

Any reliance you place on the information is strictly at your own risk.

## 3. External Links

The Service may contain links to external websites that are not operated by us. We have no control over the content, privacy policies, or practices of third-party sites and assume no responsibility for them.

## 4. No Guarantees

We do not guarantee:

- That the Service will be available at all times or without interruption
- That the information will be error-free or complete
- That results obtained from using the Service will be accurate or reliable
- That defects will be corrected in a timely manner

## 5. Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY LAW, ${companyName.toUpperCase()} SHALL NOT BE LIABLE FOR ANY LOSS OR DAMAGE ARISING FROM YOUR USE OF OR RELIANCE ON THE SERVICE OR ITS CONTENT.

This includes, without limitation, direct, indirect, incidental, consequential, or punitive damages.

## 6. User Responsibility

You are responsible for evaluating the accuracy, completeness, and usefulness of any information provided through the Service. You use the Service at your own risk.

## 7. Changes to This Disclaimer

We reserve the right to update this Disclaimer at any time. Changes will be posted on the Service with an updated effective date.

## 8. Contact Us

If you have questions about this Disclaimer, contact us at:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})

**${companyName}**
Jurisdiction: ${jur}
`;
}
