import type { BillingCycle } from '../../../lib/stealth/content';
import type { PricingCopy } from '../en/pricing';

const amount = (value: number) => Number.isInteger(value) ? `${value}` : value.toFixed(2).replace('.', ',');
const money = (value: number) => `${amount(value)} €`;

const suffixes: Record<BillingCycle, string> = {
  monthly: '/Monat',
  quarterly: '/3 Monate',
  semiannual: '/6 Monate',
  annual: '/Jahr',
  biannual: '/2 Jahre',
};

const periods: Record<BillingCycle, string> = {
  monthly: 'monatlich',
  quarterly: 'alle 3 Monate',
  semiannual: 'alle 6 Monate',
  annual: 'jährlich',
  biannual: 'alle 2 Jahre',
};

const descriptions: Record<string, string> = {
  'Blazing Fast Connectivity': 'Schnelle Anbindung',
};

const pricing: PricingCopy = {
  money,
  suffix: cycle => suffixes[cycle],
  period: cycle => periods[cycle],
  discount: stored => stored.replace(/^Save (\d+)%$/, '$1 % sparen'),
  description: stored => descriptions[stored] ?? stored,
  spec: stored => stored
    .replace(/^1 Core$/, '1 Kern')
    .replace(/^(\d+) Core$/, '$1 Kerne')
    .replace(/^Unlimited$/, 'Unbegrenzt'),
  effective: perMonth => ` · effektiv ${perMonth.toFixed(2).replace('.', ',')} €/Monat`,
  cycleLabels: {
    monthly: { full: 'Monatlich', short: '1 Mon.' },
    quarterly: { full: '3 Monate', short: '3 Mon.' },
    semiannual: { full: '6 Monate', short: '6 Mon.' },
    annual: { full: 'Jährlich', short: '1 J.' },
    biannual: { full: '2 Jahre', short: '2 J.' },
  },
  cycleNames: {
    monthly: 'Monatlich',
    quarterly: 'Vierteljährlich',
    semiannual: 'Halbjährlich',
    annual: 'Jährlich',
    biannual: 'Alle 2 Jahre',
  },
  priceHeader: {
    monthly: 'Preis pro Monat',
    quarterly: 'Preis pro Quartal',
    semiannual: 'Preis pro 6 Monate',
    annual: 'Preis pro Jahr',
    biannual: 'Preis pro 2 Jahre',
  },
  regionNames: { USA: 'USA', EU: 'EU' },
  regionGroup: 'Standort',
  billingGroup: 'Abrechnungszeitraum',
  termAria: (price, period) => `ab ${price} ${period}, heute fällig`,
  noPrice: 'Preis bei der Bestellung',
  liveAria: (plan, cycle, price, period) => `${plan}, ${cycle}: ${price} ${period}, heute fällig`,
  noPlan: 'Kein Tarif ausgewählt',
  mostPopular: 'Beliebt',
  featured: 'Empfohlen',
  region: 'Standort:',
  traffic: 'Traffic',
  dueToday: 'heute fällig',
  standard: 'regulär',
  orderNow: 'Jetzt bestellen',
  orderAria: plan => `Jetzt bestellen: ${plan} – öffnet die StealthRDP-Bestellung auf dash.stealthrdp.com`,
  see: 'Alternative:',
  outOfStockRow: 'Ausverkauft',
  outOfStockCard: 'Ausverkauft',
  altRowAria: (plan, alternative) => `${plan} ist ausverkauft – stattdessen ${alternative} auf dash.stealthrdp.com bestellen`,
  altCardAria: (plan, alternative) => `${plan} ist ausverkauft – stattdessen ${alternative} ansehen`,
  linuxOnly: 'Nur Linux',
  linuxWindows: 'Linux + Windows',
  specs: { cpu: 'CPU', ram: 'RAM', storage: 'Speicher', bandwidth: 'Bandbreite' },
  available: count => `${count} verfügbar`,
  inStock: 'Verfügbar',
  outOfStock: 'Ausverkauft',
  cpuLabel: (value, max) => `CPU: ${value} von ${max} Kernen in dieser Region`,
  ramLabel: (value, max) => `Arbeitsspeicher: ${value} von ${max} GB in dieser Region`,
  storageLabel: (value, max) => `Speicher: ${value} von ${max} GB in dieser Region`,
  compare: {
    title: 'Alle Unterschiede auf einen Blick.',
    hidden: 'VPS-Tarife im Vergleich',
    kicker: '02 / Genau vergleichen',
    label: 'Alle Daten vergleichen',
    note: 'Die Tabelle dient dem schnellen Ressourcenvergleich. Aktueller Preis und Verfügbarkeit werden bei der Bestellung bestätigt.',
    hint: 'Wischen Sie über die Tabelle, um alle Spalten zu sehen.',
    plan: 'Tarif',
    action: 'Aktion',
  },
};

export default pricing;
