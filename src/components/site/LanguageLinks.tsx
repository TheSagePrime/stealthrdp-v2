'use client';

import { Globe } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { languageLinks, logicalPath } from '@/lib/stealth/i18n';
import styles from './LanguageLinks.module.css';

/* Plain links to this page in every language, so visitors and crawlers can reach them without
   JavaScript. Where the page has no version in a language, the link goes to that language's home
   page. The server renders the internal path (/en/plans) and the browser shows /plans; both
   resolve to the same page.
   `names` (the top bar) shows a globe and the language names, shortened to codes on phones;
   `codes` (the footer) shows EN, DE, ES. */
export function LanguageLinks({ label, variant = 'codes', className }: { label: string; variant?: 'codes' | 'names'; className?: string }) {
  const { path, locale } = logicalPath(usePathname() || '/');
  const links = languageLinks(path);

  return (
    <nav
      className={[styles.links, className].filter(Boolean).join(' ')}
      data-variant={variant}
      aria-label={label}
    >
      {variant === 'names' && <Globe className={styles.globe} size={16} aria-hidden="true" />}
      {links.map((link) => {
        const text = (
          <>
            <span className={styles.name}>{link.name}</span>
            <span className={styles.code} aria-hidden="true">{link.locale}</span>
          </>
        );
        return link.locale === locale
          ? (
              <span key={link.locale} className={styles.current} aria-current="page" lang={link.locale} title={link.name}>
                {text}
              </span>
            )
          : (
              <a
                key={link.locale}
                className={styles.link}
                href={link.href}
                hrefLang={link.locale}
                lang={link.locale}
                title={link.name}
              >
                {text}
              </a>
            );
      })}
    </nav>
  );
}
