'use client';

/* Data/state wiring only. Visual primitives are Launch UI pricing columns
   plus shadcn Button / ButtonGroup / Badge from the approved workflow stack. */
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { PricingColumn } from '@/components/launchui/pricing-column';
import {
  billingCycles,
  checkoutUrl,
  plans,
  type BillingCycle,
} from '@/lib/stealth/content';

const homepageCycles: BillingCycle[] = ['monthly', 'annual', 'biannual'];

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

export function HomePricing() {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const visible = useMemo(
    () => plans
      .filter(plan => plan.location === region)
      .filter(plan => plan.source.availability !== 'out-of-stock')
      .slice(0, 3),
    [region],
  );

  const popular = useMemo(
    () => visible.find(plan => plan.popular)?.name ?? visible[0]?.name,
    [visible],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div className="flex flex-col justify-between gap-5 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end sm:p-5">
        <div className="flex flex-wrap gap-5 sm:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Region
            </span>
            <ButtonGroup aria-label="Deployment region">
              {(['USA', 'EU'] as const).map(item => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={region === item ? 'default' : 'outline'}
                  aria-pressed={region === item}
                  onClick={() => setRegion(item)}
                >
                  {item}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Billing
            </span>
            <ButtonGroup aria-label="Billing cycle" className="flex-wrap">
              {homepageCycles.map(item => {
                const discount = (billingCycles[item] as { discountLabel?: string }).discountLabel;
                return (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={cycle === item ? 'default' : 'outline'}
                    aria-pressed={cycle === item}
                    onClick={() => setCycle(item)}
                  >
                    {cycleLabel[item]}
                    {discount ? <span className="text-xs opacity-75">{discount}</span> : null}
                  </Button>
                );
              })}
            </ButtonGroup>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {visible.length} {region} {visible.length === 1 ? 'plan' : 'plans'} available now
        </p>
      </div>

      <div className={visible.length === 2
        ? 'mx-auto grid w-full max-w-4xl grid-cols-1 gap-5 md:grid-cols-2'
        : 'grid grid-cols-1 gap-5 md:grid-cols-3'}
      >
        {visible.map(plan => {
          const price = plan.pricing[cycle];
          const monthEquivalent = price.amount / months[cycle];
          const osLabel = plan.source.os === 'linux-only' ? 'Linux only' : 'Windows + Linux';
          const featured = plan.name === popular;

          return (
            <PricingColumn
              key={plan.name}
              name={plan.name}
              description={osLabel}
              featured={featured}
              badge={featured ? <Badge variant="outline">Most popular</Badge> : null}
              price={
                <span>
                  €{format(price.amount)}
                  <span className="ml-1 text-base font-medium text-muted-foreground">{price.suffix}</span>
                </span>
              }
              priceNote={cycle === 'monthly'
                ? 'Billed monthly'
                : `€${monthEquivalent.toFixed(2)}/mo effective · due today`}
              cta={{
                label: `Choose ${plan.name.replace(/ USA| EU/g, '')}`,
                href: checkoutUrl(plan, cycle),
              }}
              features={[
                plan.specs.cpu,
                plan.specs.ram,
                plan.specs.storage,
                `${plan.specs.bandwidth} bandwidth`,
                'Dedicated IPv4',
              ]}
              footer={
                <span className="font-medium text-status-ok">
                  {plan.source.stock !== undefined ? `${plan.source.stock} available` : 'In stock'}
                </span>
              }
            />
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <a href={`/plans?region=${region}&cycle=${cycle}`}>Compare all plans</a>
        </Button>
      </div>
    </div>
  );
}
