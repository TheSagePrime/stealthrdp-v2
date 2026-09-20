import type { Metadata } from 'next';
import {
  Activity,
  ArrowRight,
  Clock3,
  Gauge,
  Globe2,
  HardDrive,
  Headphones,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/about',
  title: 'About Us — StealthRDP',
  description: 'StealthRDP provides high-performance remote desktop and VPS infrastructure with 10,000+ orders worldwide.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const reasons = [
  { icon: Zap, title: 'Speed of deployment', text: 'Full server access within 60 seconds of purchase for standard provisioning flows.' },
  { icon: HardDrive, title: 'Enterprise-grade hardware', text: 'NVMe storage and isolated virtual machine instances.' },
  { icon: Activity, title: 'Transparent operations', text: 'A public status page keeps production-node health visible.' },
  { icon: Headphones, title: 'Support that answers', text: 'Technical assistance is available around the clock through the normal support channels.' },
  { icon: Globe2, title: 'Flexible plans', text: 'USA and EU locations, monthly to biannual billing, and a build-your-own configurator.' },
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
          <div className="sr-about-reasons">
            {reasons.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
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

          <div className="sr-about-stats">
            <article><Server /><strong>10,000+</strong><span>orders</span></article>
            <article><Globe2 /><strong>USA + EU</strong><span>server regions</span></article>
            <article><Gauge /><strong>99.9%</strong><span>uptime SLA</span></article>
            <article><Clock3 /><strong>24/7</strong><span>monitoring and support availability</span></article>
          </div>
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
