import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { plans, uptime } from '@/lib/stealth/content';

const availablePlans = plans.filter(plan => plan.source.availability !== 'out-of-stock');
const startingPlan = [...availablePlans].sort(
  (a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount,
)[0];
const heroPlans = [...availablePlans]
  .sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount)
  .slice(0, 3);
const monitorsUp = uptime.monitors.filter(monitor => monitor.status === 'up').length;
const allSystemsUp = monitorsUp === uptime.monitors.length;

const heroFacts = [
  'Full admin access',
  'NVMe storage',
  'USA + EU',
  '99.9% uptime SLA',
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
                <ArrowRight size={16} aria-hidden="true" />
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
            {heroFacts.map(label => (
              <li key={label}>{label}</li>
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
                {heroPlans.map(plan => (
                  <a
                    className="srv3-rack-unit srv3-rack-plan"
                    key={plan.name}
                    href={plan.purchaseUrl}
                    aria-label={`Configure ${plan.name} at €${plan.pricing.monthly.amount.toFixed(2)} per month`}
                  >
                    <div className="srv3-rack-unit-left">
                      <span
                        className={`srv3-rack-led${allSystemsUp ? ' srv3-rack-led-live' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="srv3-rack-unit-center">
                      <span className="srv3-rack-plan-name">
                        {plan.name} <small>{plan.location}</small>
                      </span>
                      <span className="srv3-rack-plan-specs">
                        {plan.specs.cpu} · {plan.specs.ram} · {plan.specs.storage}
                      </span>
                    </div>
                    <div className="srv3-rack-unit-right">
                      <span className="srv3-rack-plan-price">
                        €{plan.pricing.monthly.amount.toFixed(2)}
                        <small>/mo</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" />
                    </div>
                  </a>
                ))}
              </div>

              <div className="srv3-rack-footer">
                <span>Isolated VMs</span>
                <span>NVMe storage</span>
                <span>{allSystemsUp ? `${monitorsUp} of ${uptime.monitors.length} nodes up` : 'Status check needed'}</span>
              </div>
            </div>

            <div className="srv3-region-dock">
              <div>
                <span><strong>USA</strong><small>North America</small></span>
              </div>
              <div>
                <span><strong>EU</strong><small>Europe</small></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
