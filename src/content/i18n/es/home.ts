import type { HomeCopy } from '../en/home';
import pricing from './pricing';

/* /es. Keywords: keyword-map-es-es.json (primary "servidor vps"). Only approved facts from
   PRODUCT_FACTS.md: no "instant", no unverified promises. */

const home: HomeCopy = {
  meta: {
    title: 'Servidor VPS Windows y Linux | StealthRDP',
    description: 'Servidor VPS con Windows o Linux: almacenamiento NVMe, acceso total de administrador, regiones en EE. UU. y la UE, conforme al RGPD y facturación flexible.',
  },
  jsonLd: {
    name: 'Hosting VPS de StealthRDP',
    serviceType: 'Hosting VPS Windows y Linux',
    description: 'VPS Windows y Linux con regiones en EE. UU. y la UE.',
  },
  hero: {
    aria: 'VPS Windows y Linux',
    badge: 'VPS Windows y Linux · Activo en unos 60 segundos',
    title: system => `Tu servidor VPS ${system}. `,
    titleSpan: 'Activo en unos 60 segundos.',
    lede: mode => mode === 'windows'
      ? 'Un servidor VPS para escritorio remoto con acceso total de administrador, almacenamiento NVMe e IPv4 dedicada, en EE. UU. o en la UE. La disponibilidad medida se publica en la página de estado.'
      : 'Un servidor VPS Linux con acceso root total, almacenamiento NVMe e IPv4 dedicada, en EE. UU. o en la UE. La disponibilidad medida se publica en la página de estado.',
    choose: 'Elige tu servidor',
    presales: 'Hacer una consulta previa',
    metaAria: 'Ventajas',
    startingFrom: 'Desde ',
    price: from => pricing.money(from),
    perMonth: price => `${price}/mes`,
    benefits: ['Soporte 24/7', 'IPv4 dedicada', 'Conforme al RGPD'],
  },
  osBand: {
    aria: 'Sistemas operativos disponibles',
    list: 'Windows Server, Ubuntu, Debian, Rocky Linux, AlmaLinux, CentOS, Fedora, Alpine Linux y FreeBSD',
  },
  plans: {
    kicker: 'Elige tu servidor',
    title: 'Hosting VPS con los recursos que necesitas.',
    text: 'Elige región y periodo de facturación y compara la CPU, la RAM, el almacenamiento, el ancho de banda, los sistemas operativos y la disponibilidad.',
  },
  pricing: {
    linuxOnly: 'Solo Linux',
    both: 'Windows + Linux',
    mostPopular: 'Más popular',
    popular: 'Popular',
    billedMonthly: 'Facturación mensual',
    effective: perMonth => `equivale a ${perMonth.toFixed(2).replace('.', ',')} €/mes · a pagar hoy`,
    orderNow: 'Contratar',
    orderAria: plan => `Contratar ${plan}`,
    outOfStock: 'Agotado',
    inStock: 'Disponible',
    available: count => `${count} disponibles`,
    left: count => `quedan ${count}`,
    bandwidth: value => `Ancho de banda ${value.toLowerCase()}`,
    ipv4: 'IPv4 dedicada',
    viewSpecs: 'Ver todas las especificaciones',
    viewAll: 'Ver todos los planes',
  },
  useCases: {
    kicker: 'Usos de un VPS',
    title: '¿Qué puedes ejecutar en un VPS?',
    text: 'Guías prácticas para escritorio remoto, alojamiento web, automatización, trading y copias de seguridad, con consejos de dimensionado y configuración.',
    browse: 'Todas las guías VPS (en inglés)',
    read: 'Leer la guía (en inglés)',
    items: [
      { title: 'Escritorio remoto', text: 'Cuándo un VPS funciona bien como puesto de trabajo remoto, qué afecta a la respuesta y cómo dimensionarlo.', href: '/blog/vps-for-remote-desktop.html' },
      { title: 'Alojamiento web', text: 'Cuándo dar el salto desde el hosting compartido y cómo dimensionar un VPS para toda la pila web.', href: '/blog/vps-for-web-hosting.html' },
      { title: 'Automatización y bots', text: 'Cómo elegir recursos para scripts, workers, servicios de webhooks, bots y automatización continua.', href: '/blog/vps-for-automation-bots.html' },
      { title: 'Trading', text: 'Qué puede mejorar un VPS para el software de trading, qué no, y por qué importa la ubicación.', href: '/blog/vps-for-trading.html' },
      { title: 'Copias y almacenamiento', text: 'Cómo valorar un VPS como destino de copias externas, con retención, transferencia y restauración.', href: '/blog/vps-for-backups-storage.html' },
    ],
  },
  infra: {
    kicker: 'Infraestructura',
    title: 'Infraestructura en la que puedes confiar.',
    text: 'Velocidad, control, alcance y transparencia en cada VPS, con una página de estado donde compruebas la disponibilidad tú mismo.',
    statusLink: 'Ver el estado del servicio',
    items: [
      { title: 'Almacenamiento NVMe SSD', text: 'Acceso rápido a disco para aplicaciones, bases de datos, automatización y trabajo de escritorio.', label: 'Rendimiento' },
      { title: 'Acceso total de administrador', text: 'Cada servidor funciona en su propia máquina virtual, con acceso total de Administrador en Windows o root en Linux.', label: 'Control' },
      { title: 'Centros de datos en EE. UU. y UE', text: 'Phoenix y Ámsterdam, ambos conformes al RGPD. Elige la ubicación más cercana a tu aplicación, con IPv4 dedicada.', label: 'Alcance' },
      { title: 'Disponibilidad medida y pública', text: 'Cada servicio monitorizado muestra su disponibilidad medida en la página de estado, y el soporte responde 24/7.', label: 'Transparencia' },
    ],
  },
  products: {
    kicker: 'Productos StealthRDP',
    title: 'Elige el producto que necesita tu proyecto.',
    text: 'Contrata un VPS server con Windows o Linux para tener capacidad de cálculo, o pasa una aplicación HTTP/HTTPS existente por Citadel para protegerla en la capa 7. Son productos separados y se pueden usar por separado.',
    compare: 'Comparar planes VPS',
    explore: 'Ver la protección DDoS',
    flowAria: 'Productos StealthRDP',
    hosting: { kicker: 'Hosting', title: 'VPS Windows y Linux', small: 'EE. UU. + UE · NVMe · IPv4 dedicada · Acceso de administrador', link: 'Ver el hosting' },
    protection: { kicker: 'Protección DDoS de capa 7', title: 'Citadel de StealthRDP', small: 'Desafíos HTTP/HTTPS · Límites de peticiones · Bloqueo · Estado del origen', link: 'Ver la protección' },
  },
  reviews: {
    kicker: 'Opiniones',
    title: 'Lo que dicen los clientes (en inglés).',
    featured: 'Opinión destacada',
    customer: 'Cliente de StealthRDP',
    viewOn: source => `Ver en ${source}`,
    sources: {
      'Discord review': 'Opinión en Discord',
      'Customer testimonial': 'Testimonio de cliente',
      'Trustpilot': 'Trustpilot',
      'Third-party review': 'Opinión externa',
    },
    streamTitle: 'Opiniones independientes y propias',
    hover: 'Pasa el ratón para pausar',
    swipe: 'Desliza para ver más →',
    marqueeAria: 'Más opiniones de clientes',
    sourceAria: author => `Ver la fuente de la opinión de ${author}`,
  },
  final: {
    eyebrow: 'Más de 12.000 VPS desplegados',
    title: '¿Listo para tu próximo VPS?',
    text: 'Elige región, recursos y sistema operativo. La mayoría de los servidores están activos unos 60 segundos después del pago.',
    start: lowest => pricing.money(lowest),
    startLabel: 'precio de entrada',
    setup: ['60 s', 'activación típica'],
    support: ['24/7', 'soporte'],
    choose: 'Elige tu servidor',
    presales: 'Hacer una consulta previa',
  },
};

export default home;
