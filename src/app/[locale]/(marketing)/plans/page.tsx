/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { OsSession } from '@/components/site/os/OsSession';
import extras from '@/components/site/plans/PlansExtras.module.css';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPlans } from '@/lib/stealth/live-plans';
import { plansJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/plans',
  title: 'Windows & Linux VPS Hosting | USA & EU | StealthRDP',
  description: 'Compare Windows and Linux VPS hosting plans from StealthRDP with USA and EU locations, NVMe storage, flexible billing, and checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const included = [
  { title: 'Full admin access', text: 'Control your server from day one' },
  { title: 'NVMe SSD storage', text: 'Fast disk for everyday workloads' },
  { title: 'Isolated VMs', text: 'Separate virtual machines per server' },
  { title: 'Fast activation', text: 'Typically within 60 seconds of payment' },
  { title: '24/7 support', text: 'Help when you need it' },
];

/* Token utilities for the card link rows, replacing the bespoke .sr-inline-links hook. */
const cardLinkClass = 'inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover';

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function PlansPage() {
  const plans = await getPlans();
  const lowest = Math.min(...plans.map(plan => plan.pricing.monthly.amount));
  const inStock = plans.reduce((sum, plan) => sum + (plan.source.stock ?? 0), 0);

  return (
    <div className="srv-page srv-page-plans">
      <ProductionJsonLd data={plansJsonLd(getSeoConfig().siteUrl, plans)} />
      <section className="sr-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Windows and Linux VPS</p>
            <h1 className="sr-title">Windows & Linux VPS Hosting Plans</h1>
            <p className="sr-lede">
              Compare Windows and Linux VPS hosting plans in one place. Choose a resource level,
              region, and billing cycle before the checkout.
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <a href="#plan-grid">
                  Compare Standard Plans
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps">
                  Build Your Own VPS
                </a>
              </Button>
            </div>
            <div className="srv-citadel-v2-facts">
              <span>
                <strong>{plans.length}</strong>
                {' '}
                plans
              </span>
              <span>
                <strong>{`€${lowest.toFixed(2)}`}</strong>
                {' '}
                /mo to start
              </span>
              <span>
                <strong>{inStock}</strong>
                {' '}
                servers in stock
              </span>
            </div>
          </div>
          <OsSession kind="plans" />
        </div>
      </section>

      <section className="sr-section" id="plan-grid">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">STANDARD PLANS</p>
              <h2 className="sr-section-title">Choose your resource level</h2>
            </div>
          </div>
          <PricingExplorer plans={plans} showComparison />
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Operating systems</p>
              <h2 className="sr-section-title">Pick the VPS environment that fits your work.</h2>
            </div>
          </div>

          <div className="
            srv-plan-os-flow grid gap-4
            lg:grid-cols-2
          "
          >
            <Card
              id="windows-vps"
              className="srv-plan-os-option srv-plan-os-windows"
            >
              <CardHeader>
                <span className="srv-plan-os-mark" aria-hidden="true">
                  <Image src="/brand/windows.svg" alt="" width={34} height={34} />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">Windows VPS</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>Windows VPS for graphical remote access.</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  Choose Windows when your workflow needs a graphical desktop or Microsoft-compatible
                  software. Compare CPU, RAM, NVMe storage, bandwidth, region, and billing cycle above.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="
                  rounded-md border-l-2 border-primary bg-surface-2 px-4 py-3
                  text-small text-body-muted
                "
                >
                  <strong>Windows licensing:</strong>
                  {' '}
                  StealthRDP provides the infrastructure only.
                  Microsoft Windows licensing is not included and is not supplied by StealthRDP.
                  Customers using Windows are responsible for their own licensing compliance.
                  {' '}
                  <Link href="/docs/windows-licensing">Read the Windows licensing page.</Link>
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex-wrap gap-x-6 gap-y-2">
                <Link href="/windows-vps" className={cardLinkClass}>
                  Read the Windows VPS hosting guide
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href="/plans#plan-grid" className={cardLinkClass}>
                  Compare Windows VPS resources
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card
              id="linux-vps"
              className="srv-plan-os-option srv-plan-os-linux"
            >
              <CardHeader>
                <span className="srv-plan-os-mark srv-plan-os-mark-linux" aria-hidden="true">
                  <Image src="/brand/linux.svg" alt="" width={34} height={40} />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">Linux VPS</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>Linux VPS for server and open-source workloads.</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  Choose Linux for command-line administration, web hosting, open-source applications,
                  automation, and server tooling. Compare the same resource levels before you continue to the checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex-wrap gap-x-6 gap-y-2">
                <Link href="/linux-vps" className={cardLinkClass}>
                  Read the Linux VPS hosting guide
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href="/plans#plan-grid" className={cardLinkClass}>
                  Compare Linux VPS resources
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Included with every plan</p>
              <h2 className="sr-section-title">The essentials are already covered.</h2>
            </div>
            <p>Choose a plan by resource level. These service basics stay with every server.</p>
          </div>
          <div className="
            srv-plan-included grid gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
          >
            {included.map(({ title, text }) => (
              <Card key={title} className="srv-plan-included-item">
                <CardHeader>
                  <CardTitle className="text-heading-4 text-body-text">
                    <h3>{title}</h3>
                  </CardTitle>
                  <CardDescription className="text-small text-body-muted">
                    {text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-byo-panel srv-site-final">
          <div>
            <p className="sr-kicker">For workloads between the lines</p>
            <h2>Build a server around your exact brief.</h2>
            <p>Choose your own CPU, RAM, storage, location, and billing cycle in the server configurator.</p>
          </div>
          <ul className={extras.configurator} aria-hidden="true">
            {[['CPU', 50], ['RAM', 70], ['Storage', 40], ['Region', 100]].map(([label, fill]) => (
              <li key={label}>
                <span>{label}</span>
                <i className={extras.track}>
                  <b style={{ width: `${fill}%` }} />
                </i>
              </li>
            ))}
          </ul>
          <Button asChild size="lg">
            <a href="https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps">
              Configure & Deploy
              <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

    </div>
  );
}
