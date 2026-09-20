import type { Metadata } from 'next';
import { Globe2, Server, ShieldCheck, Workflow } from 'lucide-react';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/about',
  title: 'About Us — StealthRDP',
  description: 'StealthRDP provides high-performance remote desktop and VPS infrastructure with 10,000+ orders worldwide.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function AboutPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">About StealthRDP</p><h1 className="sr-title">Infrastructure without the <span>unnecessary ceremony.</span></h1><p className="sr-lede">StealthRDP provides Windows and Linux VPS infrastructure while keeping public product discovery separate from the billing and server-management systems customers already use.</p></div></section>
      <section className="sr-section"><div className="sr-container"><div className="sr-feature-grid">
        <article className="sr-feature"><Server /><h3>10,000+ orders</h3><p>The public site records more than ten thousand processed orders across StealthRDP’s operating history.</p></article>
        <article className="sr-feature"><Globe2 /><h3>USA + Netherlands</h3><p>Regional options support customers across North America, Europe, and surrounding markets.</p></article>
        <article className="sr-feature"><Workflow /><h3>Clear system boundaries</h3><p>The website handles discovery; WHMCS handles checkout, billing, and client-account flows.</p></article>
        <article className="sr-feature"><ShieldCheck /><h3>Operational clarity</h3><p>Status, docs, licensing disclosures, and support routes stay visible instead of being buried.</p></article>
      </div></div></section>
    </>
  );
}