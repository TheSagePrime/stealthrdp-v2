import type { Metadata } from 'next';
import { ArrowRight, Check, Globe2, Headphones, ShieldCheck, Zap } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { testimonials } from '@/lib/stealth/content';
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
      'Fast Windows and Linux VPS hosting in USA and Europe with NVMe storage, dedicated IPv4 and direct support.',
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

const benefits = [
  { icon: Zap, title: 'Fast deployment', text: 'Get a server online quickly and start working without a long provisioning queue.' },
  { icon: ShieldCheck, title: 'Built for real workloads', text: 'NVMe storage, dedicated IPv4 and isolated virtual machines across the VPS range.' },
  { icon: Globe2, title: 'USA + Europe', text: 'Choose the region that fits your users, latency and day-to-day operations.' },
  { icon: Headphones, title: 'Human support', text: 'Need help before or after checkout? Open a ticket and talk to the StealthRDP team.' },
];

const stacks = [
  ['Windows VPS', 'Remote desktop, automation, trading and Windows-only software.'],
  ['Linux VPS', 'Web apps, bots, VPNs, monitoring, development and self-hosted tools.'],
];

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

      <section className="v3-hero">
        <div className="sr-container v3-hero-grid">
          <div className="v3-hero-copy">
            <div className="v3-eyebrow"><span /> Windows + Linux VPS · USA + Europe</div>
            <h1>Fast VPS hosting for work that cannot wait.</h1>
            <p>
              Deploy Windows or Linux on high-performance VPS infrastructure with
              NVMe storage, dedicated IPv4 and straightforward pricing.
            </p>
            <div className="v3-actions">
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store">
                  Explore servers <ArrowRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/plans">View pricing</Link>
              </Button>
            </div>
            <div className="v3-hero-proof">
              <span><Check /> 99.9% uptime SLA</span>
              <span><Check /> Dedicated IPv4</span>
              <span><Check /> Full admin access</span>
            </div>
          </div>

          <div className="v3-hero-art" aria-label="StealthRDP infrastructure illustration">
            <div className="v3-orbit" />
            <div className="v3-rack">
              <div className="v3-rack-top">
                <span>STEALTHRDP / EDGE</span>
                <b>ONLINE</b>
              </div>
              {[0,1,2,3,4].map(index => (
                <div className="v3-rack-row" key={index}>
                  <div className="v3-rack-lights"><i /><i /><i /></div>
                  <span>NVMe compute node {String(index + 1).padStart(2, '0')}</span>
                  <b>{index % 2 === 0 ? 'USA' : 'EU'}</b>
                </div>
              ))}
              <div className="v3-rack-foot">
                <span>Low-latency network</span>
                <span>Dedicated IPv4</span>
              </div>
            </div>
            <div className="v3-art-pill v3-art-pill-a">Windows + Linux</div>
            <div className="v3-art-pill v3-art-pill-b">NVMe storage</div>
          </div>
        </div>
      </section>

      <section className="v3-proofbar" aria-label="Why StealthRDP">
        <div className="sr-container">
          <span>Instant setup</span><span>NVMe storage</span><span>Dedicated IPv4</span>
          <span>Unlimited bandwidth</span><span>24/7 support</span>
        </div>
      </section>

      <section className="v3-section" id="plans">
        <div className="sr-container">
          <div className="v3-section-head">
            <div>
              <p className="v3-kicker">Popular servers</p>
              <h2>Pick a plan. Scale when you need more.</h2>
            </div>
            <Link href="/plans">Compare all plans <ArrowRight /></Link>
          </div>
          <PricingExplorer compact guided={false} variant="cards" />
        </div>
      </section>

      <section className="v3-section v3-section-soft">
        <div className="sr-container">
          <div className="v3-section-head v3-section-head-centered">
            <div>
              <p className="v3-kicker">Why StealthRDP</p>
              <h2>Infrastructure without the enterprise theatre.</h2>
              <p>Clear specs, practical locations, and a buying flow that gets out of your way.</p>
            </div>
          </div>
          <div className="v3-benefit-grid">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <div className="v3-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v3-section">
        <div className="sr-container v3-split">
          <div>
            <p className="v3-kicker">Choose your stack</p>
            <h2>Windows when you need it. Linux when you do not.</h2>
            <p className="v3-copy">
              Use the operating system that fits the workload instead of forcing the
              workload around the host.
            </p>
            <div className="v3-stack-list">
              {stacks.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="v3-stack-visual">
            <div className="v3-stack-window v3-stack-window-a">
              <span>WINDOWS VPS</span><b>Remote desktop ready</b>
            </div>
            <div className="v3-stack-window v3-stack-window-b">
              <span>LINUX VPS</span><b>Root access ready</b>
            </div>
          </div>
        </div>
      </section>

      <section className="v3-section v3-section-soft">
        <div className="sr-container">
          <div className="v3-section-head">
            <div>
              <p className="v3-kicker">Global reach</p>
              <h2>Deploy in the USA or Europe.</h2>
              <p>Two practical regions, one consistent buying and support experience.</p>
            </div>
            <Link href="/status">View service status <ArrowRight /></Link>
          </div>
          <div className="v3-location-grid">
            <article>
              <span className="v3-location-code">USA</span>
              <h3>United States</h3>
              <p>For North American users, remote desktops, bots, sites and general-purpose workloads.</p>
              <Link href="/plans">View USA plans <ArrowRight /></Link>
            </article>
            <article>
              <span className="v3-location-code">EU</span>
              <h3>Europe</h3>
              <p>European capacity for regional audiences, infrastructure and latency-sensitive access.</p>
              <Link href="/plans">View EU plans <ArrowRight /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="v3-section">
        <div className="sr-container">
          <div className="v3-section-head v3-section-head-centered">
            <div>
              <p className="v3-kicker">Customer feedback</p>
              <h2>Trusted by people who actually run servers.</h2>
            </div>
          </div>
          <div className="v3-review-grid">
            {testimonials.slice(0, 3).map((item, index) => (
              <article key={item.id ?? item._id ?? index}>
                <span className="v3-quote">“</span>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <strong>{item.authorName}</strong>
                  <span>{item.publishedOn || item.authorCompany || 'StealthRDP customer'}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v3-section v3-final-wrap">
        <div className="sr-container">
          <div className="v3-final">
            <div>
              <p className="v3-kicker">Ready to deploy?</p>
              <h2>Choose a server and get back to the work.</h2>
              <p>Windows and Linux VPS plans with USA and Europe locations.</p>
            </div>
            <div className="v3-actions">
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store">
                  Explore servers <ArrowRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://dash.stealthrdp.com/submitticket.php">Talk to support</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
