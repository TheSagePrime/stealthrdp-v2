import type { BillingCycle } from '../../../lib/stealth/content';
import type { PricingCopy } from '../en/pricing';

const amount = (value: number) => Number.isInteger(value) ? `${value}` : value.toFixed(2).replace('.', ',');
const money = (value: number) => `${amount(value)} €`;

const suffixes: Record<BillingCycle, string> = {
  monthly: '/mes',
  quarterly: '/3 meses',
  semiannual: '/6 meses',
  annual: '/año',
  biannual: '/2 años',
};

const periods: Record<BillingCycle, string> = {
  monthly: 'cada mes',
  quarterly: 'cada 3 meses',
  semiannual: 'cada 6 meses',
  annual: 'cada año',
  biannual: 'cada 2 años',
};

const descriptions: Record<string, string> = {
  'Blazing Fast Connectivity': 'Conectividad rápida',
};

const pricing: PricingCopy = {
  money,
  suffix: cycle => suffixes[cycle],
  period: cycle => periods[cycle],
  discount: stored => stored.replace(/^Save (\d+)%$/, 'Ahorra un $1 %'),
  description: stored => descriptions[stored] ?? stored,
  spec: stored => stored
    .replace(/^1 Core$/, '1 núcleo')
    .replace(/^(\d+) Core$/, '$1 núcleos')
    .replace(/^Unlimited$/, 'Ilimitado'),
  effective: perMonth => ` · equivale a ${perMonth.toFixed(2).replace('.', ',')} €/mes`,
  cycleLabels: {
    monthly: { full: 'Mensual', short: '1 mes' },
    quarterly: { full: 'Trimestral', short: '3 meses' },
    semiannual: { full: '6 meses', short: '6 meses' },
    annual: { full: 'Anual', short: '1 año' },
    biannual: { full: '2 años', short: '2 años' },
  },
  cycleNames: {
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    annual: 'Anual',
    biannual: 'Bienal',
  },
  priceHeader: {
    monthly: 'Precio al mes',
    quarterly: 'Precio por trimestre',
    semiannual: 'Precio por 6 meses',
    annual: 'Precio al año',
    biannual: 'Precio por 2 años',
  },
  regionNames: { USA: 'EE. UU.', EU: 'UE' },
  regionGroup: 'Región',
  billingGroup: 'Periodo de facturación',
  termAria: (price, period) => `desde ${price} ${period}, a pagar hoy`,
  noPrice: 'precio al contratar',
  liveAria: (plan, cycle, price, period) => `${plan}, ${cycle}: ${price} ${period}, a pagar hoy`,
  noPlan: 'Ningún plan seleccionado',
  mostPopular: 'Más popular',
  featured: 'Destacado',
  region: 'Región:',
  traffic: 'tráfico',
  dueToday: 'a pagar hoy',
  standard: 'precio normal',
  orderNow: 'Contratar',
  orderAria: plan => `Contratar ${plan}: abre el pedido de StealthRDP en dash.stealthrdp.com`,
  see: 'Ver',
  outOfStockRow: 'Agotado',
  outOfStockCard: 'Agotado',
  altRowAria: (plan, alternative) => `${plan} está agotado: contrata ${alternative} en dash.stealthrdp.com`,
  altCardAria: (plan, alternative) => `${plan} está agotado: ver ${alternative}`,
  linuxOnly: 'Solo Linux',
  linuxWindows: 'Linux + Windows',
  specs: { cpu: 'CPU', ram: 'RAM', storage: 'Almacenamiento', bandwidth: 'Ancho de banda' },
  available: count => `${count} disponibles`,
  inStock: 'Disponible',
  outOfStock: 'Agotado',
  cpuLabel: (value, max) => `CPU: ${value} de ${max} núcleos en esta región`,
  ramLabel: (value, max) => `Memoria: ${value} de ${max} GB en esta región`,
  storageLabel: (value, max) => `Almacenamiento: ${value} de ${max} GB en esta región`,
  compare: {
    title: 'Todas las diferencias de un vistazo.',
    hidden: 'Comparativa de planes VPS',
    kicker: '02 / Compara al detalle',
    label: 'Comparar todas las especificaciones',
    note: 'Usa esta tabla para comparar recursos rápidamente. El precio y la disponibilidad actuales se confirman al contratar.',
    hint: 'Desliza la tabla para ver todas las columnas.',
    plan: 'Plan',
    action: 'Acción',
  },
};

export default pricing;
