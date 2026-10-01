'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from './TrackingConsent.module.css';

/*
 * Analytics and advertising tags (the sGTM container: GA4, Google Ads, Meta pixel; and DataFast).
 * In the EEA, the UK and Switzerland they load only after the visitor accepts. Elsewhere they load
 * by default and the footer "Cookie settings" button opts out. src/proxy.ts sets the region cookie
 * from the Vercel country header; without it the visitor is treated as EEA.
 */

const STORAGE_KEY = 'sr-consent';
const OPEN_EVENT = 'sr-consent-open';

type Choice = 'granted' | 'denied';

function readChoice(): Choice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private mode: the choice lasts for this page only.
  }
}

function needsOptIn(): boolean {
  return !document.cookie.split('; ').includes('sr_region=other');
}

/* Tell tags that already run on this page to stop using cookies. The next page load skips them. */
function gtagCommand(..._args: unknown[]): IArguments {
  // GTM reads consent commands only as an arguments object, as gtag() pushes them.
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}

function revokeLoadedTags() {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(gtagCommand('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  }));
}

export function TrackingConsent() {
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    const optIn = needsOptIn();
    setLoad(choice === 'granted' || (choice === null && !optIn));
    setOpen(choice === null && optIn);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = (choice: Choice) => {
    saveChoice(choice);
    setOpen(false);
    if (choice === 'granted') {
      setLoad(true);
    } else if (load) {
      revokeLoadedTags();
    }
  };

  return (
    <>
      {load
        ? (
            <>
              <Script id="stealthrdp-gtm" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://sgtm.stealthrdp.com/2l3xebiqyzc.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','yw=Ch5ENj0vSDYwSUBGOjFcXhVHS19YRAEWXgkNFAgOERARHglfCg0I');`}
              </Script>
              <Script
                id="stealthrdp-datafa"
                src="https://datafa.st/js/script.js"
                data-website-id="dfid_6O4WzLRhSgrGULypBOc8I"
                data-domain="stealthrdp.com"
                strategy="afterInteractive"
              />
            </>
          )
        : null}
      {open
        ? (
            <section className={styles.banner} aria-labelledby="sr-consent-title">
              <p id="sr-consent-title" className={styles.title}>Cookies for analytics and ads</p>
              <p className={styles.text}>
                With your consent we use Google Analytics, Google Ads, the Meta pixel and DataFast to
                measure visits and ads. The site works the same if you reject them.
                {' '}
                <Link href="/privacy#cookies">Read the details</Link>
              </p>
              <div className={styles.actions}>
                <Button size="sm" variant="outline" onClick={() => decide('denied')}>Reject</Button>
                <Button size="sm" onClick={() => decide('granted')}>Accept</Button>
              </div>
            </section>
          )
        : null}
    </>
  );
}

/** Footer control that opens the consent choice again. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
