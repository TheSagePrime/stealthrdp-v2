'use client';

// Adapted from Shadcnblocks Navbar 1 (free block), copyright Shadcnblocks.com.
// Source and permitted end-product use: THIRD_PARTY_NOTICES.md.
import type { SiteLocale } from '@/config/i18n';
import type { SiteCopy } from '@/content/i18n/site';
import { List, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRef } from 'react';
import { LanguageLinks } from '@/components/site/LanguageLinks';
import { Button } from '@/components/ui/button';
import { localeHref } from '@/lib/stealth/i18n';
import styles from './navbar1.module.css';

const LOGIN_URL = 'https://dash.stealthrdp.com/index.php?rp=/login';

export function Navbar1({ locale, copy }: { locale: SiteLocale; copy: SiteCopy }) {
  const t = copy.header;
  const menu = t.links.map(([title, url]) => ({ title, url: localeHref(url, locale) }));
  const contact = menu.find(item => item.url === localeHref('/contact', locale));
  const primaryMenu = menu.filter(item => item !== contact);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();
  const logo = (
    <Link href={localeHref('/', locale)} aria-label={copy.homeLabel} className={styles.logo} onClick={close}>
      <img src="https://cdn.stealthrdp.com/images/new/6.png" width="700" height="170" alt="StealthRDP" />
    </Link>
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Navbar 1 adapted into logo, centered navigation and account actions. */}
        {logo}
        <nav className={styles.desktopNav} aria-label={t.navLabel}>
          <Link href={localeHref('/plans', locale)}>{t.viewPlans}</Link>
          {primaryMenu.map(item => <Link key={item.url} href={item.url}>{item.title}</Link>)}
        </nav>
        <div className={styles.actions}>
          <LanguageLinks label={copy.languageLabel} variant="dropdown" />
          <div className={styles.desktopAuth}>
            {contact && <Link className={styles.contact} href={contact.url}>{contact.title}</Link>}
            <Button
              asChild
              variant="default"
              size="sm"
              className="rounded-full px-6 shadow-none"
            >
              <a href={LOGIN_URL}>{t.login}</a>
            </Button>
          </div>
          <Button variant="outline" size="icon" className={styles.menuButton} aria-label={t.menu} aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
            <List size={22} aria-hidden="true" />
          </Button>
        </div>
      </div>
      {/* Native modal supplies the sheet's focus trap, Escape and focus restoration. */}
      <dialog
        ref={dialogRef}
        className={styles.sheet}
        aria-label={t.mobileNavLabel}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className={styles.sheetHeader}>
          {logo}
          <Button variant="ghost" size="icon" aria-label={t.closeMenu} onClick={close}><X size={22} aria-hidden="true" /></Button>
        </div>
        <nav className={styles.mobileNav} aria-label={t.mobileNavLabel}>
          {menu.map(item => <Link key={item.url} href={item.url} onClick={close}>{item.title}</Link>)}
          <a href="https://dash.stealthrdp.com/submitticket.php" onClick={close}>{t.support}</a>
        </nav>
        <div className={styles.sheetFooter}>
          <Button asChild variant="outline"><a href={LOGIN_URL}>{t.login}</a></Button>
          <Button asChild><Link href={localeHref('/plans', locale)} onClick={close}>{t.viewPlans}</Link></Button>
        </div>
      </dialog>
    </header>
  );
}
