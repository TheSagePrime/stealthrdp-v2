import type { SiteLocale } from '../../config/i18n';

/* A short-lived service notice, shown as a moving ticker in the top bar (SiteNotice) between
   `start` and `end` only. The words come from the owner's announcement; do not add claims.
   Amsterdam is on CEST (UTC+2) until 25 October 2026. Remove the notice once it has ended. */

type NoticeCopy = {
  title: string;
  parts: string[];
  link: string;
};

export const maintenanceNotice: {
  start: string;
  end: string;
  href: string;
  copy: Record<SiteLocale, NoticeCopy>;
} = {
  start: '2026-10-01T00:00:00+02:00',
  /* The end of 8 October in Amsterdam. */
  end: '2026-10-09T00:00:00+02:00',
  href: '/status',
  copy: {
    en: {
      title: 'Planned maintenance · Amsterdam (EU) · 6–8 Oct 2026, Amsterdam time (CEST, UTC+2)',
      parts: [
        'EU servers may be unavailable for up to 24 hours while we move to a new, upgraded system',
        'Faster CPUs, built-in DDoS protection and faster networking',
      ],
      link: 'Updates on the status page',
    },
    de: {
      title: 'Geplante Wartung · Amsterdam (EU) · 6.–8. Okt. 2026, Amsterdamer Zeit (MESZ, UTC+2)',
      parts: [
        'EU-Server können bis zu 24 Stunden nicht erreichbar sein, während wir auf ein neues, leistungsstärkeres System umziehen',
        'Schnellere CPUs, integrierter DDoS-Schutz und schnelleres Netzwerk',
      ],
      link: 'Updates auf der Statusseite',
    },
    es: {
      title: 'Mantenimiento programado · Ámsterdam (UE) · 6–8 oct. 2026, hora de Ámsterdam (CEST, UTC+2)',
      parts: [
        'Los servidores de la UE pueden no estar disponibles hasta 24 horas mientras migramos a un sistema nuevo y mejorado',
        'CPU más rápidas, protección DDoS integrada y red más rápida',
      ],
      link: 'Novedades en la página de estado',
    },
  },
};
