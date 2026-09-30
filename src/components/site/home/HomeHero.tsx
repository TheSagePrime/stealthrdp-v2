import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const osList = [
  'Windows Server',
  'Ubuntu',
  'Debian',
  'Rocky / AlmaLinux',
  'More Linux & BSD images',
] as const;

const deploySteps = [
  'reserving dedicated vCPU',
  'provisioning NVMe storage',
  'installing Windows Server 2022',
  'provisioning an isolated VM',
] as const;

const deploySpecs = [
  ['2', 'vCPU'],
  ['4', 'GB RAM'],
  ['60', 'GB NVMe'],
  ['250', 'Mbps'],
] as const;

export function HomeHero() {
  return (
    <section className="srv3-hero">
      <div className="sr-container srv3-hero-grid">
        <div className="srv3-hero-copy">
          <div className="srv3-eyebrow">
            <span className="srv3-eyebrow-dot" aria-hidden="true" />
            Windows & Linux VPS · Instant Setup
          </div>

          <h1>
            Your server.
            <span>Live in 60 seconds.</span>
          </h1>

          <p className="srv3-hero-lede">
            High-performance remote desktop infrastructure without the complexity. Enterprise
            hardware and a 99.9% uptime SLA — online the moment you pay.
          </p>

          <div className="srv3-hero-actions">
            <Button asChild size="lg">
              <a href="#plans">
                Choose Your Server
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                Talk to Sales
              </a>
            </Button>
          </div>

          <p className="srv3-hero-price">
            Starting at only <strong>€9.50/month</strong> · No hidden fees · Cancel
            anytime · 7-day money-back
          </p>

          <div className="srv3-hero-os" aria-label="Supported operating systems">
            <span>Works with</span>
            <ul>
              {osList.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="srv3-hero-visual" aria-hidden="true">
          <Card className="w-full max-w-md gap-4 p-6">
            <p className="text-small font-semibold text-body-text">stealth deploy</p>
            <pre className="overflow-x-auto rounded-md bg-surface-2 p-4 text-small text-body-text">
              <code>$ stealth deploy --plan silver-usa --region us-east</code>
            </pre>
            <ul className="grid gap-1.5 text-small text-body-muted">
              {deploySteps.map(step => (
                <li key={step}>▸ {step}</li>
              ))}
              <li className="font-semibold text-body-text">✓ Windows Server 2022 ready in 60s</li>
            </ul>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t border-divider pt-4">
              {deploySpecs.map(([value, label]) => (
                <div key={label} className="grid gap-0.5">
                  <dt className="sr-visually-hidden">{label}</dt>
                  <dd className="text-body font-semibold text-body-text">
                    {value} <small className="text-small font-normal text-body-muted">{label}</small>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </section>
  );
}
