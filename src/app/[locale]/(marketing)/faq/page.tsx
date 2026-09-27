import type { Metadata } from 'next';
import { FaqExplorer } from '@/components/site/FaqExplorer';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { createPageMetadata } from '@/libs/seo/metadata';
import { faqs } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'Common Questions — StealthRDP Resources',
  description:
    'Quick answers about StealthRDP VPS plans, setup, operating systems, upgrades, refunds, billing, security, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function FaqPage() {
  return (
    <div className="srv-page srv-page-faq srv-docs-product">
      <HelpTopbar active="faq" />
      <FaqExplorer faqs={faqs} />
    </div>
  );
}
