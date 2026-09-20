import type { Metadata } from 'next';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/plans',
  title: 'VPS Plans & Pricing — StealthRDP',
  description: 'Compare StealthRDP USA and EU VPS plans, billing cycles, CPU, RAM, NVMe storage, and availability.',
});

export default function PlansPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">VPS plans</p><h1 className="sr-title">Pick the resources. <span>Keep the flexibility.</span></h1><p className="sr-lede">All current public StealthRDP plan data is carried into V2, including regional availability and direct WHMCS checkout links.</p></div></section>
      <section className="sr-section"><div className="sr-container"><PricingExplorer /></div></section>
    </>
  );
}