import type { LegalInput } from '../types';

export function dmcaTemplate(input: LegalInput): string {
  const { companyName, websiteUrl, contactEmail, effectiveDate } = input;
  const date = effectiveDate || new Date().toISOString().split('T')[0];

  return `# DMCA Policy

**Effective Date:** ${date}

**${companyName}** ("we," "us," or "our") respects the intellectual property rights of others and expects users of [${websiteUrl}](${websiteUrl}) (the "Service") to do the same.

In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond promptly to claims of copyright infringement reported to our designated agent.

## 1. Filing a DMCA Takedown Notice

If you believe that your copyrighted work has been copied and is accessible on the Service in a way that constitutes copyright infringement, please send a written notification to our designated agent with the following information:

1. **Identification of the copyrighted work** claimed to have been infringed, or a representative list if multiple works are involved.
2. **Identification of the material** claimed to be infringing, including the URL or other specific location on the Service.
3. **Your contact information**, including name, address, telephone number, and email address.
4. **A statement** that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.
5. **A statement**, made under penalty of perjury, that the information in the notification is accurate and that you are the copyright owner or authorized to act on the owner's behalf.
6. **Your physical or electronic signature.**

## 2. Designated Agent

Our designated agent for receiving DMCA takedown notices is:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})
- **Company:** ${companyName}

## 3. Counter-Notification

If you believe your content was removed or disabled by mistake or misidentification, you may submit a counter-notification with the following:

1. **Identification of the material** that was removed and its location before removal.
2. **A statement**, made under penalty of perjury, that you have a good faith belief the material was removed or disabled as a result of mistake or misidentification.
3. **Your name, address, and telephone number**, and a statement consenting to the jurisdiction of the federal court in your district (or ${companyName}'s jurisdiction if you are outside the United States).
4. **A statement** that you will accept service of process from the complainant.
5. **Your physical or electronic signature.**

Send counter-notifications to our designated agent at [${contactEmail}](mailto:${contactEmail}).

## 4. Process

Upon receiving a valid takedown notice:

1. We will promptly remove or disable access to the allegedly infringing material.
2. We will notify the user who posted the material.
3. The user may submit a counter-notification.
4. If we receive a valid counter-notification, we will forward it to the complainant and restore the material within 10–14 business days unless the complainant files a court action.

## 5. Repeat Infringers

We will terminate the accounts of users who are determined to be repeat infringers in appropriate circumstances.

## 6. Good Faith

Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material is infringing — or that it was removed by mistake — may be subject to liability.

## 7. Contact Us

For DMCA-related inquiries, contact us at:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})

**${companyName}**
`;
}
