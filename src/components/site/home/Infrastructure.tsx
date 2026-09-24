import { Cpu, EthernetPort, HardDrive, KeyRound } from 'lucide-react';

const items = [
  {
    icon: Cpu,
    title: 'Compute that scales with the workload',
    text: 'Choose from practical CPU and memory tiers instead of paying for resources you do not need.',
  },
  {
    icon: HardDrive,
    title: 'NVMe-backed storage',
    text: 'Fast local storage for remote desktops, applications, databases, automation and active files.',
  },
  {
    icon: EthernetPort,
    title: 'Built for sustained network use',
    text: 'Current plans include high-speed connectivity and unlimited bandwidth for everyday server workloads.',
  },
  {
    icon: KeyRound,
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
          <div className="srv3-infra-proof">
            <span>
              <strong>Public service status</strong>
              Monitoring is available from the status page.
            </span>
          </div>
        </div>

        <div className="srv3-infra-list">
          {items.map(({ icon: Icon, title, text }, index) => (
            <article key={title}>
              <span className="srv3-infra-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="srv3-infra-icon"><Icon aria-hidden="true" /></div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
