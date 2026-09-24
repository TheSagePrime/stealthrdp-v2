import {
  ArrowRight,
  Cpu,
  Globe2,
  HardDrive,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
            <Badge variant="outline">Infrastructure-first hosting</Badge>
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
            <div>
              <span>Starting at</span>
              <strong>
                €{startingPlan?.pricing.monthly.amount.toFixed(2) ?? '9.50'}
                <small>/mo</small>
              </strong>
            </div>
            <span className="srv3-hero-price-divider" aria-hidden="true" />
            <div>
              <span>Entry plan</span>
              <b>{startingPlan?.name ?? 'Bronze USA'}</b>
              <small>Dedicated IPv4 included</small>
            </div>
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

        <div className="srv3-hero-visual" aria-hidden="true">
          <div className="srv3-rack-stage">
            <div className="srv3-rack-shell">
              <div className="srv3-rack-top">
                <div>
                  <span className="srv3-rack-brand">STEALTHRDP</span>
                  <small>Virtual infrastructure</small>
                </div>
                <span className="srv3-rack-model">VPS platform</span>
              </div>

              <div className="srv3-rack">
                {[0, 1, 2, 3].map(index => (
                  <div className="srv3-rack-unit" key={index}>
                    <div className="srv3-rack-unit-left">
                      <span className="srv3-rack-led" />
                      <Server aria-hidden="true" />
                    </div>
                    <div className="srv3-rack-unit-center">
                      <span className="srv3-rack-line" />
                      <span className="srv3-rack-line srv3-rack-line-short" />
                    </div>
                    <div className="srv3-rack-unit-right">
                      <span className="srv3-rack-port" />
                      <span className="srv3-rack-port" />
                      <span className="srv3-rack-port" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="srv3-rack-footer">
                <span><Cpu /> Isolated VMs</span>
                <span><HardDrive /> NVMe storage</span>
                <span><Zap /> Fast provisioning</span>
              </div>
            </div>

            <div className="srv3-region-dock">
              <div>
                <Globe2 aria-hidden="true" />
                <span><strong>USA</strong><small>North America</small></span>
              </div>
              <div>
                <Globe2 aria-hidden="true" />
                <span><strong>EU</strong><small>Europe</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
