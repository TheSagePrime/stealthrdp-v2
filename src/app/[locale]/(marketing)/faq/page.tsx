import type { Metadata } from 'next';
import { faqs } from '@/lib/stealth/content';
import { createPageMetadata } from '@/libs/seo/metadata';
import { FaqExplorer } from '@/components/site/FaqExplorer';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'Common Questions — StealthRDP Help Center',
  description:
    'Quick answers from the StealthRDP Help Center about VPS plans, setup, operating systems, upgrades, refunds, billing, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function FaqPage() {
  return (
    <div className="srv-page srv-page-faq">
      <section className="sr-page-hero">
        <div className="sr-container sr-page-hero-inner">
          <div>
            <p className="sr-kicker">Help Center · Common Questions</p>
            <h1 className="sr-title">
              Quick answers, <span>without the digging.</span>
            </h1>
            <p className="sr-lede">
              Plans, setup, billing, security, and support. Browse by topic or search
              the questions below.
            </p>
          </div>

          <div className="sr-page-hero-aside">
            <strong>{faqs.length} questions</strong>
          </div>
        </div>
      </section>

      <FaqExplorer faqs={faqs} />
    </div>
  );
}
