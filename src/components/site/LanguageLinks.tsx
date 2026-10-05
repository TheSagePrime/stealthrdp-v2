'use client';

import { usePathname } from 'next/navigation';
import { languageVersions, logicalPath } from '@/lib/stealth/i18n';
import styles from './LanguageLinks.module.css';

/* Plain links to the other language versions of this page, so visitors and crawlers can reach
   them without JavaScript. Hidden on pages that exist in one language only. The server renders
   the internal path (/en/plans) and the browser shows /plans; both resolve to the same page. */
export function LanguageLinks({ label, className }: { label: string; className?: string }) {
  const { path, locale } = logicalPath(usePathname() || '/');
  const versions = languageVersions(path);
  if (versions.length < 2) {
    return null;
  }

  return (
    <nav
      className={className
        ? `
          ${styles.links}
          ${className}
        `
        : styles.links}
      aria-label={label}
    >
      {versions.map(version => version.locale === locale
        ? (
            <span key={version.locale} className={styles.current} aria-current="page" aria-label={version.name} lang={version.locale} title={version.name}>
              {version.locale}
            </span>
          )
        : (
            <a key={version.locale} className={styles.link} href={version.href} hrefLang={version.locale} lang={version.locale} aria-label={version.name} title={version.name}>
              {version.locale}
            </a>
          ))}
    </nav>
  );
}
