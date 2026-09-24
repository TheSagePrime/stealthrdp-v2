import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/Helpers';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/about',
  title: 'About Us — StealthRDP',
  description: 'StealthRDP provides high-performance remote desktop and VPS infrastructure with 10,000+ orders worldwide.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const reasons = [
  { title: 'Speed of deployment', text: 'Full server access within 60 seconds of purchase for standard provisioning flows.' },
  { title: 'Enterprise-grade hardware', text: 'NVMe storage and isolated virtual machine instances.' },
  { title: 'Transparent operations', text: 'A public status page keeps production-node health visible.' },
  { title: 'Support that answers', text: 'Technical assistance is available around the clock through the normal support channels.' },
  { title: 'Flexible plans', text: 'USA and EU locations, monthly to biannual billing, and a build-your-own configurator.' },
];

const proof = [
  { value: '10,000+', label: 'orders' },
  { value: 'USA + EU', label: 'server regions' },
  { value: '99.9%', label: 'uptime SLA' },
  { value: '24/7', label: 'monitoring and support availability' },
];

export default function AboutPage() {
  return (
    <>
      <section className="sr-page-hero">
        <div className="sr-container">
          <p className="sr-kicker">Who we are</p>
          <h1 className="sr-title">Built for people who need servers that <span>just work.</span></h1>
          <p className="sr-lede">
            StealthRDP exists to remove friction from remote infrastructure — deploy fast,
            get full control, and spend less time thinking about the hardware underneath.
          </p>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">What we do</p>
            <h2 className="sr-section-title">Remote desktop and VPS infrastructure, without the maze.</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              We provide high-performance remote desktop and virtual private server infrastructure.
              Current StealthRDP plans use NVMe storage, dedicated IPv4 addresses, and high-speed network connectivity.
            </p>
            <p>
              The public website handles product discovery, documentation, status, and support information.
              Checkout, billing, and client-account flows continue through the existing StealthRDP client area.
            </p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Why people choose us</p>
              <h2 className="sr-section-title">Operational details stay visible.</h2>
            </div>
            <p>Fast deployment, clear infrastructure boundaries, visible service health, and flexible plans are part of the product—not footnotes.</p>
          </div>
          <div className="srv3-about-reasons">
            {reasons.map(({ title, text }, index) => (
              <Card
                key={title}
                className={cn(
                  'sm:min-h-48',
                  index === 0 && 'bg-surface-2 lg:row-span-2 lg:min-h-96',
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
              <p className="sr-kicker">Trusted at scale</p>
              <h2 className="sr-section-title">10,000+ orders and counting.</h2>
            </div>
            <p>StealthRDP has served remote work, web hosting, trading infrastructure, automation, development, and general VPS workloads.</p>
          </div>

          <Card>
            <CardContent>
              <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
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
        <div className="sr-container sr-cta sr-cta-premium">
          <div>
            <p className="sr-kicker">Questions about the infrastructure?</p>
            <h2>Talk to the StealthRDP team.</h2>
            <p>Use the existing support system for pre-sales questions, account help, and service assistance.</p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                Talk to our team
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://dash.stealthrdp.com/index.php?rp=/store">View server plans</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
