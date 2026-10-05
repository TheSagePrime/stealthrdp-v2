import type { AboutCopy } from '../en/about';
import { formatEuro } from '../../../lib/stealth/i18n';

/* /es/about. No keyword target in keyword-map-es-es.json: the page says who runs the servers,
   where they are and what every server includes. Facts from PRODUCT_FACTS.md only. */

const about: AboutCopy = {
  meta: {
    title: 'Sobre nosotros: VPS en Ámsterdam y Phoenix | StealthRDP',
    description: 'StealthRDP ofrece VPS Windows y Linux desde centros de datos en Ámsterdam y Phoenix, conformes al RGPD, con más de 12.000 VPS desplegados y soporte 24/7.',
  },
  jsonLd: {
    pageName: 'Sobre StealthRDP',
    description: 'Hosting VPS Windows y Linux desde centros de datos en Phoenix (Arizona) y Ámsterdam (Países Bajos), y Citadel, una protección DDoS de capa 7.',
    crumb: 'Sobre nosotros',
  },
  hero: {
    kicker: 'Sobre StealthRDP',
    title: 'Para quien necesita servidores que',
    titleSpan: 'simplemente funcionen.',
    lede: 'StealthRDP ofrece VPS Windows y Linux desde centros de datos en Phoenix, Arizona, y Ámsterdam, Países Bajos. Eliges un plan, pagas y la mayoría de los servidores están activos en 60 segundos, con acceso total de Administrador o root.',
    compare: 'Comparar planes VPS',
    status: 'Ver el estado del servicio',
  },
  map: {
    from: price => `Desde ${formatEuro(price, 'es')}/mes`,
    noPlans: 'Planes por región',
    usa: 'Región EE. UU.',
    eu: 'Región UE',
    citadelNote: 'Protección DDoS capa 7',
    linuxNote: 'Ubuntu, Debian +3',
    clientArea: 'Área de cliente',
    clientAreaNote: 'Facturas y tickets',
    livePlans: count => `${count} planes activos`,
  },
  proofLabel: 'StealthRDP en cifras',
  proof: [
    { value: '12.000+', label: 'VPS desplegados' },
    { value: '2', label: 'centros de datos, EE. UU. y UE' },
    { value: '60 s', label: 'activación típica' },
    { value: '24/7', label: 'soporte' },
  ],
  products: {
    kicker: 'Qué hacemos',
    title: 'Dos productos, un equipo de soporte.',
    text: 'Un VPS para el trabajo que ejecutas y Citadel para las webs que tienen que seguir en línea. Son productos separados: Citadel no necesita un VPS de StealthRDP.',
    vps: {
      title: 'VPS Windows y Linux',
      text: from => `Windows Server 2019, 2022 y 2025, o Linux como Ubuntu, Debian y AlmaLinux. Almacenamiento NVMe, una IPv4 dedicada y copias de seguridad semanales en todos los planes. Desde ${formatEuro(from, 'es')}/mes.`,
      link: 'Comparar planes VPS',
    },
    citadel: {
      title: 'Protección DDoS Citadel',
      text: 'Protección de capa 7 para webs y aplicaciones HTTP y HTTPS. Starter 0\u00A0€, Growth 49\u00A0€ y Scale 149\u00A0€ al mes.',
      link: 'Ver Citadel',
    },
  },
  standards: {
    kicker: 'Cómo trabajamos',
    title: 'El mismo estándar en cada servidor.',
    text: 'Elijas el plan o el sistema operativo que elijas, todos los VPS de StealthRDP incluyen esto.',
    items: [
      { label: 'Activación', title: 'Activo en unos 60 segundos', text: 'La mayoría de los servidores están activos en 60 segundos tras confirmarse el pago. En momentos de mucha demanda puede tardar unos minutos.' },
      { label: 'Control', title: 'Acceso de Administrador o root', text: 'Acceso total de Administrador en Windows y acceso root total en Linux, desde el primer inicio de sesión.' },
      { label: 'Red', title: 'Una IPv4 dedicada', text: 'Cada servidor tiene su propia dirección IPv4. ¿Necesitas otra? El soporte la cambia por 5\u00A0€.' },
      { label: 'Almacenamiento', title: 'NVMe en todos los planes', text: 'Almacenamiento NVMe en todos los planes, en EE. UU. y en Europa.' },
      { label: 'Copias', title: 'Copias semanales', text: 'Se hace una copia de seguridad de cada servidor una vez por semana.' },
      { label: 'Disponibilidad', title: 'Disponibilidad medida y pública', text: 'La página de estado muestra la disponibilidad de 30 y 90 días y las incidencias de cada servicio monitorizado.' },
    ],
  },
  regions: {
    kicker: 'Dónde funciona tu servidor',
    title: 'Dos centros de datos, uno por región.',
    text: 'Cada plan indica su región. Los dos centros son conformes al RGPD. Elige el más cercano a tus usuarios y a los servicios a los que te conectas; desde España suele ser Ámsterdam.',
    label: region => `Planes ${region === 'USA' ? 'EE. UU.' : 'UE'}`,
    from: price => `Desde ${formatEuro(price, 'es')}/mes`,
    usa: { city: 'Phoenix, Arizona', text: 'El centro de datos de los planes de EE. UU. Elígelo para usuarios y servicios en Norteamérica.' },
    eu: { city: 'Ámsterdam, Países Bajos', text: 'El centro de datos de los planes de la UE. Elígelo para usuarios y servicios en Europa.' },
  },
  reviews: {
    kicker: 'Opiniones de clientes',
    title: 'Lo que dicen los clientes en Trustpilot (en inglés).',
    text: 'Opiniones sin editar de nuestros clientes, cada una con enlace a su fuente.',
    viewOn: 'Ver en Trustpilot',
  },
  final: {
    kicker: '¿Preguntas sobre nuestra infraestructura?',
    title: 'Habla con nuestro equipo.',
    text: 'El soporte está disponible 24/7 por WhatsApp, con tickets en el área de cliente y en support@stealthrdp.com. Las facturas y los tickets están en tu área de cliente.',
    talk: 'Hablar con el equipo',
    whatsapp: 'Escribir al soporte por WhatsApp',
  },
};

export default about;
