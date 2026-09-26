import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const items = [
  {
    title: 'NVMe SSD storage',
    text: 'Fast disk I/O for applications, databases, and terminals.',
  },
  {
    title: 'Isolated VMs',
    text: 'Separate virtual machines for each server.',
  },
  {
    title: 'Global network',
    text: 'Strategic locations with 250 Mbps ports and an optional 1 Gbps upgrade.',
  },
  {
    title: '24/7 monitoring',
    text: 'Automated monitoring with a public status page.',
  },
] as const;

export function Infrastructure() {
  return (
    <section className="sr-section srv3-infra-section" id="infrastructure">
      <div className="sr-container srv3-infra-layout">
        <div className="srv3-infra-copy">
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

        <ol className="grid list-none gap-0 p-0">
          {items.map(({ title, text }, index) => (
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
