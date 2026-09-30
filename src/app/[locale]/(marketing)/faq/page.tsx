/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { FaqExplorer } from '@/components/site/FaqExplorer';
import { ResourcesBar } from '@/components/site/ResourcesBar';
import { faqs } from '@/lib/stealth/content';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'Common Questions — StealthRDP Resources',
  description:
    'Quick answers about StealthRDP VPS plans, setup, operating systems, upgrades, refunds, billing, security, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function FaqPage() {
  return (
    <>
      <ResourcesBar active="faq" />
      <div className="srv-page srv-page-faq">
        <FaqExplorer faqs={faqs} />
      </div>
    </>
  );
}
