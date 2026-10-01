/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import type { Plan } from '@/lib/stealth/content';
import { SiAlpinelinux, SiArchlinux, SiFreebsd, SiOpensuse, SiRockylinux } from '@icons-pack/react-simple-icons';
import { ArrowRight, BookOpenText, ChatCircleText, Cpu, EnvelopeSimple, HardDrive, Lifebuoy, Memory, Scales, ShieldCheck, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import styles from './OsSections.module.css';

/* Shared sections for the Windows and Linux VPS pages. Numbers come from the
   live plan catalogue, so they stay true when prices or stock change. */

type Kind = 'windows' | 'linux';

function Head({ kicker, title, children, id }: { kicker: string; title: string; children?: ReactNode; id?: string }) {
  return (
    <div className="sr-section-head">
      <div>
        <p className="sr-kicker">{kicker}</p>
        <h2 className="sr-section-title" id={id}>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
}

/* From order to sign-in --------------------------------------------------- */

export function OsJourney({ kind }: { kind: Kind }) {
  const windows = kind === 'windows';
  const steps = [
    {
      title: 'Pick a plan and region',
      text: 'Compare CPU, RAM, storage, bandwidth and price above, in a USA or EU region.',
    },
    windows
      ? { title: 'Choose Windows Server at checkout', text: 'Checkout offers the operating-system selector: Windows Server 2019, 2022 or 2025.' }
      : { title: 'Choose a distribution at checkout', text: 'Checkout offers the operating-system selector with the listed Linux images.' },
    {
      title: 'Receive your credentials',
      text: 'StealthRDP sends them by email after payment confirmation.',
      time: 'Typically within 5 minutes',
    },
    windows
      ? { title: 'Connect with Remote Desktop', text: 'Enter the server IP from the email and sign in as Administrator.', link: { href: '/docs/how-do-i-log-into-windows', label: 'How do I log into Windows?' } }
      : { title: 'Sign in as root', text: 'Connect to the server IP from the email with the root credentials.' },
  ];

  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-journey`}>
      <div className="sr-container">
        <Head kicker="From order to sign-in" title={windows ? 'Four steps from checkout to your Windows desktop' : 'Four steps from checkout to a root shell'} id={`${kind}-journey`}>
          Standard installations are typically active within 5 minutes. Most services are active within 5–10 minutes after payment confirmation.
        </Head>
        <ol className={styles.journey}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.step}>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {'time' in step && <span className={styles.time}>{step.time}</span>}
              {'link' in step && step.link && (
                <Link href={step.link.href} className={styles.link}>
                  {step.link.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Windows versions -------------------------------------------------------- */

export function WindowsVersions({ versions }: { versions: string[] }) {
  return (
    <section className="sr-section sr-section-border" id="windows-versions" aria-labelledby="windows-versions-title">
      <div className="sr-container">
        <Head kicker="Environment" title="Choose the Windows version your software needs" id="windows-versions-title">
          The Services & Plans FAQ lists these Windows options. Pick one in checkout when your software asks for it.
        </Head>
        <ul className={styles.versions}>
          {versions.map(version => (
            <li key={version}>
              <img src="/brand/windows.svg" alt="" width={28} height={28} />
              <span>Windows Server</span>
              <strong>{version}</strong>
              <small>Selected at checkout</small>
            </li>
          ))}
        </ul>
        <div className={styles.notice}>
          <Scales size={20} aria-hidden="true" />
          <p>
            <strong>Windows licensing.</strong>
            {' '}
            StealthRDP provides the infrastructure only. Microsoft Windows licensing is not included and is not supplied by
            StealthRDP. Customers are responsible for their own licensing compliance.
            {' '}
            <Link href="/docs/windows-licensing">Read the Windows licensing page</Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/* Linux distributions ------------------------------------------------------ */

const distroMarks: Record<string, string | typeof SiRockylinux> = {
  'Ubuntu': '/brand/ubuntu.svg',
  'Debian': '/brand/debian.svg',
  'CentOS': '/brand/centos.svg',
  'AlmaLinux': '/brand/almalinux.svg',
  'Fedora': '/brand/fedora.svg',
  'Rocky Linux': SiRockylinux,
  'Alpine Linux': SiAlpinelinux,
  'FreeBSD': SiFreebsd,
  'openSUSE': SiOpensuse,
  'Arch Linux': SiArchlinux,
};

export function LinuxDistros({ distros }: { distros: ReadonlyArray<{ name: string; versions: string }> }) {
  return (
    <section className="sr-section sr-section-border" id="linux-distros" aria-labelledby="linux-distros-title">
      <div className="sr-container">
        <Head kicker="Environment" title="Linux distributions you can run" id="linux-distros-title">
          Choose the operating-system family your stack needs, then confirm the exact image and version during checkout.
        </Head>
        <ul className={styles.distros}>
          {distros.map((distro) => {
            const mark = distroMarks[distro.name];
            const Mark = typeof mark === 'string' ? null : mark;
            return (
              <li key={distro.name}>
                <span className={styles.distroMark}>
                  {typeof mark === 'string'
                    ? <img src={mark} alt="" width={26} height={26} />
                    : Mark
                      ? <Mark size={24} color="default" aria-hidden="true" />
                      : <b>{distro.name.split(' ').map(word => word[0]).join('')}</b>}
                </span>
                <strong>{distro.name}</strong>
                <span className={styles.distroVersions}>
                  {distro.versions.split(', ').map(version => <i key={version}>{version}</i>)}
                </span>
              </li>
            );
          })}
        </ul>
        <Link href="/docs/how-to-install-direct-admin-in-a-linux-server" className={styles.link}>
          How to install DirectAdmin in a Linux server
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/* Resources across the catalogue ----------------------------------------- */

const number = (value: string) => Number.parseFloat(value);

type Resource = { key: 'cpu' | 'ram' | 'storage'; icon: Icon; label: string; unit: string; carries: string; text: Record<Kind, string> };

const resources: Resource[] = [
  {
    key: 'cpu',
    icon: Cpu,
    label: 'CPU',
    unit: 'vCPU',
    carries: 'Concurrent work',
    text: {
      windows: 'Match active processing and concurrent tasks.',
      linux: 'Compare CPU against the application, services, workers and expected load.',
    },
  },
  {
    key: 'ram',
    icon: Memory,
    label: 'RAM',
    unit: 'GB',
    carries: 'Active services',
    text: {
      windows: 'Allow for Windows, applications and users running at the same time.',
      linux: 'Size memory for the OS plus web server, app processes, databases, panels and jobs.',
    },
  },
  {
    key: 'storage',
    icon: HardDrive,
    label: 'Storage',
    unit: 'GB',
    carries: 'Files and data',
    text: {
      windows: 'Include the operating system, installed software, files and future additions.',
      linux: 'Include the operating system, packages, databases, files and future additions.',
    },
  },
];

export function OsResources({ plans, kind, children }: { plans: Plan[]; kind: Kind; children: ReactNode }) {
  const eligible = kind === 'windows' ? plans.filter(plan => plan.source.os !== 'linux-only') : plans;

  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-resources`}>
      <div className="sr-container">
        <Head kicker="Resource fit" title="Size the machine to the stack" id={`${kind}-resources`}>
          Count what runs at the same time. Each dot below is a plan in the current catalogue.
        </Head>
        <div className={styles.resources}>
          <div className={styles.guide}>{children}</div>
          <ul className={styles.scales}>
            {resources.map((resource) => {
              const values = [...new Set(eligible.map(plan => number(plan.specs[resource.key])))].sort((a, b) => a - b);
              const min = values[0] ?? 0;
              const max = values.at(-1) ?? 1;
              const at = (value: number) => `${((value - min) / (max - min || 1)) * 100}%`;
              const Glyph = resource.icon;
              return (
                <li key={resource.key}>
                  <div className={styles.scaleHead}>
                    <span className={styles.scaleIcon}><Glyph size={18} weight="duotone" aria-hidden="true" /></span>
                    <div>
                      <strong>{resource.carries}</strong>
                      {' '}
                      <span>{resource.text[kind]}</span>
                    </div>
                  </div>
                  <div className={styles.scale} aria-label={`${resource.label} from ${min} to ${max} ${resource.unit} across ${eligible.length} plans`} role="img">
                    <i className={styles.rail} />
                    {values.map(value => (
                      <i key={value} className={styles.dot} style={{ left: at(value) }} />
                    ))}
                  </div>
                  <div className={styles.scaleEnds}>
                    <span>{`${min} ${resource.unit}`}</span>
                    <b>{resource.label}</b>
                    <span>{`${max} ${resource.unit}`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Regions with live numbers ------------------------------------------------ */

export function OsRegions({ plans, kind }: { plans: Plan[]; kind: Kind }) {
  const eligible = kind === 'windows' ? plans.filter(plan => plan.source.os !== 'linux-only') : plans;
  const regions = (['USA', 'EU'] as const).map((region) => {
    const list = eligible.filter(plan => plan.location === region);
    const from = Math.min(...list.map(plan => plan.pricing.monthly.amount));
    const stock = list.reduce((sum, plan) => sum + (plan.source.stock ?? 0), 0);
    return { region, count: list.length, from, stock };
  });

  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-regions`}>
      <div className="sr-container">
        <Head kicker="Regions" title="USA or EU" id={`${kind}-regions`}>
          Choose the region that fits your users, latency and operating requirements. Figures come from the live catalogue.
        </Head>
        <ul className={styles.regions}>
          {regions.map(item => (
            <li key={item.region}>
              <span className={styles.regionCode}>{item.region}</span>
              <dl>
                <div>
                  <dt>Plans</dt>
                  <dd>{item.count}</dd>
                </div>
                <div>
                  <dt>From</dt>
                  <dd>
                    {`€${item.from.toFixed(2)}`}
                    <small>/mo</small>
                  </dd>
                </div>
                <div>
                  <dt>Servers in stock</dt>
                  <dd>{item.stock}</dd>
                </div>
              </dl>
              <Link href="/plans" className={styles.link}>
                {`View ${item.region} plans`}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Support and limits ------------------------------------------------------ */

const windowsGuides = [
  { href: '/docs/how-do-i-log-into-windows', label: 'How do I log into Windows?' },
  { href: '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial', label: 'Extend the 180-day Windows trial' },
  { href: '/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework', label: 'Fix WinRM and install .NET Framework' },
  { href: '/docs/how-to-rebuild-a-server', label: 'How to rebuild a server' },
];

const linuxGuides = [
  { href: '/docs/how-to-install-direct-admin-in-a-linux-server', label: 'Install DirectAdmin' },
  { href: '/docs/install-cyber-panel-with-open-lite-speed-in-linux', label: 'Install CyberPanel with OpenLiteSpeed' },
  { href: '/docs/how-to-setup-your-vpn-on-linux-server-using-outline', label: 'Set up an Outline VPN server' },
  { href: '/docs/how-to-rebuild-a-server', label: 'How to rebuild a server' },
];

export function OsSupport({ kind }: { kind: Kind }) {
  const windows = kind === 'windows';
  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-support`}>
      <div className="sr-container">
        <Head kicker="Support and limits" title="Help when you need it, and the rules that apply" id={`${kind}-support`} />
        <div className={styles.support}>
          <article>
            <span className={styles.supportIcon}><Lifebuoy size={20} weight="duotone" aria-hidden="true" /></span>
            <h3>Support</h3>
            <ul className={styles.channels}>
              <li>
                <WhatsappLogo size={18} aria-hidden="true" />
                <a href="https://wa.me/447441426993">WhatsApp support</a>
              </li>
              <li>
                <ChatCircleText size={18} aria-hidden="true" />
                Client-area ticket system
              </li>
              <li>
                <EnvelopeSimple size={18} aria-hidden="true" />
                Support email
              </li>
            </ul>
            <Link href="/faq" className={styles.link}>
              Support details in the FAQ
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <span className={styles.supportIcon}><ShieldCheck size={20} weight="duotone" aria-hidden="true" /></span>
            <h3>Your responsibilities</h3>
            <p>
              {windows ? 'Full Windows Administrator access' : 'Full root access'}
              {' '}
              gives you control of the server and the software you install. You are responsible for regular backups of important data.
            </p>
            <p>Use must be lawful. The terms prohibit abuse, scanning, hacking, spam, botnets and similar misuse.</p>
            <Link href="/docs/use-of-service" className={styles.link}>
              Use of Service terms
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <span className={styles.supportIcon}><BookOpenText size={20} weight="duotone" aria-hidden="true" /></span>
            <h3>Guides</h3>
            <ul className={styles.guides}>
              {(windows ? windowsGuides : linuxGuides).map(guide => (
                <li key={guide.href}>
                  <Link href={guide.href}>{guide.label}</Link>
                </li>
              ))}
            </ul>
            <Link href="/docs" className={styles.link}>
              All help articles
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

/* Questions --------------------------------------------------------------- */

export function OsFaq({ kind, title, questions, other }: {
  kind: Kind;
  title: string;
  questions: ReadonlyArray<readonly [string, string]>;
  other: { title: string; text: string; href: string; label: string };
}) {
  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-faq`}>
      <div className={`
        sr-container
        ${styles.faq}
      `}
      >
        <div className={styles.faqSide}>
          <p className="sr-kicker">Common questions</p>
          <h2 className="sr-section-title" id={`${kind}-faq`}>{title}</h2>
          <p>Quick answers for software, access, activation and support.</p>
          <div className={styles.other}>
            <span>Choose another environment</span>
            {' '}
            <strong>{other.title}</strong>
            {' '}
            <p>{other.text}</p>
            <Link href={other.href} className={styles.link}>
              {other.label}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <Accordion>
          {questions.map(([question, answer]) => (
            <AccordionItem key={question} title={question}>
              <p>{answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
