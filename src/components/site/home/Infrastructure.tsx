import { HugeiconsIcon } from '@hugeicons/react';
import { CpuIcon, EthernetPortIcon, HardDriveIcon, Key01Icon, ShieldCheckIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const items = [
  {
    icon: CpuIcon,
    title: 'Compute that scales with the workload',
    text: 'Choose from practical CPU and memory tiers instead of paying for resources you do not need.',
  },
  {
    icon: HardDriveIcon,
    title: 'NVMe-backed storage',
    text: 'Fast local storage for remote desktops, applications, databases, automation and active files.',
  },
  {
    icon: EthernetPortIcon,
    title: 'Built for sustained network use',
    text: 'Current plans include high-speed connectivity and unlimited bandwidth for everyday server workloads.',
  },
  {
    icon: Key01Icon,
    title: 'Full administrative control',
    text: 'Run Windows or Linux with full server access and isolated virtual machine boundaries.',
  },
] as const;

export function Infrastructure() {
  return (
    <section className="sr-section srv3-infra-section" id="infrastructure">
      <div className="sr-container srv3-infra-layout">
        <div className="srv3-infra-copy">
          <p className="sr-kicker">Infrastructure that gets out of the way</p>
          <h2>Enough power to work. Simple enough to manage.</h2>
          <p>
            StealthRDP keeps the public offer easy to understand: choose resources,
            choose a region, choose Windows or Linux, then manage the service through
            the existing client area.
          </p>
          <Card className="mt-7 gap-3 border-0 border-t border-divider py-5 shadow-none">
            <div className="flex items-start gap-3 px-0 text-small text-body-muted">
              <HugeiconsIcon
                icon={ShieldCheckIcon}
                aria-hidden="true"
                size={20}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-body-dim"
              />
              <span className="grid gap-0.5">
                <strong className="font-semibold text-body-text">Public service status</strong>
                Monitoring is available from the status page.
              </span>
            </div>
          </Card>
        </div>

        <ol className="grid list-none gap-0 p-0">
          {items.map(({ icon, title, text }, index) => (
            <li
              key={title}
              className="
                grid gap-3 border-t border-divider py-6 last:border-b
                sm:grid-cols-[auto_1fr] sm:items-start sm:gap-x-6
              "
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </Badge>
                <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border-soft bg-surface-2 text-primary">
                  <HugeiconsIcon icon={icon} aria-hidden="true" size={20} strokeWidth={1.5} className="size-5" />
                </span>
              </div>
              <div className="grid gap-1.5">
                <h3 className="text-heading-4 font-semibold text-body-text">{title}</h3>
                <p className="text-small text-body-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
