/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/privacy',
  title: 'Privacy Policy — StealthRDP',
  description: 'StealthRDP privacy policy — how we collect, use, and protect your information.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function PrivacyPage() {
  return (
    <article className="
      srv-page srv-page-article srv-page-legal sr-article-shell
    "
    >
      <p className="sr-kicker">Legal</p>
      <h1>Privacy Policy</h1>
      <p className="sr-article-meta">Last updated: August 2026</p>
      <div className="sr-richtext">
        <h2>1. Information we collect</h2>
        <p>We collect information you provide directly when you create an account, place an order, or contact support: your name, email address, billing information, and any details you share in support requests. We also collect basic technical data — IP address, browser type, and pages visited — to operate and improve our services.</p>
        <h2>2. How we use your information</h2>
        <ul>
          <li>Providing, maintaining, and securing your servers and account</li>
          <li>Processing payments and preventing fraud</li>
          <li>Responding to support requests and troubleshooting</li>
          <li>Sending service notices, updates, and transactional communications</li>
          <li>Improving our website, services, and customer experience</li>
        </ul>
        <h2>3. Payments</h2>
        <p>Payments are processed through our secure billing provider using bank-level encryption. We do not store full payment card details on our servers.</p>
        <h2>4. Data sharing</h2>
        <p>We do not sell your personal data. We share information only with service providers who help us operate our business and only to the extent necessary to provide our services or as required by law.</p>
        <h2>5. Data retention & security</h2>
        <p>We retain account and billing records as required for business and legal purposes. We apply appropriate technical and organizational measures, including isolated infrastructure and restricted access, to safeguard your data.</p>
        <h2>6. Your rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team. We respond to privacy requests through the normal support process.</p>
        <h2>7. Contact</h2>
        <p>
          For privacy questions, contact
          {' '}
          <a href="mailto:support@stealthrdp.com">support@stealthrdp.com</a>
          {' '}
          or use the StealthRDP support portal.
        </p>
      </div>
    </article>
  );
}
