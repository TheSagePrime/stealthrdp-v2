import { ArrowRight, Cpu, Globe2, HardDrive, Server, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { plans } from '@/lib/stealth/content';

const availablePlans = plans.filter(plan => plan.source.availability !== 'out-of-stock');
const startingPlan = [...availablePlans].sort(
  (a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount,
)[0];

const heroFacts = [
  { icon: Cpu, label: 'Full admin access' },
  { icon: HardDrive, label: 'NVMe storage' },
  { icon: Globe2, label: 'USA + EU' },
  { icon: ShieldCheck, label: '99.9% uptime SLA' },
] as const;

export function HomeHero() {
  return (
    <section className="srv3-hero">
      <div className="sr-container srv3-hero-grid">
        <div className="srv3-hero-copy">
          <div className="srv3-eyebrow">
            <span className="srv3-eyebrow-dot" aria-hidden="true" />
            Windows & Linux VPS
          </div>

          <h1>
            Fast servers.
            <span>Less hosting friction.</span>
          </h1>

          <p className="srv3-hero-lede">
            Deploy a VPS with full administrative access, NVMe storage and flexible
            billing across USA and Europe.
          </p>

          <div className="srv3-hero-actions">
            <Button asChild size="lg">
              <Link href="/plans">
                Explore servers
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://dash.stealthrdp.com/index.php?rp=/store">View pricing</a>
            </Button>
          </div>

          <div className="srv3-hero-price">
            <span>Starting at</span>
            <strong>
              €{startingPlan?.pricing.monthly.amount.toFixed(2) ?? '9.50'}
              <small>/mo</small>
            </strong>
            <span>{startingPlan?.name ?? 'Bronze USA'} · Dedicated IPv4</span>
          </div>

          <ul className="srv3-hero-facts" aria-label="VPS highlights">
            {heroFacts.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="srv3-hero-visual" aria-label="StealthRDP infrastructure illustration">
          <div className="srv3-orbit srv3-orbit-one" aria-hidden="true" />
          <div className="srv3-orbit srv3-orbit-two" aria-hidden="true" />

          <div className="srv3-rack-shell">
            <div className="srv3-rack-top">
              <span>STEALTHRDP</span>
              <span>INFRASTRUCTURE</span>
            </div>

            <div className="srv3-rack">
              {[0, 1, 2, 3].map(index => (
                <div className="srv3-rack-unit" key={index}>
                  <span className="srv3-rack-led" />
                  <span className="srv3-rack-line" />
                  <span className="srv3-rack-line srv3-rack-line-short" />
                  <span className="srv3-rack-port" />
                  <span className="srv3-rack-port" />
                </div>
              ))}
            </div>

            <div className="srv3-rack-footer">
              <span><Server /> Virtual machines</span>
              <span><Zap /> Rapid setup</span>
            </div>
          </div>

          <div className="srv3-visual-tag srv3-visual-tag-us">
            <Globe2 />
            <span><strong>USA</strong> region</span>
          </div>
          <div className="srv3-visual-tag srv3-visual-tag-eu">
            <Globe2 />
            <span><strong>EU</strong> region</span>
          </div>
        </div>
      </div>
    </section>
  );
}
