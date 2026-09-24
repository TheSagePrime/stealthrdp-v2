import type { Metadata } from 'next';
import {
  ArrowRight,
  Monitor,
  Settings2,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';
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
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/plans',
  title: 'Windows & Linux VPS Hosting | USA & EU | StealthRDP',
  description: 'Compare Windows and Linux VPS hosting plans from StealthRDP with USA and EU locations, NVMe storage, flexible billing, and checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const included = [
  { title: 'Full admin access', text: 'Control your server from day one.' },
  { title: 'NVMe SSD storage', text: 'Fast disk for everyday workloads.' },
  { title: 'Isolated VMs', text: 'Separate virtual machines per server.' },
  { title: 'Fast provisioning', text: 'Automated setup after checkout.' },
  { title: '24/7 support', text: 'Help when you need it.' },
];

/* Token utilities for the card link rows, replacing the bespoke .sr-inline-links hook. */
const cardLinkClass = 'inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover';

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

          <div className="grid gap-4 lg:grid-cols-2">
            <Card id="windows-vps">
              <CardHeader>
                <span className="grid size-11 place-items-center rounded-md border border-border-soft bg-surface-2 text-primary">
                  <Monitor aria-hidden="true" className="size-5" />
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
                <p className="rounded-md border-l-2 border-primary bg-surface-2 px-4 py-3 text-small text-body-muted">
                  Windows licensing is not included. Customers are responsible for their own Microsoft licensing compliance.
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex-wrap gap-x-6 gap-y-2">
                <Link href="/windows-vps" className={cardLinkClass}>
                  Read the Windows VPS hosting guide <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href="/docs/windows-licensing" className={cardLinkClass}>
                  Windows licensing <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card id="linux-vps">
              <CardHeader>
                <span className="grid size-11 place-items-center rounded-md border border-border-soft bg-surface-2 text-primary">
                  <Terminal aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">Linux VPS</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>Linux VPS for server and open-source workloads.</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  Choose Linux for command-line administration, web hosting, open-source applications,
                  automation, and server tooling. Compare the same resource levels before checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex-wrap gap-x-6 gap-y-2">
                <Link href="/linux-vps" className={cardLinkClass}>
                  Read the Linux VPS hosting guide <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href="#comparison" className={cardLinkClass}>
                  Compare Linux VPS resources <ArrowRight aria-hidden="true" className="size-4" />
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map(({ title, text }) => (
              <Card key={title}>
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
