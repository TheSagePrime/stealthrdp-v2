'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { billingCycles, checkoutUrl, plans, type BillingCycle } from '@/lib/stealth/content';

const cycleOrder: BillingCycle[] = ['monthly', 'quarterly', 'annual', 'biannual'];

const workloadOptions = [
  { key: 'remote-desktop', label: 'Remote desktop', tier: 'Bronze' },
  { key: 'web-hosting', label: 'Web hosting', tier: 'Silver' },
  { key: 'automation', label: 'Automation & bots', tier: 'Gold' },
  { key: 'trading', label: 'Trading', tier: 'Gold' },
  { key: 'storage', label: 'Storage & backups', tier: 'Silver' },
] as const;

const osOptions = [
  { key: 'any', label: 'Any OS' },
  { key: 'windows', label: 'Windows' },
  { key: 'linux', label: 'Linux' },
] as const;

type WorkloadKey = (typeof workloadOptions)[number]['key'];
type OsKey = (typeof osOptions)[number]['key'];

export function PricingExplorer({
  compact = false,
  guided = true,
}: {
  compact?: boolean;
  guided?: boolean;
}) {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [workload, setWorkload] = useState<WorkloadKey>('remote-desktop');
  const [os, setOs] = useState<OsKey>('any');

  const recommendedTier = workloadOptions.find(item => item.key === workload)?.tier ?? 'Bronze';
  const osLabel = osOptions.find(item => item.key === os)?.label ?? 'Any OS';

  const visible = useMemo(() => {
    const matching = plans.filter(plan => plan.location === region);
    return compact ? matching.slice(0, 3) : matching;
  }, [compact, region]);

  return (
    <div>
      {guided ? (
        <div className="sr-plan-finder" aria-label="VPS workload finder">
          <div className="sr-finder-block">
            <span className="sr-control-label">Use case</span>
            <div className="sr-finder-options">
              {workloadOptions.map(item => (
                <Button
                  key={item.key}
                  type="button"
                  size="sm"
                  variant={workload === item.key ? 'default' : 'outline'}
                  onClick={() => setWorkload(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="sr-finder-block">
            <span className="sr-control-label">Operating system</span>
            <div className="sr-finder-options">
              {osOptions.map(item => (
                <Button
                  key={item.key}
                  type="button"
                  size="sm"
                  variant={os === item.key ? 'secondary' : 'ghost'}
                  onClick={() => setOs(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <p className="sr-finder-note">
            <strong>Best fit: {recommendedTier} {region}</strong>
            <span>
              {osLabel === 'Any OS' ? 'Windows and Linux images' : `${osLabel} images`} are available across the VPS range. Confirm the exact image and current stock in checkout.
            </span>
          </p>
        </div>
      ) : null}

      <div className="sr-control-row">
        <div className="sr-control-group">
          <span className="sr-control-label">Region</span>
          {(['USA', 'EU'] as const).map(item => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={region === item ? 'default' : 'outline'}
              onClick={() => setRegion(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="sr-control-group">
          <span className="sr-control-label">Billing</span>
          {cycleOrder.map((item) => {
            const billing = billingCycles[item] as { label: string; discountLabel?: string };
            return (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={cycle === item ? 'secondary' : 'ghost'}
                onClick={() => setCycle(item)}
              >
                {billing.label}
                {billing.discountLabel ? ` · ${billing.discountLabel}` : ''}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="sr-plan-grid">
        {visible.map((plan) => {
          const price = plan.pricing[cycle];
          const available = plan.source.availability !== 'out-of-stock';
          const recommended = plan.name.startsWith(recommendedTier);

          return (
            <article
              key={plan.name}
              className="sr-plan-card"
              data-popular={plan.popular}
              data-recommended={guided && recommended}
            >
              <div className="sr-plan-top">
                <div>
                  <h3 className="sr-plan-name">{plan.name}</h3>
                  <p className="sr-plan-desc">{plan.description}</p>
                </div>
                <div className="sr-plan-badges">
                  {guided && recommended ? <Badge variant="secondary">Best fit</Badge> : null}
                  {plan.popular ? <Badge>Popular</Badge> : null}
                </div>
              </div>
              <p className="sr-plan-price">
                €{price.amount}
                <small>{price.suffix}</small>
              </p>
              <p className="sr-plan-period">
                {price.periodLabel}
                {price.discountLabel ? ` · ${price.discountLabel}` : ''}
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
