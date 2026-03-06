import type { LegalInput } from '../types';

export function acceptableUseTemplate(input: LegalInput): string {
  const { companyName, websiteUrl, contactEmail, effectiveDate, jurisdiction, appType } = input;
  const date = effectiveDate || new Date().toISOString().split('T')[0];
  const jur = jurisdiction || 'United States';
  const platform = appType === 'saas' ? 'platform' : appType === 'mobile-app' ? 'application' : appType === 'marketplace' ? 'marketplace' : 'website';

  return `# Acceptable Use Policy

**Effective Date:** ${date}

This Acceptable Use Policy ("AUP") governs your use of the ${platform} operated by **${companyName}** ("we," "us," or "our") at [${websiteUrl}](${websiteUrl}) (the "Service").

By using the Service, you agree to comply with this AUP. Violation may result in suspension or termination of your access.

## 1. Prohibited Conduct

You may not use the Service to:

### Illegal Activities
- Violate any applicable local, state, national, or international law or regulation
- Engage in fraud, money laundering, or other financial crimes
- Distribute or traffic in illegal goods or services

### Harmful Content
- Upload, transmit, or distribute malware, viruses, or other harmful code
- Distribute spam, unsolicited messages, or phishing attempts
- Post content that is defamatory, obscene, threatening, or harassing
- Share content that exploits or harms minors

### System Abuse
- Attempt to gain unauthorized access to the Service, accounts, or systems
- Interfere with or disrupt the Service or connected networks
- Circumvent security measures, rate limits, or access controls
- Use automated tools (bots, scrapers) without prior written consent
- Perform vulnerability scanning or penetration testing without authorization

### Intellectual Property Violations
- Infringe on copyrights, trademarks, patents, or other intellectual property rights
- Distribute pirated software, media, or other copyrighted material
- Use the Service to facilitate intellectual property theft

### Resource Abuse
- Consume excessive resources that degrade the Service for other users
- Use the Service for cryptocurrency mining without authorization
- Store or distribute excessively large files unrelated to the Service's purpose

## 2. Reporting Violations

If you become aware of any violation of this AUP, please report it to:

- **Email:** [${contactEmail}](mailto:${contactEmail})

Include as much detail as possible, including URLs, screenshots, and descriptions of the violation.

## 3. Enforcement

We may take any of the following actions in response to AUP violations:

- Issue a warning
- Temporarily suspend access to the Service
- Permanently terminate your account
- Remove or disable offending content
- Report the activity to law enforcement
- Pursue legal remedies

We reserve the right to determine what constitutes a violation and to take action at our sole discretion.

## 4. Investigation

We reserve the right to investigate suspected violations. During an investigation, we may:

- Temporarily restrict your access
- Review your content and activity logs
- Cooperate with law enforcement or regulatory authorities

## 5. No Obligation to Monitor

We are not obligated to monitor the Service for AUP violations but reserve the right to do so. We are not responsible for user content or conduct.

## 6. Changes to This Policy

We may update this AUP at any time. Material changes will be communicated through the Service or via email. Continued use of the Service after changes constitutes acceptance.

## 7. Contact Us

If you have questions about this Acceptable Use Policy, contact us at:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})

**${companyName}**
Jurisdiction: ${jur}
`;
}
