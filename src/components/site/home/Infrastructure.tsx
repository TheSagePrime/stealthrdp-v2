import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

const items = [
  {
    title: 'NVMe SSD storage',
    text: 'Fast disk I/O for applications, databases, and active desktop workloads.',
  },
  {
    title: 'Isolated virtual machines',
    text: 'Each service runs in its own VM with dedicated resources and full admin access.',
  },
  {
    title: 'USA + Europe regions',
    text: 'Choose the location closest to the workload, with dedicated IPv4 included.',
  },
  {
    title: '24/7 monitoring',
    text: 'Production nodes are monitored continuously with a public status page.',
  },
] as const;

export function Infrastructure() {
  return (
    <section className="sr-section srv3-infra-section" id="infrastructure">
      <div className="sr-container">
        <div className="srv3-home-section-head">
          <div>
            <p className="sr-kicker">Built for the workload</p>
            <h2>The infrastructure essentials, already included.</h2>
          </div>
          <div className="srv3-infra-intro">
            <p>
              No separate feature maze. The things most buyers care about are standard across
              the VPS range.
            </p>
            <Link href="/status">
              View live status
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ol className="srv3-home-feature-grid">
          {items.map(({ title, text }, index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
