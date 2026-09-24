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
    title: 'StealthRDP — Windows & Linux VPS Hosting',
    description:
      'Deploy Windows or Linux VPS hosting with NVMe storage, full administrative access, USA and EU locations, and flexible billing.',
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

const trust = [
  ['10,000+', 'orders delivered'],
  ['99.9%', 'uptime SLA'],
  ['USA + EU', 'server regions'],
  ['24/7', 'support availability'],
] as const;

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

      <section className="srv3-trust" aria-label="StealthRDP proof">
        <div className="sr-container srv3-trust-grid">
          {trust.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sr-section srv3-plans-section" id="plans">
        <div className="sr-container">
          <div className="srv3-section-heading">
            <div>
              <p className="sr-kicker">Popular VPS plans</p>
              <h2>Pick the resources. Keep the rest simple.</h2>
            </div>
            <p>
              Compare CPU, memory, NVMe storage, bandwidth and region before moving to checkout.
            </p>
          </div>

          <PricingExplorer compact guided={false} />

          <div className="srv3-section-action">
            <Button asChild variant="outline">
              <Link href="/plans">
                Compare every plan
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Infrastructure />

      <RegionTable />

      <AfterCheckout />

      <Resources />

      <section className="sr-section srv3-final-section">
        <div className="sr-container">
          <div className="srv3-final-cta">
            <div>
              <p className="sr-kicker">Ready to deploy?</p>
              <h2>Your next server is a few clicks away.</h2>
              <p>
                Choose a region and plan here, then finish configuration in the StealthRDP client area.
              </p>
            </div>
            <div className="srv3-final-actions">
              <Button asChild size="lg">
                <Link href="/plans">
                  View VPS plans
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://dash.stealthrdp.com/submitticket.php">Ask a question</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
