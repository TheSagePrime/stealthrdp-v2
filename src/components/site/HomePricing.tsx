'use client';

import { useMemo, useState } from 'react';
import {
  ArrowSquareOut,
  Cpu,
  GlobeHemisphereWest,
  HardDrive,
  Lightning,
  ShieldCheck,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  checkoutUrl,
  plans,
  type BillingCycle,
  type Plan,
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

const workloads = [
  { id: 'remote', label: 'Remote desktop', target: 'Bronze', icon: Lightning },
  { id: 'web', label: 'Web hosting', target: 'Silver', icon: GlobeHemisphereWest },
  { id: 'automation', label: 'Automation & bots', target: 'Gold', icon: Cpu },
  { id: 'trading', label: 'Trading', target: 'Gold', icon: ShieldCheck },
  { id: 'storage', label: 'Storage & backups', target: 'Silver', icon: HardDrive },
] as const;

type Workload = (typeof workloads)[number]['id'];

const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

function tierName(plan: Plan) {
  return plan.name.replace(/ USA| EU/g, '');
}

function closestAvailablePlan(regionPlans: Plan[], target: string) {
  const targetIndex = Math.max(0, regionPlans.findIndex(plan => tierName(plan) === target));
  const available = regionPlans
    .map((plan, index) => ({ plan, distance: Math.abs(index - targetIndex) }))
    .filter(item => item.plan.source.availability !== 'out-of-stock')
    .sort((a, b) => a.distance - b.distance || a.plan.pricing.monthly.amount - b.plan.pricing.monthly.amount);

  return available[0]?.plan.name ?? regionPlans[targetIndex]?.name;
}

export function HomePricing() {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [workload, setWorkload] = useState<Workload>('remote');

  const selectedWorkload = workloads.find(item => item.id === workload) ?? workloads[0];

  const regionPlans = useMemo(
    () => plans
      .filter(plan => plan.location === region)
      .sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount),
    [region],
  );

  const recommendedName = useMemo(
    () => closestAvailablePlan(regionPlans, selectedWorkload.target),
    [regionPlans, selectedWorkload.target],
  );

  return (
    <div className="srv-plan-picker">
      <div className="srv-plan-toolbar">
        <div className="srv-plan-toolbar-group">
          <span className="srv-plan-label">Region</span>
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

        <div className="srv-plan-toolbar-group srv-plan-cycle">
          <span className="srv-plan-label">Billing cycle</span>
          <ButtonGroup aria-label="Billing cycle" className="flex flex-wrap">
            {cycles.map(item => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={cycle === item ? 'default' : 'outline'}
                aria-pressed={cycle === item}
                onClick={() => setCycle(item)}
              >
                {cycleLabel[item]}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <div className="srv-plan-live" aria-label="Availability is live">
          <span aria-hidden="true" />
          Live stock
        </div>
      </div>

      <div className="srv-workload-tabs" aria-label="Choose a workload">
        {workloads.map(item => {
          const Icon = item.icon;
          const selected = workload === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className="srv-workload-tab"
              data-selected={selected}
              aria-pressed={selected}
              onClick={() => setWorkload(item.id)}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="srv-plan-context">
        <p>
          Best fit for <strong>{selectedWorkload.label}</strong>
          <span> · {region}</span>
        </p>
        <p>
          Starter is Linux-only. Every other plan supports Windows or Linux.
        </p>
      </div>

      <div className="srv-plan-ladder" role="list" aria-label={`${region} VPS plans`}>
        {regionPlans.map((plan, index) => {
          const price = plan.pricing[cycle];
          const monthEquivalent = price.amount / months[cycle];
          const available = plan.source.availability !== 'out-of-stock';
          const recommended = plan.name === recommendedName;
          const osLabel = plan.source.os === 'linux-only' ? 'Linux only' : 'Windows + Linux';

          return (
            <article
              className="srv-plan-row"
              data-recommended={recommended}
              data-available={available}
              key={plan.name}
              role="listitem"
            >
              <div className="srv-plan-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="srv-plan-identity">
                <div className="srv-plan-name-line">
                  <h3>{tierName(plan)}</h3>
                  {recommended ? <Badge variant="outline">Best fit</Badge> : null}
                </div>
                <span>{osLabel}</span>
              </div>

              <dl className="srv-plan-specs">
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
                <div>
                  <dt>Traffic</dt>
                  <dd>{plan.specs.bandwidth}</dd>
                </div>
              </dl>

              <div className="srv-plan-commerce">
                <div className="srv-plan-price">
                  <strong>€{format(price.amount)}</strong>
                  <span>{price.suffix}</span>
                </div>
                <span className="srv-plan-price-note">
                  {cycle === 'monthly'
                    ? 'Billed monthly'
                    : `€${monthEquivalent.toFixed(2)}/mo effective`}
                </span>
                <span className="srv-plan-stock" data-available={available}>
                  <i aria-hidden="true" />
                  {plan.source.stock !== undefined
                    ? (available ? `${plan.source.stock} available` : 'Out of stock')
                    : (available ? 'In stock' : 'Out of stock')}
                </span>
              </div>

              <div className="srv-plan-action">
                {available ? (
                  <Button asChild size="sm" variant={recommended ? 'default' : 'outline'}>
                    <a href={checkoutUrl(plan, cycle)}>
                      Choose
                      <ArrowSquareOut aria-hidden="true" />
                    </a>
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" disabled>
                    Sold out
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="srv-plan-footer">
        <span>{regionPlans.length} plans in {region}</span>
        <a href="/plans">
          Compare the full catalogue
          <ArrowSquareOut aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
