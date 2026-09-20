import type { Metadata } from 'next';
import {
  Activity,
  ArrowRight,
  Cpu,
  Gauge,
  Globe2,
  HardDrive,
  MapPin,
  Network,
  ShieldCheck,
  Zap,
} from 'lucide-react';
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

const highlights = [
  { value: '10,000+', label: 'orders delivered' },
  { value: '99.9%', label: 'uptime SLA' },
  { value: '60 sec', label: 'average deploy' },
  { value: 'USA + EU', label: 'server regions' },
];

const infrastructure = [
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

      <section className="sr-hero">
        <div className="sr-hero-aura" aria-hidden="true" />
        <div className="sr-container sr-hero-grid">
          <div className="sr-hero-copy">
            <div className="sr-kicker-row">
              <span className="sr-live-dot" aria-hidden="true" />
              <p className="sr-kicker">Windows & Linux VPS · Instant setup</p>
            </div>

            <h1 className="sr-title">
              Your server.
              <span>Live in 60 seconds.</span>
            </h1>

            <p className="sr-lede">
              Serious VPS infrastructure without the usual hosting friction.
              Enterprise hardware, full admin access and a 99.9% uptime SLA —
              ready when your work is.
            </p>

            <div className="sr-actions">
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">
                  Deploy a server
                  <ArrowRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/plans">Explore plans</Link>
              </Button>
            </div>

            <p className="sr-micro">
              From €9.50/month · No hidden fees · Cancel anytime · 7-day money-back
            </p>

            <div className="sr-hero-proof" aria-label="StealthRDP highlights">
              {highlights.map(item => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sr-hero-stage" aria-label="StealthRDP infrastructure preview">
            <div className="sr-stage-ring sr-stage-ring-one" aria-hidden="true" />
            <div className="sr-stage-ring sr-stage-ring-two" aria-hidden="true" />

            <div className="sr-stage-node sr-stage-node-us">
              <span>US</span>
              <small>online</small>
            </div>
            <div className="sr-stage-node sr-stage-node-eu">
              <span>EU</span>
              <small>online</small>
            </div>

            <div className="sr-server-card">
              <div className="sr-server-card-head">
                <div>
                  <span className="sr-server-state">
                    <span className="sr-live-dot" aria-hidden="true" />
                    Running
                  </span>
                  <h2>Silver USA</h2>
                </div>
                <div className="sr-server-icon"><Cpu /></div>
              </div>

              <div className="sr-server-metrics">
                <div><span>vCPU</span><strong>2 cores</strong></div>
                <div><span>Memory</span><strong>8 GB</strong></div>
                <div><span>Storage</span><strong>80 GB NVMe</strong></div>
                <div><span>Traffic</span><strong>Unlimited</strong></div>
              </div>

              <div className="sr-server-activity">
                <div className="sr-activity-head">
                  <span>Deployment</span>
                  <strong>Ready</strong>
                </div>
                <div className="sr-activity-track"><span /></div>
                <div className="sr-activity-meta">
                  <span>Windows / Linux</span>
                  <span>USA region</span>
                </div>
              </div>
            </div>

            <div className="sr-stage-float sr-stage-float-speed">
              <Gauge />
              <span><strong>Fast setup</strong><small>built to be ready in minutes</small></span>
            </div>
            <div className="sr-stage-float sr-stage-float-network">
              <Globe2 />
              <span><strong>USA + EU</strong><small>choose your region</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-proof-rail" aria-label="Platform strengths">
        <div className="sr-container sr-proof-rail-inner">
          <span><Zap /> Instant deployment</span>
          <span><ShieldCheck /> 99.9% uptime SLA</span>
          <span><HardDrive /> NVMe storage</span>
          <span><Globe2 /> USA + EU regions</span>
          <span><Activity /> 24/7 monitoring</span>
        </div>
      </section>

      <section className="sr-os-strip">
        <div className="sr-container sr-os-row">
          <span className="sr-os-label">Deploy your preferred OS</span>
          {systems.map(system => <span className="sr-os-pill" key={system}>{system}</span>)}
        </div>
      </section>

      <section className="sr-section sr-pricing-section sr-section-light">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Choose a workload</p>
              <h2 className="sr-section-title">Plans priced for the work</h2>
            </div>
            <p>
              Pick a workload to highlight a practical starting tier, then choose your
              region, operating system, billing cycle, and resources before checkout.
            </p>
          </div>

          <PricingExplorer compact />

          <div className="sr-section-link">
            <Link href="/plans">
              Compare all 11 plans
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border sr-infra-section">
        <div className="sr-container sr-infra-layout">
          <div className="sr-infra-stage">
            <div className="sr-infra-stage-head">
              <div>
                <p className="sr-kicker">Core infrastructure</p>
                <h2 className="sr-section-title">Built for the workload, not the brochure.</h2>
              </div>
              <span className="sr-infra-badge"><Activity /> Live monitoring</span>
            </div>

            <div className="sr-rack" aria-label="Infrastructure status visualization">
              <div className="sr-rack-row">
                <span className="sr-rack-light" />
                <span>Compute node 01</span>
                <strong>online</strong>
              </div>
              <div className="sr-rack-row">
                <span className="sr-rack-light" />
                <span>NVMe storage pool</span>
                <strong>healthy</strong>
              </div>
              <div className="sr-rack-row">
                <span className="sr-rack-light" />
                <span>Network edge</span>
                <strong>connected</strong>
              </div>
              <div className="sr-rack-footer">
                <div><span>Virtualization</span><strong>Isolated VMs</strong></div>
                <div><span>Regions</span><strong>USA + EU</strong></div>
                <div><span>Access</span><strong>Full admin</strong></div>
              </div>
            </div>
          </div>

          <div className="sr-infra-list">
            {infrastructure.map(({ icon: Icon, title, text }, index) => (
              <article key={title}>
                <div className="sr-feature-number">0{index + 1}</div>
                <div className="sr-feature-icon"><Icon /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Two regions. One standard.</p>
              <h2 className="sr-section-title">Put the server closer to the work.</h2>
            </div>
            <p>
              Choose the geography that fits your latency, audience and operational
              needs without changing the way you buy or manage the service.
            </p>
          </div>

          <div className="sr-location-grid">
            <article>
              <div className="sr-location-mark"><MapPin /></div>
              <div>
                <span className="sr-location-code">USA</span>
                <h3>United States</h3>
                <p>Low-friction VPS deployment for North American workloads.</p>
              </div>
              <Link href="/plans">View USA plans <ArrowRight /></Link>
            </article>
            <article>
              <div className="sr-location-mark"><MapPin /></div>
              <div>
                <span className="sr-location-code">EU</span>
                <h3>Europe</h3>
                <p>European VPS capacity for regional users and infrastructure.</p>
              </div>
              <Link href="/plans">View EU plans <ArrowRight /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Customer feedback</p>
              <h2 className="sr-section-title">The part that matters after checkout.</h2>
            </div>
            <p>
              Selected feedback already published by StealthRDP, including
              third-party review sources where available.
            </p>
          </div>

          <div className="sr-review-grid sr-review-grid-premium">
            {testimonials.slice(0, 6).map((item, index) => (
              <article className="sr-review" key={item.id ?? item._id ?? index}>
                <div className="sr-review-mark">“</div>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <strong>{item.authorName}</strong>
                  <span>
                    {item.publishedOn
                      ? item.publishedOn
                      : item.authorCompany
                        ? item.authorCompany
                        : 'StealthRDP customer'}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-cta sr-cta-premium">
          <div>
            <p className="sr-kicker">Ready when you are</p>
            <h2>Deploy the server. Get back to the actual work.</h2>
            <p>
              Windows and Linux choices, USA and EU regions, and the existing
              StealthRDP client area for billing and server access.
            </p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="https://dash.stealthrdp.com/index.php?rp=/store">
                Deploy server
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                Ask a pre-sales question
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
