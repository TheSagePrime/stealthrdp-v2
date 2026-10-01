/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { AboutMap } from '@/components/site/about/AboutMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPlans } from '@/lib/stealth/live-plans';
import { createPageMetadata } from '@/libs/seo/metadata';
import { cn } from '@/utils/Helpers';

export const metadata: Metadata = createPageMetadata({
  path: '/about',
  title: 'About Us — StealthRDP',
  description: 'StealthRDP provides high-performance remote desktop and VPS infrastructure with 10,000+ orders worldwide.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const reasons = [
  { title: 'Speed of deployment', text: 'Full server access within 60 seconds of purchase. No waiting, no manual provisioning.' },
  { title: 'Enterprise-grade hardware', text: 'NVMe storage and isolated VM instances.' },
  { title: 'Transparent operations', text: 'Live status page showing every production node, monitored 24/7.' },
  { title: 'Quick support', text: 'Quick 24/7 technical help on WhatsApp and through client-area tickets.' },
  { title: 'Flexible plans', text: 'USA and EU locations, monthly to biannual billing, and a build-your-own configurator.' },
];

const proof = [
  { value: '10,000+', label: 'Orders' },
  { value: 'USA + EU', label: 'locations' },
  { value: '24/7', label: 'Uptime monitoring' },
];

export const revalidate = 21600;

export default async function AboutPage() {
  const plans = await getPlans();

  return (
    <div className="srv-page srv-page-about">
      <section className="sr-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Who we are</p>
            <h1 className="sr-title">
              Built for people who need servers that
              <span>just work.</span>
            </h1>
            <p className="sr-lede">
              StealthRDP exists to remove the friction from remote infrastructure — deploy in 60 seconds, get full control, and never worry about the hardware again.
            </p>
          </div>
          <AboutMap plans={plans} />
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <h2 className="sr-section-title">What we do</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              We provide high-performance remote desktop and virtual private server infrastructure. Every StealthRDP server ships with NVMe storage, dedicated IPs, and 250 Mbps network ports with an optional 1 Gbps upgrade — online the moment you pay.
            </p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <h2 className="sr-section-title">Why people choose us</h2>
            </div>
          </div>
          <div className="srv-about-reasons">
            {reasons.map(({ title, text }, index) => (
              <Card
                key={title}
                className={cn(
                  `
                    srv-about-reason
                    sm:min-h-48
                  `,
                  index === 0 && `
                    bg-surface-2
                    lg:row-span-2 lg:min-h-96
                  `,
                )}
              >
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
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <h2 className="sr-section-title">Trusted at scale</h2>
            </div>
            <p>10,000+ orders and counting for remote work, web hosting, trading infrastructure, and always-on automation. Every new server is monitored 24/7 on our public status page and comes with a 7-day money-back guarantee.</p>
          </div>

          <Card className="srv-about-stats-strip">
            <CardContent>
              <dl className="
                grid gap-x-12 gap-y-6
                sm:grid-cols-3
              "
              >
                {proof.map(({ value, label }) => (
                  <div key={label} className="grid content-start gap-1">
                    <dt className="text-heading-4 text-body-text">{value}</dt>
                    <dd className="text-small text-body-dim">{label}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-cta sr-cta-premium srv-site-final">
          <div>
            <p className="sr-kicker">Questions about our infrastructure?</p>
            <h2>Talk to our team.</h2>
            <p>or message WhatsApp support for a quick reply, 24/7.</p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                Talk to our team
                <ArrowRight size={16} />
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
