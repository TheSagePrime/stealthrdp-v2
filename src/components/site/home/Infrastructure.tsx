import {
  ClockCounterClockwise,
  GlobeHemisphereWest,
  HardDrives,
  LockKey,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteFeatureMark } from '@/components/site/SiteFeatureMark';

const items = [
  {
    title: 'NVMe SSD storage',
    text: 'Fast disk I/O for applications, databases, and terminals.',
    icon: HardDrives,
    tone: 'brand',
  },
  {
    title: 'Isolated VMs',
    text: 'Separate virtual machines for each server.',
    icon: LockKey,
    tone: 'accent',
  },
  {
    title: 'Global network',
    text: 'Strategic locations with 250 Mbps ports and an optional 1 Gbps upgrade.',
    icon: GlobeHemisphereWest,
    tone: 'brand',
  },
  {
    title: '24/7 monitoring',
    text: 'Automated monitoring with a public status page.',
    icon: ClockCounterClockwise,
    tone: 'accent',
  },
] as const;

export function Infrastructure() {
  return (
    <section className="sr-section srv3-infra-section" id="infrastructure">
      <div className="sr-container">
        <div className="srv3-infra-panel srv3-infra-layout">
          <div className="srv3-infra-copy">
            <p className="sr-kicker">Built for the workload</p>
            <h2>Infrastructure that doesn&apos;t flinch</h2>
            <p>
              Speed, protection, and visibility without the extra surface area.
            </p>
            <div className="mt-7">
              <Button asChild variant="outline">
                <Link href="/status">View server status</Link>
              </Button>
            </div>
          </div>

          <ol className="srv3-infra-list grid list-none gap-0 p-0">
            {items.map(({ title, text, icon: Icon, tone }) => (
              <li
                key={title}
                className="
                  grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-4
                  border-t border-divider py-5 last:border-b
                "
              >
                <SiteFeatureMark tone={tone} size="md">
                  <Icon size={24} weight="duotone" aria-hidden="true" />
                </SiteFeatureMark>
                <div className="grid gap-1.5">
                  <h3 className="text-heading-4 font-semibold text-body-text">{title}</h3>
                  <p className="text-small text-body-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
