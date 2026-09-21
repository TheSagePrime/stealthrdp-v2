import type { Metadata } from 'next';
import { Activity, ArrowRight, HardDrive, Network, ShieldCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Clause } from '@/components/home/Clause';
import { LiveLedger } from '@/components/home/LiveLedger';
import { OperatorRecord } from '@/components/home/OperatorRecord';
import { PlanInventory } from '@/components/home/PlanInventory';
import {
  lowestMonthly,
  monitorTotal,
  planTotal,
  priceText,
  regionCount,
  reportingTotal,
} from '@/components/home/registry';
import { StateRule } from '@/components/home/StateRule';
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

const systems = [
  'Debian',
  'CentOS',
  'Rocky Linux',
  'Ubuntu',
  'Fedora',
  'FreeBSD',
  'Alpine Linux',
  'AlmaLinux',
  'Windows',
];

const hardware = [
  {
    icon: HardDrive,
    title: 'NVMe-first storage',
    text: 'Fast disk I/O for remote desktops, applications, databases, automation and active workloads.',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated virtual machines',
    text: 'Dedicated VM boundaries with full administrative access and infrastructure-level protection.',
  },
  {
    icon: Network,
    title: 'High-speed networking',
    text: 'Fast connectivity and unlimited bandwidth on current plans, built for sustained workloads.',
  },
  {
    icon: Activity,
    title: 'Visible service health',
    text: 'Public status information and clear support paths when something needs attention.',
  },
];

const regions = [
  {
    code: 'USA',
    match: 'USA',
    description: 'Low-friction VPS deployment for North American workloads.',
  },
  {
    code: 'EU',
    match: 'EU',
    description: 'European VPS capacity for regional users and infrastructure.',
  },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <div className="sr-home">
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <div className="srx-wrap">
        <section className="srx-sheet" aria-labelledby="srx-claim">
          <h1 className="srx-claim" id="srx-claim">
            Your server, online in 60 seconds.
          </h1>

          <div className="srx-sheet-body">
            <div className="srx-sheet-lead">
              <p className="srx-lede">
                Windows or Linux, USA or EU. Full administrator access, NVMe storage and unlimited
                transfer on every plan — from €{priceText(lowestMonthly)}/month.
              </p>

              <div className="srx-actions">
                <Button asChild size="lg" className="srx-btn-primary">
                  <a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">
                    Deploy a server
                    <ArrowRight />
                  </a>
                </Button>
                <Link className="srx-quiet" href="/plans">
                  Compare all {planTotal} plans
                  <ArrowRight />
                </Link>
              </div>
            </div>

            <dl className="srx-keyfacts">
              <div>
                <dt>Orders</dt>
                <dd>10,000+ delivered</dd>
              </div>
              <div>
                <dt>Entry</dt>
                <dd>€{priceText(lowestMonthly)} / month</dd>
              </div>
              <div>
                <dt>Plans</dt>
                <dd>{planTotal}</dd>
              </div>
              <div>
                <dt>Images</dt>
                <dd>Windows + Linux</dd>
              </div>
              <div>
                <dt>Access</dt>
                <dd>Full administrator</dd>
              </div>
              <div>
                <dt>Regions</dt>
                <dd>USA + EU</dd>
              </div>
              <div>
                <dt>Uptime SLA</dt>
                <dd>99.9%</dd>
              </div>
              <div>
                <dt>Money-back</dt>
                <dd>7 days</dd>
              </div>
            </dl>
          </div>
        </section>

        <StateRule />

        <LiveLedger />

        <Clause index="01" label="Capacity" title={`${planTotal} plans. Every specification, one table.`}>
          <PlanInventory />
          <p className="srx-note">
            Specifications, stock and prices are read from the live plan catalogue. Availability
            shown here is the availability published with the catalogue — confirm it in checkout.
            Billing, invoices and client accounts stay in{' '}
            <a href="https://dash.stealthrdp.com/index.php?rp=/login">the StealthRDP client area</a>.
          </p>
        </Clause>

        <Clause index="02" label="Hardware" title="What a server is made of.">
          <ul className="srx-facts-list">
            {hardware.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="srx-fact-mark" aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Clause>

        <Clause
          index="03"
          label="Systems"
          title={`${systems.length} images. Windows or Linux, your choice at deploy.`}
        >
          <ul className="srx-systems">
            {systems.map(system => (
              <li className="srx-mono" key={system}>
                {system}
              </li>
            ))}
          </ul>
          <p className="srx-note">
            Windows and Linux images are available across the range. Confirm the exact image and
            current stock in checkout.
          </p>
        </Clause>

        <Clause index="04" label="Regions" title="Two regions, monitored in the open.">
          <div className="srx-regions">
            {regions.map(region => (
              <article key={region.code}>
                <h3 className="srx-region-code srx-mono">{region.code}</h3>
                <p className="srx-region-count srx-mono">
                  {regionCount(region.match)} monitor
                  {regionCount(region.match) === 1 ? '' : 's'} reporting
                </p>
                <p className="srx-region-text">{region.description}</p>
                <Link className="srx-quiet" href="/plans">
                  View {region.code} plans
                  <ArrowRight />
                </Link>
              </article>
            ))}
          </div>
        </Clause>

        <Clause index="05" label="The record" title="What operators publish about us.">
          <OperatorRecord />
        </Clause>

        <section className="srx-close" aria-labelledby="srx-close-title">
          <div className="srx-close-body">
            <h2 className="srx-close-title" id="srx-close-title">
              Start with one server.
            </h2>
            <p className="srx-close-text">
              {reportingTotal} of {monitorTotal} monitors reporting. Choose a plan, choose a region,
              and the client area handles billing and access.
            </p>
          </div>
          <div className="srx-actions">
            <Button asChild size="lg" className="srx-btn-primary">
              <a href="https://dash.stealthrdp.com/index.php?rp=/store">
                Deploy a server
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="srx-btn-quiet">
              <a href="https://dash.stealthrdp.com/submitticket.php">Ask a pre-sales question</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
