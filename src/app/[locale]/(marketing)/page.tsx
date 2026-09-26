import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { AfterCheckout } from '@/components/site/home/AfterCheckout';
import { HomeHero } from '@/components/site/home/HomeHero';
import { Infrastructure } from '@/components/site/home/Infrastructure';
import { RegionTable } from '@/components/site/home/RegionTable';
import { Resources } from '@/components/site/home/Resources';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  ['10,000+', 'Orders'],
  ['60s', 'Average deploy'],
  ['99.9%', 'Uptime SLA'],
] as const;

const workloads = [
  'Remote desktop',
  'Web hosting',
  'Automation & bots',
  'Trading',
  'Storage & backups',
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
        <div className="sr-container">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 md:grid-cols-3 md:gap-y-0 md:py-0">
            {trust.map(([value, label]) => (
              <div
                key={label}
                className="
                  grid content-center gap-1
                  md:min-h-24 md:border-l md:border-divider md:pl-6
                  md:first:border-l-0 md:first:pl-0
                "
              >
                <dt className="text-heading-4 font-semibold text-body-text">{value}</dt>
                <dd className="text-small text-body-dim">
                  {label === 'Uptime SLA' ? (
                    <Link href="/status" className="transition-colors hover:text-primary">
                      {label} · live status
                    </Link>
                  ) : (
                    label
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="sr-section srv3-plans-section" id="plans">
        <div className="sr-container">
          <div className="srv3-section-heading">
            <div>
              <p className="sr-kicker">Choose a workload</p>
              <h2>Plans priced for the work</h2>
            </div>
            <p>
              Pick a workload to highlight the plan that fits. All plans include free migration
              assistance, 24/7 support, and our industry-leading uptime guarantee.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2" aria-label="Example workloads">
            {workloads.map(label => (
              <li key={label}>
                <Badge variant="outline">{label}</Badge>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-small text-body-muted">
            Best fit: Bronze USA — Windows and Linux images available on every plan.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/windows-vps"
              className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover"
            >
              Windows VPS hosting
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/linux-vps"
              className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover"
            >
              Linux VPS hosting
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/plans#comparison"
              className="inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover"
            >
              Compare VPS resources
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <PricingExplorer compact />

          <div className="srv3-section-action">
            <Button asChild variant="outline">
              <Link href="/plans">
                View All 11 Plans
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Infrastructure />

      <RegionTable />

      <section className="sr-section srv3-family-section" aria-label="StealthRDP product family">
        <div className="sr-container">
          <div className="srv3-section-heading">
            <div>
              <p className="sr-kicker">One company, two products</p>
              <h2>Hosting to run on. Protection to hide behind.</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="gap-3 p-8">
              <p className="sr-kicker">Hosting</p>
              <h3 className="text-heading-4 font-semibold text-body-text">
                Windows and Linux VPS infrastructure
              </h3>
              <p className="text-small text-body-muted">
                Comparable plans in USA and EU regions with NVMe storage,
                full administrative access, and honest billing terms.
              </p>
              <div>
                <Button asChild variant="outline">
                  <Link href="/plans">
                    Compare VPS plans
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="gap-3 p-8">
              <p className="sr-kicker">Protection</p>
              <h3 className="text-heading-4 font-semibold text-body-text">
                Citadel L7 HTTP/HTTPS protection
              </h3>
              <p className="text-small text-body-muted">
                Application-layer controls between Cloudflare and the origin:
                adaptive challenges, rate limits, allowlists, and automatic recovery.
              </p>
              <div>
                <Button asChild variant="outline">
                  <Link href="/citadel">
                    Understand Citadel
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <AfterCheckout />

      <Resources />

      <section className="sr-section srv3-final-section">
        <div className="sr-container">
          <Card className="gap-8 rounded-lg p-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:p-12">
            <div className="grid gap-2">
              <p className="sr-kicker">Backed by 10,000+ orders</p>
              <h2 className="text-display-2 font-semibold text-body-text">
                Ready to stop wasting time on server management?
              </h2>
              <p className="max-w-xl text-small text-body-muted">
                Deploy your high-performance VPS in the next 60 seconds and focus on what
                matters — your actual work.
              </p>
              <p className="max-w-xl text-small text-body-muted">
                Starting at just <strong>€9.50/month</strong> · 7-day money-back guarantee ·
                Cancel anytime
              </p>
            </div>
            <div className="flex flex-col gap-2.5 md:min-w-48">
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">
                  Deploy Your Server Now
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://dash.stealthrdp.com/submitticket.php">Ask a Pre-Sales Question</a>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
