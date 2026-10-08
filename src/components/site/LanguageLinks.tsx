'use client';

import { CaretDown, Globe } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { languageLinks, logicalPath } from '@/lib/stealth/i18n';
import styles from './LanguageLinks.module.css';

/* Plain links to this page in every language, so visitors and crawlers can reach them without
   JavaScript. Where the page has no version in a language, the link goes to that language's home
   page. The server renders the internal path (/en/plans) and the browser shows /plans; both
   resolve to the same page.
   `names` (the top bar) shows a globe and the language names, shortened to codes on phones;
   `codes` (the footer) shows EN, DE, ES. */
export function LanguageLinks({ label, variant = 'codes', className }: { label: string; variant?: 'codes' | 'names' | 'dropdown'; className?: string }) {
  const { path, locale } = logicalPath(usePathname() || '/');
  const links = languageLinks(path);

  if (variant === 'dropdown') {
    return (
      <details
        className={styles.dropdown}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.currentTarget.removeAttribute('open');
            event.currentTarget.querySelector('summary')?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            event.currentTarget.removeAttribute('open');
          }
        }}
      >
        <summary aria-label={label}>
          <Globe size={18} aria-hidden="true" />
          <span>{links.find(link => link.locale === locale)?.name}</span>
          <CaretDown size={14} aria-hidden="true" />
        </summary>
        <nav className={styles.dropdownPanel} aria-label={label}>
          {links.map(link => (
            <a
              key={link.locale}
              href={link.href}
              hrefLang={link.locale}
              lang={link.locale}
              aria-current={link.locale === locale ? 'page' : undefined}
              onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open');
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </details>
    );
  }

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
