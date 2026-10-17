'use client';

import type { SiteCopy } from '@/content/i18n/site';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { siteCopy } from '@/content/i18n/site';
import styles from './TrackingConsent.module.css';

/*
 * Cookie bar and the tags it controls, in two categories: analytics (GA4 and DataFast) and
 * marketing (Google Ads and the Meta pixel, through the sGTM container and Consent Mode).
 * The bar stays at the bottom of the page until the visitor accepts all, rejects all or saves a
 * custom choice. In the EEA, the UK and Switzerland both categories start off; elsewhere both
 * start on. Everywhere an unanswered bar accepts all after 10 seconds (AUTO_ACCEPT_IN_OPT_IN_REGIONS
 * turns that off for the opt-in regions).
 * src/proxy.ts sets the region cookie from the Vercel country header; without it the visitor is
 * treated as EEA. The footer "Cookie settings" button reopens the choice.
 */

const STORAGE_KEY = 'sr-consent';
const OPEN_EVENT = 'sr-consent-open';
const AUTO_ACCEPT_SECONDS = 10;
/* The owner's choice: the silent auto-accept also runs in the EEA, the UK and Switzerland. Set to
   false to require a click there; then also update the cookies section of the privacy page. */
const AUTO_ACCEPT_IN_OPT_IN_REGIONS = true;

type Choice = { analytics: boolean; marketing: boolean };
const ALL: Choice = { analytics: true, marketing: true };
const NONE: Choice = { analytics: false, marketing: false };

function readChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    // 'granted' and 'denied' are the single-switch choices saved before categories existed.
    if (value === 'granted') {
      return ALL;
    }
    if (value === 'denied') {
      return NONE;
    }
    const parsed = value ? JSON.parse(value) as Partial<Choice> : null;
    return parsed ? { analytics: parsed.analytics === true, marketing: parsed.marketing === true } : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Private mode: the choice lasts for this page only.
  }
}

function needsOptIn(): boolean {
  return !document.cookie.split('; ').includes('sr_region=other');
}

function gtagCommand(..._args: unknown[]): IArguments {
  // GTM reads consent commands only as an arguments object, as gtag() pushes them.
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}

/* Google Consent Mode: GA4 follows analytics, Google Ads and Meta follow marketing. */
function updateConsent(choice: Choice) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  const ads = choice.marketing ? 'granted' : 'denied';
  w.dataLayer.push(gtagCommand('consent', 'update', {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: choice.analytics ? 'granted' : 'denied',
  }));
}

const categories = ['necessary', 'analytics', 'marketing'] as const;

export function TrackingConsent({ copy = siteCopy.en.consent, privacyHref = '/privacy#cookies' }: { copy?: SiteCopy['consent']; privacyHref?: string }) {
  // What the tags may do now: the saved choice, or all on outside the opt-in regions.
  const [allowed, setAllowed] = useState<Choice>(NONE);
  const [interacted, setInteracted] = useState(false);
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<Choice>(ALL);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const choice = readChoice();
    const optIn = needsOptIn();
    const initial = choice ?? (optIn ? NONE : ALL);
    setAllowed(initial);
    setDraft(initial);
    setOpen(choice === null);
    setSecondsLeft(choice === null && (!optIn || AUTO_ACCEPT_IN_OPT_IN_REGIONS) ? AUTO_ACCEPT_SECONDS : null);

    const reopen = () => {
      setDraft(readChoice() ?? initial);
      setSecondsLeft(null);
      setCustomizing(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);

    /* The tags cost seconds of main-thread time on a phone, so they wait for the visitor's first
       interaction instead of competing with the page load. */
    const interactions = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'mousemove'] as const;
    const start = () => {
      interactions.forEach(name => window.removeEventListener(name, start));
      setInteracted(true);
    };
    interactions.forEach(name => window.addEventListener(name, start, { once: true, passive: true }));
    return () => {
      window.removeEventListener(OPEN_EVENT, reopen);
      interactions.forEach(name => window.removeEventListener(name, start));
    };
  }, []);

  const decide = (choice: Choice) => {
    saveChoice(choice);
    setAllowed(choice);
    setOpen(false);
    setCustomizing(false);
    setSecondsLeft(null);
    updateConsent(choice);
  };

  /* An unanswered bar quietly accepts all after 10 seconds, as the privacy page says. Opening
     Customize stops it: the visitor is choosing. */
  useEffect(() => {
    if (secondsLeft === null || customizing) {
      return;
    }
    if (secondsLeft <= 0) {
      decide(ALL);
      return;
    }
    const timer = window.setTimeout(setSecondsLeft, 1000, secondsLeft - 1);
    return () => window.clearTimeout(timer);
  }, [secondsLeft, customizing]);

  // While Customize is open the visitor is still choosing, so nothing starts until they save.
  const tags = interacted && !customizing && (allowed.analytics || allowed.marketing);

  return (
    <>
      {tags
        ? (
            <>
              <Script id="stealthrdp-gtm" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];(function(){window.dataLayer.push(arguments)})('consent','default',${JSON.stringify({
                  ad_storage: allowed.marketing ? 'granted' : 'denied',
                  ad_user_data: allowed.marketing ? 'granted' : 'denied',
                  ad_personalization: allowed.marketing ? 'granted' : 'denied',
                  analytics_storage: allowed.analytics ? 'granted' : 'denied',
                })});(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://sgtm.stealthrdp.com/2l3xebiqyzc.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','yw=Ch5ENj0vSDYwSUBGOjFcXhVHS19YRAEWXgkNFAgOERARHglfCg0I');`}
              </Script>
              {allowed.analytics
                ? (
                    <Script
                      id="stealthrdp-datafa"
                      src="https://datafa.st/js/script.js"
                      data-website-id="dfid_6O4WzLRhSgrGULypBOc8I"
                      data-domain="stealthrdp.com"
                      strategy="afterInteractive"
                    />
                  )
                : null}
            </>
          )
        : null}
      {open
        ? (
            <section className={styles.banner} aria-labelledby="sr-consent-title" data-customizing={customizing || undefined}>
              <p className={styles.text}>
                <strong id="sr-consent-title">{copy.title}</strong>
                {' '}
                {copy.text}
                {' '}
                <Link href={privacyHref}>{copy.details}</Link>
                .
              </p>
              {customizing
                ? (
                    <ul className={styles.categories}>
                      {categories.map((id) => {
                        const [name, description] = copy.categories[id];
                        const locked = id === 'necessary';
                        const checked = locked || draft[id];
                        return (
                          <li key={id} className={styles.category}>
                            <label className={styles.categoryRow}>
                              <span>
                                <span className={styles.categoryName}>{name}</span>
                                <span className={styles.categoryText}>{description}</span>
                              </span>
                              {locked
                                ? <span className={styles.alwaysOn}>{copy.alwaysOn}</span>
                                : (
                                    <input
                                      type="checkbox"
                                      role="switch"
                                      className={styles.switch}
                                      checked={checked}
                                      onChange={event => setDraft({ ...draft, [id]: event.target.checked })}
                                    />
                                  )}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )
                : null}
              <div className={styles.actions}>
                {customizing
                  ? <Button size="sm" variant="ghost" className={styles.pill} onClick={() => decide(draft)}>{copy.save}</Button>
                  : <Button size="sm" variant="ghost" className={styles.pill} onClick={() => setCustomizing(true)}>{copy.customize}</Button>}
                <Button size="sm" variant="secondary" className={styles.pill} onClick={() => decide(NONE)}>{copy.reject}</Button>
                <Button size="sm" className={styles.pill} onClick={() => decide(ALL)}>{copy.accept}</Button>
              </div>
            </section>
          )
        : null}
    </>
  );
}

/** Footer control that opens the consent choice again. */
export function CookieSettingsButton({ className, label = siteCopy.en.consent.settings }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {label}
    </button>
  );
}
