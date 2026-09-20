import type { Metadata } from 'next';
import { ArticleIndex } from '@/components/seo/Article';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/blog',
  title: 'Blog — StealthRDP',
  description: 'Expert insights, tutorials, and updates on remote desktop security, VPS management, and server infrastructure.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function BlogPage() {
  const config = getSeoConfig();
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">StealthRDP blog</p><h1 className="sr-title">Operate servers with <span>fewer surprises.</span></h1><p className="sr-lede">Guides and practical infrastructure articles migrated from the current StealthRDP publishing surface.</p></div></section>
      <section className="sr-section"><div className="sr-container"><ArticleIndex config={config} heading="Latest articles" /></div></section>
    </>
  );
}