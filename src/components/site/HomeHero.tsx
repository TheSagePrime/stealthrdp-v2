/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Plan } from '@/lib/stealth/content';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const included = [
  { label: 'Administrator or root access', detail: 'Full control of the server' },
  { label: 'Dedicated IPv4', detail: 'On every plan' },
  { label: 'Unlimited bandwidth', detail: 'Port speed listed per plan' },
  { label: 'USA or EU region', detail: 'Chosen per plan' },
  { label: 'Linux on every plan', detail: 'Windows Server from Bronze up' },
];

const money = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2));

export function HomeHero({ plans }: { plans: Plan[] }) {
  const fromPrice = Math.min(...plans.map(plan => plan.pricing.monthly.amount));
  const inStock = plans.reduce((total, plan) => total + (plan.source.stock ?? 0), 0);

  return (
    <section className="hm-hero" aria-labelledby="hm-hero-title">
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <h1 id="hm-hero-title">
            Windows and Linux VPS,
            {' '}
            <span>online in about a minute.</span>
          </h1>
          <p className="hm-lede">
            Full administrator or root access, a dedicated IPv4 address and unlimited bandwidth, in a USA or EU
            region. Pick the resources here and choose the operating system at checkout.
          </p>
          <div className="hm-actions">
            <a className="hm-button" href="#plans">
              Compare plans
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="hm-button hm-button-quiet" href="https://dash.stealthrdp.com/submitticket.php">
              Ask a pre-sales question
            </a>
          </div>
        </div>

        <aside className="hm-sheet" aria-label="Included with every plan">
          <p className="hm-sheet-title">Included with every plan</p>
          <dl className="hm-sheet-list">
            {included.map(item => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="hm-sheet-foot">
            <p>
              <span className="hm-sheet-price">
                €
                {money(fromPrice)}
              </span>
              <span className="hm-sheet-unit">/mo to start</span>
            </p>
            <p className="hm-sheet-stock">
              <span aria-hidden="true" className="hm-dot" />
              {`${inStock} servers in stock across ${plans.length} plans`}
            </p>
            <Link href="/plans" className="hm-sheet-link">
              All plans and prices
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
