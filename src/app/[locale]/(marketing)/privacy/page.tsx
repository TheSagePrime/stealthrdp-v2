/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/privacy',
  title: 'Privacy Policy — StealthRDP',
  description: 'StealthRDP privacy policy — how we collect, use, and protect your information.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    body: <p>We collect information you provide directly when you create an account, place an order, or contact support: your name, email address, billing information, and any details you share in support requests. We also collect basic technical data — IP address, browser type, and pages visited — to operate and improve our services.</p>,
  },
  {
    id: 'how-we-use-information',
    title: 'How we use your information',
    body: (
      <ul>
        <li>Providing, maintaining, and securing your servers and account</li>
        <li>Processing payments and preventing fraud</li>
        <li>Responding to support requests and troubleshooting</li>
        <li>Sending service notices, updates, and transactional communications</li>
        <li>Improving our website, services, and customer experience</li>
      </ul>
    ),
  },
  {
    id: 'payments',
    title: 'Payments',
    body: <p>Payments are processed through our secure billing provider using bank-level encryption. We do not store full payment card details on our servers.</p>,
  },
  {
    id: 'data-sharing',
    title: 'Data sharing',
    body: <p>We do not sell your personal data. We share information only with service providers who help us operate our business and only to the extent necessary to provide our services or as required by law.</p>,
  },
  {
    id: 'cookies',
    title: 'Cookies, analytics & advertising',
    body: (
      <>
        <p>This website uses these third-party tools:</p>
        <ul>
          <li>Google Analytics 4 and Google Ads, through our tag server at sgtm.stealthrdp.com, to measure visits and ad conversions and to build remarketing audiences</li>
          <li>The Meta pixel, to measure Meta ads</li>
          <li>DataFast, to count visits</li>
          <li>A Yandex Webmaster script from jsDelivr, to confirm that we own the site</li>
        </ul>
        <p>These tools can set cookies or similar identifiers and receive your IP address, browser details and the pages you visit.</p>
        <p>In the EU, the EEA, the UK and Switzerland they load only after you select Accept. In other countries they load by default. You can change your choice at any time with Cookie settings at the bottom of every page.</p>
        <p>We also store two strictly necessary items: your consent choice in your browser and a region cookie (sr_region) that tells the site which consent rule applies.</p>
      </>
    ),
  },
  {
    id: 'retention-and-security',
    title: 'Data retention & security',
    body: <p>We retain account and billing records as required for business and legal purposes. We apply appropriate technical and organizational measures, including isolated infrastructure and restricted access, to safeguard your data.</p>,
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    body: <p>You may request access to, correction of, or deletion of your personal data at any time by contacting our support team. We respond to privacy requests through the normal support process.</p>,
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        For privacy questions, contact
        {' '}
        <a href="mailto:support@stealthrdp.com">support@stealthrdp.com</a>
        {' '}
        or use the StealthRDP support portal.
      </p>
    ),
  },
];

/* Each point restates a sentence from the policy below; it adds no new terms. */
const keyPoints = [
  'We do not sell your personal data.',
  'We do not store full payment card details on our servers.',
  'You can ask support to access, correct, or delete your data.',
];

export default async function PrivacyPage() {
  await requirePageLocale('/privacy');
  return (
    <div className="srv-page srv-page-legal sr-legal">
      <div className="sr-container sr-legal-grid">
        <nav className="sr-legal-toc" aria-label="On this page">
          <p>On this page</p>
          <ol>
            {sections.map(({ id, title }) => (
              <li key={id}><a href={`#${id}`}>{title}</a></li>
            ))}
          </ol>
        </nav>

        <article className="sr-legal-article">
          <header className="sr-legal-header">
            <p className="sr-kicker">Legal</p>
            <h1>Privacy Policy</h1>
            <p className="sr-article-meta">Last updated: October 2026</p>
          </header>

          <aside className="sr-legal-summary" aria-label="Key points">
            <p>Key points</p>
            <ul>
              {keyPoints.map(point => <li key={point}>{point}</li>)}
            </ul>
          </aside>

          <div className="sr-richtext sr-legal-body">
            {sections.map(({ id, title, body }, index) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`}>
                <h2 id={`${id}-title`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  {title}
                </h2>
                {body}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
