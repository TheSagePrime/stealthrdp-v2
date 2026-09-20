import type { Metadata } from 'next';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/plans',
  title: 'Windows & Linux VPS Hosting | USA & EU | StealthRDP',
  description: 'Compare Windows and Linux VPS hosting plans from StealthRDP with USA and EU locations, NVMe storage, flexible billing, and checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function PlansPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">VPS plans</p><h1 className="sr-title">Pick the resources. <span>Keep the flexibility.</span></h1><p className="sr-lede">All current public StealthRDP plan data is carried into V2, including regional availability and direct WHMCS checkout links.</p></div></section>
      <section className="sr-section"><div className="sr-container"><PricingExplorer /></div></section>
    </>
  );
}