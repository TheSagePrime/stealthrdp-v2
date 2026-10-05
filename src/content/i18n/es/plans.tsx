import type { PlansCopy } from '../en/plans';
import Link from 'next/link';
import pricing from './pricing';

/* /es/plans. Keywords: keyword-map-es-es.json (primary "vps barato"). */

const page: PlansCopy = {
  meta: {
    title: 'VPS barato Windows y Linux: planes y precios | StealthRDP',
    description: 'Planes VPS baratos para Windows y Linux en EE. UU. y la UE: almacenamiento NVMe, acceso total de administrador y soporte 24/7. Compara precios y contrata.',
  },
  jsonLd: {
    listName: 'Planes VPS de StealthRDP',
    describe: plan => `${pricing.spec(plan.specs.cpu)}, ${plan.specs.ram} de RAM, ${plan.specs.storage}, región ${pricing.regionNames[plan.location]}`,
  },
  kicker: 'VPS Windows y Linux',
  title: 'VPS barato: planes Windows y Linux',
  lede: 'Compara todos los planes VPS Windows y Linux en un solo sitio. Elige recursos, región y periodo de facturación antes de contratar.',
  compareButton: 'Comparar planes estándar',
  buildButton: 'Configura tu propio VPS',
  facts: {
    plans: 'planes',
    start: lowest => pricing.money(lowest),
    startText: 'al mes para empezar',
    stock: 'servidores disponibles',
  },
  grid: { kicker: 'PLANES ESTÁNDAR', title: 'Precios VPS por nivel de recursos' },
  os: {
    kicker: 'Sistemas operativos',
    title: 'Elige el entorno VPS que encaja con tu trabajo.',
    windows: {
      badge: 'VPS Windows',
      title: 'VPS Windows para acceso remoto gráfico.',
      text: 'Elige Windows si tu trabajo necesita un escritorio gráfico o software compatible con Microsoft. Compara arriba CPU, RAM, almacenamiento NVMe, ancho de banda, región y periodo de facturación.',
      licensing: (
        <>
          <strong>Licencia de Windows:</strong>
          {' '}
          StealthRDP solo proporciona la infraestructura.
          La licencia de Microsoft Windows no está incluida ni la suministra StealthRDP.
          Quien use Windows es responsable de cumplir con su licencia.
          {' '}
          <Link href="/docs/windows-licensing">Más sobre las licencias de Windows (en inglés).</Link>
        </>
      ),
      guide: 'Ver el VPS Windows',
      compare: 'Comparar recursos VPS Windows',
    },
    linux: {
      badge: 'VPS Linux',
      title: 'VPS Linux para servidores y software de código abierto.',
      text: 'Elige Linux para administrar por línea de comandos, alojar webs, aplicaciones de código abierto, automatización y herramientas de servidor. Compara los mismos niveles de recursos antes de contratar.',
      guide: 'Ver el VPS Linux',
      compare: 'Comparar recursos VPS Linux',
    },
  },
  included: {
    kicker: 'Incluido en cada plan',
    title: 'Lo esencial ya viene incluido.',
    text: 'Elige el plan por recursos. Estos servicios básicos van con cada servidor.',
    items: [
      { title: 'Acceso total de administrador', text: 'Controla tu servidor desde el primer día' },
      { title: 'Almacenamiento NVMe SSD', text: 'Discos rápidos para el trabajo diario' },
      { title: 'VM aisladas', text: 'Una máquina virtual independiente por servidor' },
      { title: 'Activación rápida', text: 'Normalmente en 60 segundos tras el pago' },
      { title: 'Soporte 24/7', text: 'Ayuda cuando la necesitas' },
    ],
  },
  faqTitle: 'Preguntas sobre los planes VPS',
  questions: lowest => [
    ['¿Dónde están los servidores VPS?', 'En Phoenix, Arizona (EE. UU.) y en Ámsterdam, Países Bajos (UE), ambos conformes al RGPD. Cada plan muestra su región. Elige un VPS en EE. UU. para usuarios y servicios en Norteamérica, y uno en la UE para Europa; desde España, la región UE es la más cercana.'],
    ['¿Cuánto cuesta un VPS barato en StealthRDP?', `El plan más pequeño cuesta ${lowest} al mes. Con periodos de 3, 6, 12 o 24 meses el precio por mes baja; el precio normal aparece al lado para comparar.`],
    ['¿Cómo contrato un VPS Windows o Linux?', 'Elige arriba un plan y un periodo de facturación y continúa al pedido. Allí eliges Windows o Linux y la versión exacta. La mayoría de los servidores están activos en 60 segundos tras confirmarse el pago.'],
    ['¿Qué es un servidor virtual?', 'Un servidor virtual (VPS) es una máquina virtual con su propia asignación de CPU, RAM y almacenamiento NVMe. La gestionas con acceso total de administrador y pagas por periodo de facturación, sin comprar hardware.'],
    ['¿Qué plan VPS elijo?', 'Parte de tu software, del número de usuarios o sesiones y de los datos que guardas. Compara CPU, RAM y almacenamiento NVMe como límites independientes. Si ningún plan estándar encaja, configura tu propio servidor.'],
    ['¿El soporte está incluido?', 'Sí. Hay soporte 24/7 por WhatsApp, por el sistema de tickets del área de cliente y por correo.'],
    ['¿Puedo cambiar mi dirección IP?', 'Sí. Cada servidor tiene una dirección IPv4 dedicada. El cambio de IP cuesta 5 € por cambio; pídelo al soporte por WhatsApp, ticket del área de cliente o correo.'],
  ],
  other: {
    title: '¿No sabes qué sistema elegir?',
    text: 'Lee las páginas del VPS Windows y del VPS Linux antes de decidir.',
    href: '/windows-vps',
    label: 'VPS Windows',
  },
  build: {
    kicker: 'Para lo que no encaja en un plan',
    title: 'Configura un servidor a tu medida.',
    text: 'Elige tú la CPU, la RAM, el almacenamiento, la ubicación y el periodo de facturación en el configurador.',
    labels: ['CPU', 'RAM', 'Almacenamiento', 'Región'],
    button: 'Configurar y contratar',
  },
};

export default page;
