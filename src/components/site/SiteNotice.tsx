/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import type { SiteLocale } from '@/config/i18n';
import { Wrench } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { maintenanceNotice } from '@/content/i18n/notices';
import { localeHref } from '@/lib/stealth/i18n';

/* The service notice in the top bar: a ticker that scrolls like the OS band and links to the
   status page. It renders in the browser only, between the notice's start and end, so the
   temporary text never lands in the indexed HTML and disappears on its own when the window ends.
   It pauses on hover and focus, and stands still for visitors who prefer reduced motion. */
export function SiteNotice({ locale }: { locale: SiteLocale }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const now = Date.now();
    setActive(now >= Date.parse(maintenanceNotice.start) && now < Date.parse(maintenanceNotice.end));
  }, []);

  if (!active) {
    return null;
  }

  const t = maintenanceNotice.copy[locale];
  const items = [t.title, ...t.parts, `${t.link} →`];

  return (
    <Link className="srv3-notice" href={localeHref(maintenanceNotice.href, locale)}>
      <span className="srv3-notice-icon" aria-hidden="true">
        <Wrench size={14} weight="fill" />
      </span>
      <span className="sr-visually-hidden">{items.join('. ')}</span>
      <span className="srv3-notice-marquee" aria-hidden="true">
        <span className="srv3-notice-track">
          {[false, true].map(clone => (
            <span className="srv3-notice-copy" key={String(clone)}>
              {items.map((item, index) => (
                <span key={item} data-lead={index === 0 || undefined}>{item}</span>
              ))}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
