import type { Metadata } from 'next';
import { Activity, Gauge, Globe2, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';
import { testimonials } from '@/lib/stealth/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    path: '/',
    locale,
    title: 'StealthRDP — Secure Remote Desktop & VPS Infrastructure',
    description: 'Deploy a Windows or Linux VPS in 60 seconds. Enterprise-grade hardware, 99.9% uptime SLA and 24/7 support — from €9.50/month.',
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

const systems = ['Debian','CentOS','Rocky Linux','Ubuntu','Fedora','FreeBSD','Alpine Linux','AlmaLinux','Windows'];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <>
      {jsonLd.map(block => (
        <script key={String(block['@type'])} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }} />
      ))}

      <section className="sr-hero">
        <div className="sr-container sr-hero-grid">
          <div>
            <p className="sr-kicker">Windows & Linux VPS · Instant setup</p>
            <h1 className="sr-title">Your server. <span>Live in 60 seconds.</span></h1>
            <p className="sr-lede">High-performance remote desktop infrastructure without the complexity. Enterprise hardware and a 99.9% uptime SLA — online the moment you pay.</p>
            <div className="sr-actions">
              <Button asChild size="lg"><a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">Deploy your server now</a></Button>
              <Button asChild size="lg" variant="outline"><a href="https://dash.stealthrdp.com/submitticket.php">Ask a pre-sales question</a></Button>
            </div>
            <p className="sr-micro">Starting at €9.50/month · No hidden fees · Cancel anytime · 7-day money-back</p>
            <div className="sr-stats">
              <div className="sr-stat"><strong>10,000+</strong><span>Orders</span></div>
              <div className="sr-stat"><strong>60s</strong><span>Average deploy</span></div>
              <div className="sr-stat"><strong>99.9%</strong><span>Uptime SLA</span></div>
            </div>
          </div>

          <div className="sr-console" aria-label="Server deployment example">
            <div className="sr-console-head"><span className="sr-dot" /><span className="sr-dot" /><span className="sr-dot sr-dot-live" /><small>stealth deploy</small></div>
            <div className="sr-console-body">
              <div className="sr-console-command">$ stealth deploy --plan silver-usa --region us-east</div>
              <div className="sr-console-dim">▸ reserving dedicated vCPU</div>
              <div className="sr-console-dim">▸ provisioning NVMe storage</div>
              <div className="sr-console-dim">▸ installing Windows Server 2022</div>
              <div className="sr-console-dim">▸ provisioning an isolated VM</div>
              <div className="sr-console-ok">✓ server ready for connection</div>
            </div>
            <div className="sr-console-specs">
              <span><b>2</b>vCPU</span><span><b>4 GB</b>RAM</span><span><b>60 GB</b>NVMe</span><span><b>1 Gbps</b>Network</span>
            </div>
          </div>
        </div>
      </section>

      <div className="sr-os-strip">
        <div className="sr-container sr-os-row">
          <span className="sr-os-label">Works with your OS</span>
          {systems.map(system => <span className="sr-os-pill" key={system}>{system}</span>)}
        </div>
      </div>

      <section className="sr-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Choose a workload</p><h2 className="sr-section-title">Plans priced for the work</h2></div>
            <p>Compare USA and EU resources, switch billing periods, and continue directly to the existing StealthRDP checkout.</p>
          </div>
          <PricingExplorer compact />
          <div className="sr-actions"><Button asChild variant="outline"><Link href="/plans">View all plans</Link></Button></div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Core infrastructure</p><h2 className="sr-section-title">Infrastructure that doesn’t flinch</h2></div>
            <p>Fast storage, broad OS choice, visible service health, and support paths designed around operating real servers.</p>
          </div>
          <div className="sr-feature-grid">
            <article className="sr-feature"><HardDrive /><h3>NVMe SSD storage</h3><p>Fast disk I/O for applications, databases, automation, and remote desktops.</p></article>
            <article className="sr-feature"><ShieldCheck /><h3>Isolated virtual machines</h3><p>Dedicated VM boundaries with infrastructure protections and full administrative access.</p></article>
            <article className="sr-feature"><Globe2 /><h3>USA + EU locations</h3><p>Choose the region that best fits your latency, audience, or operational needs.</p></article>
            <article className="sr-feature"><Activity /><h3>Service visibility</h3><p>Public status information and documented support paths when something needs attention.</p></article>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Customer feedback</p><h2 className="sr-section-title">What customers say</h2></div>
            <p>Selected feedback already published by StealthRDP, including third-party review sources where available.</p>
          </div>
          <div className="sr-review-grid">
            {testimonials.slice(0, 6).map((item, index) => (
              <article className="sr-review" key={item.id ?? item._id ?? index}>
                <blockquote>“{item.quote}”</blockquote>
                <footer>{item.authorName}{item.publishedOn ? ` · ${item.publishedOn}` : item.authorCompany ? ` · ${item.authorCompany}` : ''}</footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-cta">
          <div><p className="sr-kicker">Ready when you are</p><h2>Deploy your VPS and get back to the actual work.</h2><p>Windows and Linux choices, USA and EU regions, and the same existing StealthRDP client area for billing and server access.</p></div>
          <div className="sr-actions">
            <Button asChild size="lg"><a href="https://dash.stealthrdp.com/index.php?rp=/store">Deploy server</a></Button>
          </div>
        </div>
      </section>
    </>
  );
}