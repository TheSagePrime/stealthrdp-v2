/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { BillingCycle, Plan } from '@/lib/stealth/content';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { checkoutUrl } from '@/lib/stealth/content';

/* Homepage plan list: the four entry plans of a region as an aligned spec table. */

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
  semiannual: '6 months',
  annual: 'Annual',
  biannual: '2 years',
};

const money = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(2));

export function HomePricing({ plans }: { plans: Plan[] }) {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const visible = useMemo(() => (
    plans
      .filter(plan => plan.location === region)
      .sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount)
      .slice(0, 4)
  ), [plans, region]);

  /* One recommendation per region: the first plan flagged popular. */
  const popular = visible.find(plan => plan.popular)?.name;

  return (
    <div className="hm-plans">
      <div className="hm-plans-controls">
        <div className="hm-toggle" role="group" aria-label="Region">
          {(['USA', 'EU'] as const).map(item => (
            <button
              key={item}
              type="button"
              aria-pressed={region === item}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="hm-toggle" role="group" aria-label="Billing cycle">
          {cycles.map(item => (
            <button
              key={item}
              type="button"
              aria-pressed={cycle === item}
              onClick={() => setCycle(item)}
            >
              {cycleLabel[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="hm-table" role="table" aria-label={`${region} VPS plans, ${cycleLabel[cycle].toLowerCase()} billing`}>
        <div className="hm-row hm-row-head" role="row">
          <span role="columnheader">Plan</span>
          <span role="columnheader">CPU</span>
          <span role="columnheader">RAM</span>
          <span role="columnheader">Storage</span>
          <span role="columnheader">Price</span>
          <span role="columnheader">Stock</span>
          <span role="columnheader"><span className="sr-visually-hidden">Order</span></span>
        </div>

        {visible.map((plan) => {
          const price = plan.pricing[cycle];
          const available = plan.source.availability !== 'out-of-stock';
          const perMonth = price.amount / months[cycle];

          return (
            <div className="hm-row" role="row" key={plan.name} data-popular={plan.name === popular || undefined}>
              <span role="cell" className="hm-cell-plan">
                <strong>{plan.name}</strong>
                <small>
                  {plan.source.os === 'linux-only' ? 'Linux only' : 'Windows or Linux'}
                  {plan.name === popular ? ' · Popular' : ''}
                </small>
              </span>
              <span role="cell" className="hm-num" data-label="CPU">{plan.specs.cpu.replace(' Core', ' vCPU')}</span>
              <span role="cell" className="hm-num" data-label="RAM">{plan.specs.ram}</span>
              <span role="cell" className="hm-num" data-label="Storage">{plan.specs.storage}</span>
              <span role="cell" className="hm-cell-price" data-label="Price">
                <strong className="hm-num">{`€${money(price.amount)}`}</strong>
                <small>{cycle === 'monthly' ? 'per month' : `${price.suffix} · €${perMonth.toFixed(2)}/mo`}</small>
              </span>
              <span role="cell" className="hm-cell-stock" data-label="Stock" data-available={available}>
                {plan.source.stock !== undefined ? `${plan.source.stock} left` : available ? 'In stock' : 'Sold out'}
              </span>
              <span role="cell" className="hm-cell-order">
                {available
                  ? (
                      <a className="hm-button hm-button-small" href={checkoutUrl(plan, cycle)}>
                        {`Order ${plan.name.replace(/ (USA|EU)$/, '')}`}
                      </a>
                    )
                  : <span className="hm-sold">Sold out</span>}
              </span>
            </div>
          );
        })}
      </div>

      <Link href="/plans" className="hm-more">
        {`All ${plans.filter(plan => plan.location === region).length} ${region} plans, including larger servers`}
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
