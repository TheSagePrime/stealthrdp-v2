/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ClockCounterClockwise,
  Globe,
  HardDrive,
  Lightning,
  MapPin,
  Pulse,
  TerminalWindow,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { AboutMap } from '@/components/site/about/AboutMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { testimonials } from '@/lib/stealth/content';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { aboutJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/about',
  title: 'About Us — StealthRDP',
  description: 'StealthRDP runs Windows and Linux VPS from Phoenix, Arizona and Amsterdam, Netherlands, with 12,000+ VPS deployed and 24/7 support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const proof = [
  { value: '12,000+', label: 'VPS deployed' },
  { value: '2', label: 'data centers, USA and EU' },
  { value: '60 sec', label: 'typical setup' },
  { value: '24/7', label: 'support' },
];

const standards = [
  {
    label: 'Setup',
    title: 'Live in about 60 seconds',
    text: 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.',
    icon: Lightning,
  },
  {
    label: 'Control',
    title: 'Administrator or root access',
    text: 'Full Administrator access on Windows and full root access on Linux, from the first login.',
    icon: TerminalWindow,
  },
  {
    label: 'Network',
    title: 'A dedicated IPv4 address',
    text: 'Every server has its own IPv4 address. Need a new one? Support changes it for €5.',
    icon: Globe,
  },
  {
    label: 'Storage',
    title: 'NVMe on every plan',
    text: 'NVMe storage on every plan, in the USA and in Europe.',
    icon: HardDrive,
  },
  {
    label: 'Backups',
    title: 'Weekly backups',
    text: 'Every server is backed up once a week.',
    icon: ClockCounterClockwise,
  },
  {
    label: 'Uptime',
    title: 'Measured uptime, in public',
    text: 'The status page shows 30- and 90-day uptime and incidents for each monitored service.',
    icon: Pulse,
  },
];

const regions = [
  {
    city: 'Phoenix, Arizona',
    region: 'USA' as const,
    text: 'The data center for USA plans. Choose it for users and services in North America.',
  },
  {
    city: 'Amsterdam, Netherlands',
    region: 'EU' as const,
    text: 'The data center for EU plans. Choose it for users and services in Europe.',
  },
];

/* Three real Trustpilot reviews, each linked to its source. */
const quotes = testimonials.filter(item => item.sourceUrl?.includes('trustpilot.com')).slice(0, 3);

export const revalidate = 21600;

export default async function AboutPage() {
  await requirePageLocale('/about');
  const plans = await getPlans();
  const seo = getSeoConfig();
  const from = (region: 'USA' | 'EU') => {
    const prices = plans.filter(plan => plan.location === region).map(plan => plan.pricing.monthly.amount);
    return prices.length ? `From €${Math.min(...prices).toFixed(2)}/month` : null;
  };
  const vpsFrom = Math.min(...plans.map(plan => plan.pricing.monthly.amount));

  return (
    <div className="srv-page srv-page-about">
      <ProductionJsonLd data={aboutJsonLd(seo.siteUrl, seo.brand)} />

      <section className="sr-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">About StealthRDP</p>
            <h1 className="sr-title">
              Built for people who need servers that
              {' '}
              <span>just work.</span>
            </h1>
            <p className="sr-lede">
              StealthRDP runs Windows and Linux VPS from data centers in Phoenix, Arizona and
              Amsterdam, Netherlands. Choose a plan, pay, and most servers are live within 60 seconds,
              with full Administrator or root access.
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <Link href="/plans">
                  Compare VPS plans
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/status">View server status</Link>
              </Button>
            </div>
          </div>
          <AboutMap plans={plans} />
        </div>
      </section>

      <section className="sr-section srv-about-proof" aria-label="StealthRDP in numbers">
        <div className="sr-container">
          <Card className="srv-about-stats-strip">
            <CardContent>
              <dl>
                {proof.map(({ value, label }) => (
                  <div key={label}>
                    <dt>{value}</dt>
                    <dd>{label}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">What we do</p>
              <h2>Two products, one support team.</h2>
            </div>
            <p>
              A VPS for the work you run, and Citadel for the websites you need to keep online. They
              are separate products: Citadel does not need a StealthRDP VPS.
            </p>
          </div>

          <ul className="srv-guide-grid srv-about-products">
            <li>
              <Link href="/plans" className="srv-guide-card">
                <strong>Windows and Linux VPS</strong>
                <small>
                  {`Windows Server 2019, 2022 and 2025, or Linux such as Ubuntu, Debian and AlmaLinux. NVMe storage, a dedicated IPv4 address and weekly backups on every plan. From €${vpsFrom.toFixed(2)}/month.`}
                </small>
                <span>
                  Compare VPS plans
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/citadel" className="srv-guide-card">
                <strong>Citadel DDoS protection</strong>
                <small>
                  Layer 7 protection for HTTP and HTTPS sites and applications. Starter €0, Growth €49
                  and Scale €149 per month.
                </small>
                <span>
                  Explore Citadel
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">How we run it</p>
              <h2>The same standard on every server.</h2>
            </div>
            <p>
              Whichever plan or operating system you choose, every StealthRDP VPS comes with these.
            </p>
          </div>

          <ul className="srv-why-grid" data-columns="3">
            {standards.map(({ label, title, text, icon: Icon }) => (
              <li key={title} className="srv-why-card">
                <span className="srv-why-icon">
                  <Icon aria-hidden="true" weight="fill" />
                </span>
                <span className="srv-why-label">{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">Where your server runs</p>
              <h2>Two data centers, one in each region.</h2>
            </div>
            <p>
              Each plan shows its region. Pick the one closest to your users and the services you
              connect to.
            </p>
          </div>

          <ul className="srv-why-grid" data-columns="2">
            {regions.map(({ city, region, text }) => (
              <li key={city} className="srv-why-card">
                <span className="srv-why-icon">
                  <MapPin aria-hidden="true" weight="fill" />
                </span>
                <span className="srv-why-label">{`${region} plans`}</span>
                <h3>{city}</h3>
                <p>{text}</p>
                {from(region) && <p className="srv-about-price">{from(region)}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {quotes.length > 0 && (
        <section className="sr-section sr-section-border">
          <div className="sr-container srv-section-stack">
            <div className="srv-section-head">
              <div>
                <p className="srv-kicker">Customer reviews</p>
                <h2>What customers say on Trustpilot.</h2>
              </div>
              <p>Unedited reviews from our customers, each linked to its source.</p>
            </div>

            <ul className="srv-about-reviews">
              {quotes.map(item => (
                <li key={item.sourceUrl}>
                  <figure>
                    <blockquote>{`“${item.quote}”`}</blockquote>
                    <figcaption>
                      <span>{`${item.authorName}${item.publishedOn ? ` · ${item.publishedOn}` : ''}`}</span>
                      <a href={item.sourceUrl} rel="noopener noreferrer" target="_blank">View on Trustpilot</a>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sr-section">
        <div className="sr-container sr-cta sr-cta-premium srv-site-final">
          <div>
            <p className="sr-kicker">Questions about our infrastructure?</p>
            <h2>Talk to our team.</h2>
            <p>
              Support is available 24/7 on WhatsApp, through client-area tickets and at
              support@stealthrdp.com. Billing, invoices and tickets live in your client area.
            </p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                Talk to our team
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://wa.me/447441426993">Message WhatsApp support</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
