'use client';

/* Homepage pricing configurator: interaction/state here, visual language in stealth-v3.css. */
import { useMemo, useState } from 'react';
import {
  CalendarDots,
  ChartLineUp,
  Desktop,
  GlobeHemisphereWest,
  HardDrive,
  Robot,
  TerminalWindow,
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PricingColumn } from '@/components/launchui/pricing-column';
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
  { id: 'remote', label: 'Remote desktop', target: 'Bronze', icon: Desktop },
  { id: 'web', label: 'Web hosting', target: 'Silver', icon: GlobeHemisphereWest },
  { id: 'automation', label: 'Automation & bots', target: 'Gold', icon: Robot },
  { id: 'trading', label: 'Trading', target: 'Gold', icon: ChartLineUp },
  { id: 'storage', label: 'Storage & backups', target: 'Silver', icon: HardDrive },
] as const;

type Workload = (typeof workloads)[number]['id'];
type OsChoice = 'any' | 'windows' | 'linux';

const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

function tierName(plan: Plan) {
  return plan.name.replace(/ USA| EU/g, '');
}

function previewWindow(regionPlans: Plan[], target: string) {
  if (regionPlans.length <= 4) return regionPlans;
  const targetIndex = Math.max(0, regionPlans.findIndex(plan => tierName(plan) === target));
  const start = Math.min(Math.max(targetIndex - 1, 0), Math.max(regionPlans.length - 4, 0));
  return regionPlans.slice(start, start + 4);
}

export function HomePricing() {
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [os, setOs] = useState<OsChoice>('any');
  const [workload, setWorkload] = useState<Workload>('remote');

  const selectedWorkload = workloads.find(item => item.id === workload) ?? workloads[0];

  const visible = useMemo(() => {
    const filtered = plans
      .filter(plan => plan.location === region)
      .filter(plan => {
        if (os === 'windows') return plan.source.os !== 'linux-only';
        if (os === 'linux') return true;
        return true;
      })
      .sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount);

    return previewWindow(filtered, selectedWorkload.target);
  }, [region, os, selectedWorkload.target]);

  const recommendedName = useMemo(() => {
    const exact = visible.find(plan => tierName(plan) === selectedWorkload.target && plan.source.availability !== 'out-of-stock');
    if (exact) return exact.name;
    const firstAvailable = visible.find(plan => plan.source.availability !== 'out-of-stock');
    return firstAvailable?.name ?? visible[0]?.name;
  }, [visible, selectedWorkload.target]);

  const recommendedPlan = visible.find(plan => plan.name === recommendedName) ?? visible[0];
  const recommendedPrice = recommendedPlan?.pricing[cycle];
  const availableCount = visible.filter(plan => plan.source.availability !== 'out-of-stock').length;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="srv-plan-configurator">
        <div className="srv-configurator-top">
          <div className="srv-configurator-group">
            <div className="srv-configurator-label">
              <GlobeHemisphereWest aria-hidden="true" />
              <span>Region</span>
            </div>
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

          <div className="srv-configurator-group">
            <div className="srv-configurator-label">
              <TerminalWindow aria-hidden="true" />
              <span>Operating system</span>
            </div>
            <div className="srv-selector" role="group" aria-label="Operating system">
              {([
                ['any', 'Any OS'],
                ['windows', 'Windows'],
                ['linux', 'Linux'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="srv-selector-option"
                  data-selected={os === value}
                  aria-pressed={os === value}
                  onClick={() => setOs(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="srv-configurator-group srv-configurator-billing">
            <div className="srv-configurator-label">
              <CalendarDots aria-hidden="true" />
              <span>Billing cycle</span>
            </div>
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

        <div className="srv-configurator-divider" />

        <div className="srv-configurator-bottom">
          <div className="srv-workload-control">
            <span className="srv-workload-label">Workload</span>
            <div className="srv-workload-list" aria-label="Choose a workload">
              {workloads.map(item => {
                const Icon = item.icon;
                const selected = workload === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className="srv-workload-option"
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
          </div>

          <div className="srv-configurator-summary" aria-live="polite">
            <div className="srv-summary-status">
              <span className="srv-summary-live" aria-hidden="true" />
              <span>{availableCount} of {visible.length} available</span>
            </div>

            <div className="srv-summary-main">
              <div>
                <span>Best fit</span>
                <strong>{recommendedPlan ? tierName(recommendedPlan) : selectedWorkload.target}</strong>
              </div>
              {recommendedPrice ? (
                <div className="srv-summary-price">
                  <strong>€{format(recommendedPrice.amount)}</strong>
                  <span>{recommendedPrice.suffix}</span>
                </div>
              ) : null}
            </div>

            <div className="srv-summary-meta">
              <span>{region}</span>
              <span>·</span>
              <span>{os === 'any' ? 'Windows or Linux' : os === 'windows' ? 'Windows' : 'Linux'}</span>
              <span>·</span>
              <span>{cycleLabel[cycle]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="srv-home-pricing-grid grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visible.map(plan => {
          const price = plan.pricing[cycle];
          const monthEquivalent = price.amount / months[cycle];
          const osLabel = plan.source.os === 'linux-only' ? 'Linux only' : 'Windows + Linux';
          const featured = plan.name === recommendedName;
          const available = plan.source.availability !== 'out-of-stock';

          return (
            <PricingColumn
              key={plan.name}
              className="srv-home-pricing-card"
              name={plan.name}
              description={osLabel}
              featured={featured}
              badge={featured ? <Badge variant="outline">Recommended</Badge> : null}
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
              footer={
                <span className={available ? 'font-medium text-status-ok' : 'font-medium text-muted-foreground'}>
                  {plan.source.stock !== undefined
                    ? `${plan.source.stock} available`
                    : available ? 'In stock' : 'Out of stock'}
                </span>
              }
            />
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <a href="/plans">View all plans</a>
        </Button>
        <Button asChild variant="ghost">
          <a href={os === 'windows' ? '/windows-vps' : '/linux-vps'}>
            Browse {os === 'windows' ? 'Windows' : 'Linux'} VPS
          </a>
        </Button>
      </div>
    </div>
  );
}
