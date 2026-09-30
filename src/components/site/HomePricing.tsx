/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { BillingCycle, Plan } from '@/lib/stealth/content';
import Link from 'next/link';
/* Homepage pricing configurator: interaction/state here, visual language in stealth-v3.css. */
import { useMemo, useState } from 'react';
import { PricingColumn } from '@/components/launchui/pricing-column';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {

  checkoutUrl,

} from '@/lib/stealth/content';

const cycles: BillingCycle[] = ['monthly', 'quarterly', 'semiannual', 'annual', 'biannual'];

const months: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  annual: 12,
  biannual: 24,
};

const cycleLabel: Record<BillingCycle, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  semiannual: '6-month',
  annual: 'Annual',
  biannual: '2-year',
};

const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

function tierName(plan: Plan) {
  return plan.name.replace(/ USA| EU/g, '');
}

export function HomePricing({ plans }: { plans: Plan[] }) {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const visible = useMemo(() => (
    plans
      .filter(plan => plan.location === region)
      .sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount)
      .slice(0, 4)
  ), [plans, region]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="srv-pricing-controls">
        <div className="srv-pricing-control-card srv-pricing-region">
          <div className="srv-selector" role="group" aria-label="Deployment region">
            {(['USA', 'EU'] as const).map(item => (
              <button
                key={item}
                type="button"
                className="srv-selector-option"
                data-selected={region === item}
                aria-pressed={region === item}
                onClick={() => setRegion(item)}
              >
                <span className="srv-selector-dot" aria-hidden="true" />
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="srv-pricing-control-card srv-pricing-billing">
          <div className="srv-billing-rail" role="group" aria-label="Billing cycle">
            {cycles.map(item => (
              <button
                key={item}
                type="button"
                className="srv-billing-option"
                data-selected={cycle === item}
                aria-pressed={cycle === item}
                onClick={() => setCycle(item)}
              >
                {cycleLabel[item]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="
        srv-home-pricing-grid grid grid-cols-1 gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
      >
        {visible.map((plan) => {
          const price = plan.pricing[cycle];
          const monthEquivalent = price.amount / months[cycle];
          const osLabel = plan.source.os === 'linux-only' ? 'Linux only' : 'Windows + Linux';
          const featured = plan.popular;
          const available = plan.source.availability !== 'out-of-stock';

          return (
            <div key={plan.name} className="srv-home-pricing-item">
              <PricingColumn
                className="srv-home-pricing-card srv-home-pricing-card-desktop"
                name={plan.name}
                description={osLabel}
                featured={featured}
                badge={featured ? <Badge variant="outline">Most popular</Badge> : null}
                price={(
                  <span>
                    €
                    {format(price.amount)}
                    <span className="
                      ml-1 text-base font-medium text-muted-foreground
                    "
                    >
                      {price.suffix}
                    </span>
                  </span>
                )}
                priceNote={cycle === 'monthly'
                  ? 'Billed monthly'
                  : `€${monthEquivalent.toFixed(2)}/mo effective · due today`}
                cta={{
                  label: available ? `Choose ${tierName(plan)}` : 'Out of stock',
                  href: available ? checkoutUrl(plan, cycle) : undefined,
                  disabled: !available,
                }}
                features={[
                  plan.specs.cpu,
                  plan.specs.ram,
                  plan.specs.storage,
                  `${plan.specs.bandwidth} bandwidth`,
                  'Dedicated IPv4',
                ]}
                footer={(
                  <span className={available
                    ? 'font-medium text-status-ok'
                    : `font-medium text-muted-foreground`}
                  >
                    {plan.source.stock !== undefined
                      ? `${plan.source.stock} available`
                      : available ? 'In stock' : 'Out of stock'}
                  </span>
                )}
              />

              <article className="srv-mobile-plan-card" data-featured={featured || undefined}>
                <header className="srv-mobile-plan-head">
                  <div>
                    <div className="srv-mobile-plan-title-row">
                      <h3>{plan.name}</h3>
                      {featured ? <Badge variant="outline">Popular</Badge> : null}
                    </div>
                    <p>{osLabel}</p>
                  </div>
                  <span className={available
                    ? 'srv-mobile-stock is-available'
                    : `srv-mobile-stock`}
                  >
                    {plan.source.stock !== undefined
                      ? `${plan.source.stock} left`
                      : available ? 'In stock' : 'Out of stock'}
                  </span>
                </header>

                <div className="srv-mobile-plan-price">
                  <strong>
                    €
                    {format(price.amount)}
                  </strong>
                  <span>{price.suffix}</span>
                </div>
                <p className="srv-mobile-plan-note">
                  {cycle === 'monthly'
                    ? 'Billed monthly'
                    : `€${monthEquivalent.toFixed(2)}/mo effective · due today`}
                </p>

                <dl className="srv-mobile-plan-specs">
                  <div>
                    <dt>CPU</dt>
                    <dd>{plan.specs.cpu}</dd>
                  </div>
                  <div>
                    <dt>RAM</dt>
                    <dd>{plan.specs.ram}</dd>
                  </div>
                  <div>
                    <dt>Storage</dt>
                    <dd>{plan.specs.storage}</dd>
                  </div>
                </dl>

                <details className="srv-mobile-plan-more">
                  <summary>View full specs</summary>
                  <ul>
                    <li>{plan.specs.cpu}</li>
                    <li>{plan.specs.ram}</li>
                    <li>{plan.specs.storage}</li>
                    <li>
                      {plan.specs.bandwidth}
                      {' '}
                      bandwidth
                    </li>
                    <li>Dedicated IPv4</li>
                  </ul>
                </details>

                {available
                  ? (
                      <Button asChild size="lg" className="srv-mobile-plan-cta">
                        <a href={checkoutUrl(plan, cycle)}>
                          Choose
                          {tierName(plan)}
                        </a>
                      </Button>
                    )
                  : (
                      <Button size="lg" className="srv-mobile-plan-cta" disabled>Out of stock</Button>
                    )}
              </article>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/plans">View all plans</Link>
        </Button>
      </div>
    </div>
  );
}
