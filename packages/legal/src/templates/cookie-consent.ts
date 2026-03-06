import type { LegalInput } from '../types';

export function cookieConsentTemplate(input: LegalInput): string {
  const { companyName, websiteUrl, contactEmail, effectiveDate } = input;
  const date = effectiveDate || new Date().toISOString().split('T')[0];

  return `# Cookie Policy

**Effective Date:** ${date}

This Cookie Policy explains how **${companyName}** ("we," "us," or "our") uses cookies and similar tracking technologies on [${websiteUrl}](${websiteUrl}) (the "Service").

## 1. What Are Cookies?

Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to site owners.

## 2. Types of Cookies We Use

### Strictly Necessary Cookies

These cookies are essential for the Service to function. They enable core features like security, authentication, and accessibility. You cannot opt out of these cookies.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| session_id | Maintains your login session | Session |
| csrf_token | Prevents cross-site request forgery | Session |

### Performance & Analytics Cookies

These cookies help us understand how visitors interact with the Service by collecting anonymous usage data.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| _ga | Google Analytics — distinguishes users | 2 years |
| _gid | Google Analytics — distinguishes users | 24 hours |

### Functional Cookies

These cookies remember your preferences and settings to enhance your experience.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| theme | Remembers your display preference | 1 year |
| locale | Remembers your language preference | 1 year |

### Targeting & Advertising Cookies

We may use these cookies to deliver relevant advertisements and measure campaign effectiveness. These cookies track your browsing activity across websites.

## 3. How to Manage Cookies

You can control cookies through your browser settings:

- **Chrome:** Settings > Privacy and Security > Cookies
- **Firefox:** Settings > Privacy & Security > Cookies
- **Safari:** Preferences > Privacy > Cookies
- **Edge:** Settings > Privacy, Search, and Services > Cookies

You can also opt out of specific analytics services:

- [Google Analytics Opt-Out](https://tools.google.com/dlpage/gaoptout)

**Note:** Disabling cookies may affect the functionality of the Service.

## 4. Third-Party Cookies

Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. Please refer to the respective third-party privacy policies for more information.

## 5. Cookie Consent Banner

When you first visit our Service, you will see a cookie consent banner. You can:

- **Accept All:** Allow all cookie categories
- **Reject Non-Essential:** Only allow strictly necessary cookies
- **Customize:** Choose which cookie categories to allow

You can change your preferences at any time through the cookie settings link in the footer of our Service.

## 6. Updates to This Policy

We may update this Cookie Policy from time to time. Changes will be posted on the Service with an updated effective date.

## 7. Contact Us

If you have questions about our use of cookies, contact us at:

- **Email:** [${contactEmail}](mailto:${contactEmail})
- **Website:** [${websiteUrl}](${websiteUrl})

**${companyName}**
`;
}
