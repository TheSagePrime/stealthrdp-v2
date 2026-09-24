import type { Metadata } from 'next';
import {
  ArrowRight,
  HardDrive,
  Headphones,
  Monitor,
  Server,
  Settings2,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/plans',
  title: 'Windows & Linux VPS Hosting | USA & EU | StealthRDP',
  description: 'Compare Windows and Linux VPS hosting plans from StealthRDP with USA and EU locations, NVMe storage, flexible billing, and checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const included = [
  { icon: ShieldCheck, title: 'Full admin access', text: 'Control your server from day one.' },
  { icon: HardDrive, title: 'NVMe SSD storage', text: 'Fast disk for everyday workloads.' },
  { icon: Server, title: 'Isolated VMs', text: 'Separate virtual machines per server.' },
  { icon: Zap, title: 'Fast provisioning', text: 'Automated setup after checkout.' },
  { icon: Headphones, title: '24/7 support', text: 'Help when you need it.' },
];

export default function PlansPage() {
  return (
    <>
      <section className="sr-page-hero">
        <div className="sr-container">
          <p className="sr-kicker">Windows and Linux VPS</p>
          <h1 className="sr-title">Windows & Linux VPS <span>hosting plans.</span></h1>
          <p className="sr-lede">
            Compare Windows and Linux VPS hosting plans in one place. Choose a resource level,
            region, operating system, workload, and billing cycle before checkout.
          </p>
        </div>
      </section>

      <section className="sr-section" id="plan-grid">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Standard plans</p>
              <h2 className="sr-section-title">Choose your resource level</h2>
            </div>
            <p>Compare published plan specifications and prices. Checkout confirms current availability.</p>
          </div>
          <PricingExplorer showComparison />
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Choose an operating system</p>
              <h2 className="sr-section-title">Pick the VPS environment that fits your work.</h2>
            </div>
            <p>
              Windows and Linux VPS plans use the same resource comparison. Select the operating
              system that matches your software, administration, and remote-access needs during checkout.
            </p>
          </div>

          <div className="sr-os-choice-grid">
            <article id="windows-vps">
              <div className="sr-choice-icon"><Monitor /></div>
              <div>
                <span className="sr-location-code">Windows VPS</span>
                <h3>Windows VPS for graphical remote access.</h3>
                <p>
                  Choose Windows when your workflow needs a graphical desktop or Microsoft-compatible
                  software. Compare CPU, RAM, NVMe storage, bandwidth, region, and billing cycle above.
                </p>
                <p className="sr-choice-note">
                  Windows licensing is not included. Customers are responsible for their own Microsoft licensing compliance.
                </p>
                <div className="sr-inline-links">
                  <Link href="/windows-vps">Read the Windows VPS hosting guide <ArrowRight /></Link>
                  <Link href="/docs/windows-licensing">Windows licensing <ArrowRight /></Link>
                </div>
              </div>
            </article>

            <article id="linux-vps">
              <div className="sr-choice-icon"><Terminal /></div>
              <div>
                <span className="sr-location-code">Linux VPS</span>
                <h3>Linux VPS for server and open-source workloads.</h3>
                <p>
                  Choose Linux for command-line administration, web hosting, open-source applications,
                  automation, and server tooling. Compare the same resource levels before checkout.
                </p>
                <div className="sr-inline-links">
                  <Link href="/linux-vps">Read the Linux VPS hosting guide <ArrowRight /></Link>
                  <Link href="#comparison">Compare Linux VPS resources <ArrowRight /></Link>
                </div>
              </div>
            </article>
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
          <div className="sr-included-grid">
            {included.map(({ icon: Icon, title, text }) => (
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
        <div className="sr-container sr-byo-panel">
          <div>
            <p className="sr-kicker">For workloads between the lines</p>
            <h2>Build a server around your exact brief.</h2>
            <p>Choose your own CPU, RAM, storage, location, and billing cycle in the server configurator.</p>
          </div>
          <div className="sr-byo-visual" aria-hidden="true">
            <Settings2 />
            <span>CPU · RAM · STORAGE · REGION</span>
          </div>
          <Button asChild size="lg">
            <a href="https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps">
              Configure & Deploy
              <ArrowRight />
            </a>
          </Button>
        </div>
      </section>

    </>
  );
}
