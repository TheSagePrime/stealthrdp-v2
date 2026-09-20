'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { billingCycles, checkoutUrl, plans, type BillingCycle } from '@/lib/stealth/content';

const cycleOrder: BillingCycle[] = ['monthly', 'quarterly', 'annual', 'biannual'];

export function PricingExplorer({ compact = false }: { compact?: boolean }) {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const visible = useMemo(() => {
    const matching = plans.filter(plan => plan.location === region);
    return compact ? matching.slice(0, 3) : matching;
  }, [compact, region]);

  return (
    <div>
      <div className="sr-control-row">
        <div className="sr-control-group">
          <span className="sr-control-label">Region</span>
          {(['USA', 'EU'] as const).map(item => (
            <Button key={item} type="button" size="sm" variant={region === item ? 'default' : 'outline'} onClick={() => setRegion(item)}>
              {item}
            </Button>
          ))}
        </div>
        <div className="sr-control-group">
          <span className="sr-control-label">Billing</span>
          {cycleOrder.map(item => (
            <Button key={item} type="button" size="sm" variant={cycle === item ? 'secondary' : 'ghost'} onClick={() => setCycle(item)}>
              {billingCycles[item].label}
            </Button>
          ))}
        </div>
      </div>

      <div className="sr-plan-grid">
        {visible.map((plan) => {
          const price = plan.pricing[cycle];
          const available = plan.source.availability !== 'out-of-stock';
          return (
            <article key={plan.name} className="sr-plan-card" data-popular={plan.popular}>
              <div className="sr-plan-top">
                <div>
                  <h3 className="sr-plan-name">{plan.name}</h3>
                  <p className="sr-plan-desc">{plan.description}</p>
                </div>
                {plan.popular ? <Badge>Popular</Badge> : null}
              </div>
              <p className="sr-plan-price">
                €{price.amount}
                <small>{price.suffix}</small>
              </p>
              <ul className="sr-plan-specs">
                <li><span>CPU</span><b>{plan.specs.cpu}</b></li>
                <li><span>RAM</span><b>{plan.specs.ram}</b></li>
                <li><span>Storage</span><b>{plan.specs.storage}</b></li>
                <li><span>Bandwidth</span><b>{plan.specs.bandwidth}</b></li>
              </ul>
              <div className="sr-plan-actions">
                {available ? (
                  <Button asChild className="w-full">
                    <a href={checkoutUrl(plan, cycle)}>Buy now</a>
                  </Button>
                ) : (
                  <span className="sr-unavailable">Currently unavailable</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}