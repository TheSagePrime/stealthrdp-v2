'use client';

/* State/data wiring only. Visual controls/cards come from shadcn + Launch UI. */
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent } from '@/components/ui/card';
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
  { id: 'remote', label: 'Remote desktop', target: 'Bronze' },
  { id: 'web', label: 'Web hosting', target: 'Silver' },
  { id: 'automation', label: 'Automation & bots', target: 'Gold' },
  { id: 'trading', label: 'Trading', target: 'Gold' },
  { id: 'storage', label: 'Storage & backups', target: 'Silver' },
] as const;

type Workload = (typeof workloads)[number]['id'];
type OsChoice = 'any' | 'windows' | 'linux';

const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

function tierName(plan: Plan) {
  return plan.name.replace(/ USA| EU/g, '');
}

function previewWindow(regionPlans: Plan[], target: string) {
  if (regionPlans.length <= 3) return regionPlans;
  const targetIndex = Math.max(0, regionPlans.findIndex(plan => tierName(plan) === target));
  const start = Math.min(Math.max(targetIndex - 1, 0), Math.max(regionPlans.length - 3, 0));
  return regionPlans.slice(start, start + 3);
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

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Card>
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[auto_auto_1fr] lg:items-end">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Region</span>
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
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Operating system</span>
            <ButtonGroup aria-label="Operating system">
              {([
                ['any', 'Any OS'],
                ['windows', 'Windows'],
                ['linux', 'Linux'],
              ] as const).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={os === value ? 'default' : 'outline'}
                  aria-pressed={os === value}
                  onClick={() => setOs(value)}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <div className="flex flex-col gap-2 lg:items-end">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Billing cycle</span>
            <ButtonGroup aria-label="Billing cycle" className="flex-wrap lg:justify-end">
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
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2" aria-label="Choose a workload">
        {workloads.map(item => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={workload === item.id ? 'default' : 'outline'}
            aria-pressed={workload === item.id}
            onClick={() => setWorkload(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Best fit for <strong className="font-semibold text-foreground">{selectedWorkload.label}</strong> · {region} · {os === 'any' ? 'Windows or Linux' : os === 'windows' ? 'Windows' : 'Linux'}
        </p>
        <Badge variant="outline">{visible.length} plans in preview</Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {visible.map(plan => {
          const price = plan.pricing[cycle];
          const monthEquivalent = price.amount / months[cycle];
          const osLabel = plan.source.os === 'linux-only' ? 'Linux only' : 'Windows + Linux';
          const featured = plan.name === recommendedName;
          const available = plan.source.availability !== 'out-of-stock';

          return (
            <PricingColumn
              key={plan.name}
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
