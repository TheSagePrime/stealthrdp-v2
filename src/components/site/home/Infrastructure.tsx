import { Activity, HardDrive, Network, ShieldCheck } from 'lucide-react';

const infrastructure = [
  {
    icon: HardDrive,
    title: 'NVMe-first storage',
    text: 'Fast disk I/O for remote desktops, applications, databases, automation and active workloads.',
    value: 'NVMe',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated virtual machines',
    text: 'Dedicated VM boundaries with full administrative access and infrastructure-level protection.',
    value: 'Full admin',
  },
  {
    icon: Network,
    title: 'High-speed networking',
    text: 'Fast connectivity and unlimited bandwidth on current plans, built for sustained workloads.',
    value: 'Unlimited',
  },
  {
    icon: Activity,
    title: 'Visible service health',
    text: 'Public status information and clear support paths when something needs attention.',
    value: '24/7 monitoring',
  },
];

/**
 * Infrastructure claims. DESIGN.md section 9, position 5: each claim carries one
 * measured property, so the section never becomes a feature grid.
 */
export function Infrastructure() {
  return (
    <section className="sr-section sr-section-border" id="infrastructure">
      <div className="sr-container">
        <div className="sr-section-head">
          <div>
            <p className="sr-kicker">Core infrastructure</p>
            <h2 className="sr-section-title">Built for the workload, not the brochure.</h2>
          </div>
          <span className="sr-infra-badge">
            <Activity aria-hidden="true" />
            Live monitoring
          </span>
        </div>

        <div className="sr-infra-list">
          {infrastructure.map(({ icon: Icon, title, text, value }, index) => (
            <article key={title}>
              <span className="sr-feature-number">{`0${index + 1}`}</span>
              <span className="sr-feature-icon">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <span className="sr-infra-value">{value}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
