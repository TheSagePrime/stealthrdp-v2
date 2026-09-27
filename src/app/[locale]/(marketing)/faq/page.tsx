import type { Metadata } from 'next';
import { faqs } from '@/lib/stealth/content';
import { createPageMetadata } from '@/libs/seo/metadata';
import { FaqExplorer } from '@/components/site/FaqExplorer';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'FAQ — StealthRDP',
  description:
    'Frequently asked questions about StealthRDP VPS hosting: setup, operating systems, upgrades, refunds, and more.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function FaqPage() {
  return (
    <div className="srv-page srv-page-faq">
      <section className="sr-page-hero">
        <div className="sr-container sr-page-hero-inner">
          <div>
            <p className="sr-kicker">FAQ</p>
            <h1 className="sr-title">
              Answers before you <span>deploy.</span>
            </h1>
            <p className="sr-lede">
              Plans, setup, billing, security, and support — search or browse by
              topic below.
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
