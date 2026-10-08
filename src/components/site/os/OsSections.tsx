/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import type { SiteLocale } from '@/config/i18n';
import type { Plan } from '@/lib/stealth/content';
import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { osCopy } from '@/content/i18n/os';
import { formatEuro, localeHref } from '@/lib/stealth/i18n';
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

export function OsJourney({ kind, locale = 'en' }: { kind: Kind; locale?: SiteLocale }) {
  const windows = kind === 'windows';
  const t = osCopy[locale].journey;
  const steps: { title: string; text: string; time?: string; link?: { href: string; label: string } }[] = [
    t.pick,
    windows ? t.windowsOs : t.linuxOs,
    t.credentials,
    windows
      ? { title: t.windowsConnect.title, text: t.windowsConnect.text, link: { href: '/docs/how-do-i-log-into-windows', label: t.windowsConnect.linkLabel } }
      : t.linuxConnect,
  ];

  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-journey`}>
      <div className="sr-container">
        <Head kicker={t.kicker} title={windows ? t.title.windows : t.title.linux} id={`${kind}-journey`}>
          {t.intro}
        </Head>
        <ol className={styles.journey}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.step}>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {step.time && <span className={styles.time}>{step.time}</span>}
              {step.link && (
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

export function WindowsVersions({ versions, locale = 'en' }: { versions: string[]; locale?: SiteLocale }) {
  const t = osCopy[locale].versions;
  return (
    <section className="sr-section sr-section-border" id="windows-versions" aria-labelledby="windows-versions-title">
      <div className="sr-container">
        <Head kicker={t.kicker} title={t.title} id="windows-versions-title">
          {t.intro}
        </Head>
        <ul className={styles.versions}>
          {versions.map(version => (
            <li key={version}>
              <img src="/brand/windows.png" alt="" width={28} height={28} />
              <span>{t.product}</span>
              <strong>{version}</strong>
              <small>{t.selected}</small>
            </li>
          ))}
        </ul>
        <div className={styles.notice}>
          <Image className={iconStyles.artwork} src="/images/fluent-color/certificate.svg" width={24} height={24} alt="" />
          <p>
            {t.licensing}
          </p>
        </div>
      </div>
    </section>
  );
}

/* Linux distributions ------------------------------------------------------ */

const distroMarks: Record<string, string> = {
  'Ubuntu': '/brand/ubuntu.png',
  'Debian': '/brand/debian.png',
  'CentOS': '/brand/centos.png',
  'AlmaLinux': '/brand/almalinux.png',
  'Fedora': '/brand/fedora.png',
  'Rocky Linux': '/brand/rockylinux.png',
  'Alpine Linux': '/brand/alpinelinux.png',
  'FreeBSD': '/brand/freebsd.png',
  'openSUSE': '/brand/opensuse.png',
  'Arch Linux': '/brand/archlinux.png',
  'CloudLinux': '/brand/cloudlinux.png',
  'Oracle Linux': '/brand/oraclelinux.png',
};

export function LinuxDistros({ distros, locale = 'en' }: { distros: ReadonlyArray<{ name: string; versions: string }>; locale?: SiteLocale }) {
  const t = osCopy[locale].distros;
  return (
    <section className="sr-section sr-section-border" id="linux-distros" aria-labelledby="linux-distros-title">
      <div className="sr-container">
        <Head kicker={t.kicker} title={t.title} id="linux-distros-title">
          {t.intro}
        </Head>
        <ul className={styles.distros}>
          {distros.map((distro) => {
            const mark = distroMarks[distro.name];
            return (
              <li key={distro.name}>
                <span className={styles.distroMark}>
                  {mark
                    ? <img src={mark} alt="" width={26} height={26} />
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
          {t.directAdmin}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/* Resources across the catalogue ----------------------------------------- */

const number = (value: string) => Number.parseFloat(value);

const resources = [
  { key: 'cpu', icon: 'gauge' },
  { key: 'ram', icon: 'data-bar-vertical-ascending' },
  { key: 'storage', icon: 'database' },
] as const satisfies ReadonlyArray<{ key: 'cpu' | 'ram' | 'storage'; icon: string }>;

export function OsResources({ plans, kind, children, locale = 'en' }: { plans: Plan[]; kind: Kind; children: ReactNode; locale?: SiteLocale }) {
  const t = osCopy[locale].resources;
  const eligible = kind === 'windows' ? plans.filter(plan => plan.source.os !== 'linux-only') : plans;

  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-resources`}>
      <div className="sr-container">
        <Head kicker={t.kicker} title={t.title} id={`${kind}-resources`}>
          {t.intro}
        </Head>
        <div className={styles.resources}>
          <div className={styles.guide}>{children}</div>
          <ul className={styles.scales}>
            {resources.map(({ key, icon }) => {
              const resource = { key, icon, ...t.items[key] };
              const values = [...new Set(eligible.map(plan => number(plan.specs[resource.key])))].sort((a, b) => a - b);
              const min = values[0] ?? 0;
              const max = values.at(-1) ?? 1;
              const at = (value: number) => `${((value - min) / (max - min || 1)) * 100}%`;
              const glyph = resource.icon;
              return (
                <li key={resource.key}>
                  <div className={styles.scaleHead}>
                    <span className={styles.scaleIcon}><Image className={iconStyles.artwork} src={`/images/fluent-color/${glyph}.svg`} width={28} height={28} alt="" /></span>
                    <div>
                      <strong>{resource.carries}</strong>
                      {' '}
                      <span>{resource.text[kind]}</span>
                    </div>
                  </div>
                  <div className={styles.scale} aria-label={t.scaleLabel(resource.label, min, max, resource.unit, eligible.length)} role="img">
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

export function OsRegions({ plans, kind, locale = 'en' }: { plans: Plan[]; kind: Kind; locale?: SiteLocale }) {
  const t = osCopy[locale].regions;
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
        <Head kicker={t.kicker} title={t.title} id={`${kind}-regions`}>
          {t.intro}
        </Head>
        <ul className={styles.regions}>
          {regions.map(item => (
            <li key={item.region}>
              <span className={styles.regionCode}>{t.names[item.region]}</span>
              <dl>
                <div>
                  <dt>{t.plans}</dt>
                  <dd>{item.count}</dd>
                </div>
                <div>
                  <dt>{t.from}</dt>
                  <dd>
                    {formatEuro(item.from, locale)}
                    <small>{t.perMonth}</small>
                  </dd>
                </div>
                <div>
                  <dt>{t.stock}</dt>
                  <dd>{item.stock}</dd>
                </div>
              </dl>
              <Link href={localeHref('/plans', locale)} className={styles.link}>
                {t.view(t.names[item.region])}
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

export function OsSupport({ kind, locale = 'en' }: { kind: Kind; locale?: SiteLocale }) {
  const windows = kind === 'windows';
  const t = osCopy[locale].support;
  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-support`}>
      <div className="sr-container">
        <Head kicker={t.kicker} title={t.title} id={`${kind}-support`} />
        <div className={styles.support}>
          <article>
            <span className={styles.supportIcon}><Image className={iconStyles.artwork} src="/images/fluent-color/headset.svg" width={32} height={32} alt="" /></span>
            <h3>{t.heading}</h3>
            <ul className={styles.channels}>
              <li>
                <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                <a href="https://wa.me/447441426993">{t.whatsapp}</a>
              </li>
              <li>
                <Image className={iconStyles.artwork} src="/images/fluent-color/chat.svg" width={24} height={24} alt="" />
                {t.tickets}
              </li>
              <li>
                <Image className={iconStyles.artwork} src="/images/fluent-color/mail.svg" width={24} height={24} alt="" />
                {t.email}
              </li>
            </ul>
            <Link href={localeHref('/faq', locale)} className={styles.link}>
              {t.faqLink}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <span className={styles.supportIcon}><Image className={iconStyles.artwork} src="/images/fluent-color/person-key.svg" width={32} height={32} alt="" /></span>
            <h3>{t.responsibilities}</h3>
            <p>
              {windows ? t.access.windows : t.access.linux}
              {' '}
              {t.accessRest}
            </p>
            <p>{t.lawful}</p>
            <Link href="/docs/use-of-service" className={styles.link}>
              {t.terms}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <span className={styles.supportIcon}><Image className={iconStyles.artwork} src="/images/fluent-color/book-open.svg" width={32} height={32} alt="" /></span>
            <h3>{t.guides}</h3>
            <ul className={styles.guides}>
              {(windows ? t.windowsGuides : t.linuxGuides).map(guide => (
                <li key={guide.href}>
                  <Link href={guide.href}>{guide.label}</Link>
                </li>
              ))}
            </ul>
            <Link href="/docs" className={styles.link}>
              {t.allHelp}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

/* Questions --------------------------------------------------------------- */

export function OsFaq({ kind, title, questions, other, locale = 'en' }: {
  kind: Kind | 'plans';
  locale?: SiteLocale;
  title: string;
  questions: ReadonlyArray<readonly [string, string]>;
  other: { title: string; text: string; href: string; label: string };
}) {
  const t = osCopy[locale].faq;
  return (
    <section className="sr-section sr-section-border" aria-labelledby={`${kind}-faq`}>
      <div className={`
        sr-container
        ${styles.faq}
      `}
      >
        <div className={styles.faqSide}>
          <p className="sr-kicker">{t.kicker}</p>
          <h2 className="sr-section-title" id={`${kind}-faq`}>{title}</h2>
          <p>{t.intro}</p>
          <div className={styles.other}>
            <span>{t.other}</span>
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
