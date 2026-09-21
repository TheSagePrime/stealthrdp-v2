import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { AfterCheckout } from '@/components/site/home/AfterCheckout';
import { HomeHero } from '@/components/site/home/HomeHero';
import { Infrastructure } from '@/components/site/home/Infrastructure';
import { RegionTable } from '@/components/site/home/RegionTable';
import { Resources } from '@/components/site/home/Resources';
import { SectionIndex } from '@/components/site/home/SectionIndex';
import { Button } from '@/components/ui/button';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    path: '/',
    locale,
    title: 'StealthRDP — Secure Remote Desktop & VPS Infrastructure',
    description:
      'Deploy a Windows or Linux VPS in 60 seconds. Enterprise-grade hardware, 99.9% uptime SLA and 24/7 support — from €9.50/month.',
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

/**
 * Home. Section order is DESIGN.md section 9 and is deliberate: the first three
 * positions are structural changes from the incumbent, not refinements.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <>
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <HomeHero />

      <SectionIndex />

      <AfterCheckout />

      <RegionTable />

      <Infrastructure />

      <section className="sr-section sr-section-border sr-pricing-section" id="plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Choose a workload</p>
              <h2 className="sr-section-title">Plans priced for the work</h2>
            </div>
            <p>
              Pick a workload to highlight a practical starting tier, then choose your
              region, operating system, billing cycle, and resources before checkout.
            </p>
          </div>

          <PricingExplorer compact variant="table" />

          <div className="sr-section-link">
            <Link href="/plans">
              Compare all 11 plans
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <Resources />

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-cta sr-cta-premium">
          <div>
            <p className="sr-kicker">Ready when you are</p>
            <h2>Deploy the server. Get back to the actual work.</h2>
            <p>
              Windows and Linux choices, USA and EU regions, and the existing
              StealthRDP client area for billing and server access.
            </p>
            <p className="sr-micro">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                Ask a pre-sales question
              </a>
            </p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="https://dash.stealthrdp.com/index.php?rp=/store">
                Deploy server
                <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
