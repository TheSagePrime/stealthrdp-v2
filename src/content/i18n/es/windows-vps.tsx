/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { WindowsVpsCopy } from '../en/windows-vps';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { localeHref } from '../../../lib/stealth/i18n';

/* /es/windows-vps. Keywords: keyword-map-es-es.json (primary "vps windows"). */

const page: WindowsVpsCopy = {
  meta: {
    title: 'VPS Windows en EE. UU. y la UE | StealthRDP',
    description: 'VPS Windows con Windows Server 2019, 2022 o 2025, acceso total de administrador, almacenamiento NVMe y Escritorio remoto. Regiones en EE. UU. y la UE.',
  },
  jsonLd: {
    name: 'VPS Windows',
    description: 'VPS Windows con acceso total de administrador, Windows Server 2019, 2022 y 2025, almacenamiento NVMe y regiones en EE. UU. o la UE.',
  },
  kicker: 'VPS Windows',
  title: ['VPS Windows para el trabajo que', 'necesita Windows.'],
  lede: 'Un VPS Windows te da un servidor Windows remoto para tu software habitual, la administración y los procesos de tu negocio, en EE. UU. o en la UE. Compara los recursos y elige la versión de Windows Server al contratar.',
  compareButton: 'Comparar planes VPS Windows',
  versionsButton: 'Versiones de Windows',
  pricing: { kicker: 'Catálogo VPS actual', title: 'Windows VPS: elige los recursos' },
  resources: (
    <>
      <p>
        Un VPS Windows te ofrece un entorno Windows remoto para software, pruebas, administración y procesos de
        negocio. También encaja si necesitas un escritorio o un servidor Windows sin tener la máquina en tu oficina.
      </p>
      <p>
        Empieza por el software y los usuarios. Un plan que basta para una aplicación puede no bastar para varias
        sesiones a la vez o para una instalación más grande.
      </p>
      <p>
        Accedes al servidor por Escritorio remoto. Si el escritorio remoto es el motivo principal, la
        {' '}
        <Link href={localeHref('/rdp-vps', 'es')}>guía de VPS RDP</Link>
        {' '}
        explica qué revisar y la
        {' '}
        <Link href="/docs/how-do-i-log-into-windows">guía de inicio de sesión por Escritorio remoto (en inglés)</Link>
        {' '}
        muestra cómo conectarte desde cada dispositivo.
      </p>
      <div className="sr-inline-links">
        <Link href={`${localeHref('/plans', 'es')}#windows-vps`}>
          Catálogo VPS Windows
          <ArrowRight size={16} />
        </Link>
        <Link href={`${localeHref('/plans', 'es')}#comparison`}>
          Comparativa de planes
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  ),
  faqTitle: 'Preguntas sobre el VPS Windows',
  questions: [
    ['¿Qué es un VPS Windows?', 'Un VPS Windows es un servidor privado virtual con Windows Server. Tiene su propia asignación de CPU, RAM y almacenamiento NVMe, y lo gestionas con acceso total de administrador.'],
    ['¿Puedo usar mi servidor Windows con Escritorio remoto?', 'Sí. Te conectas a tu servidor Windows por Escritorio remoto (RDP) desde Windows, macOS, Linux, Android o iOS. El centro de ayuda explica cómo iniciar sesión con cada cliente (en inglés).'],
    ['¿Tenéis hosting VPS Windows en EE. UU. y en Europa?', 'Sí. Hay planes VPS Windows en EE. UU. (Phoenix, Arizona) y en la UE (Ámsterdam, Países Bajos), ambos conformes al RGPD. Elige la región más cercana a ti o a los servicios con los que trabaja el servidor.'],
    ['¿Hay un VPS Windows barato para empezar?', 'Los precios empiezan en el plan más pequeño del catálogo de arriba. Con periodos de 3, 6, 12 o 24 meses el precio por mes baja. La licencia de Windows no está incluida, así que tenla en cuenta si la necesitas.'],
    ['¿Puedo usar mi software habitual de Windows?', 'Un VPS Windows ofrece un entorno Windows para software compatible. Revisa los requisitos de cada aplicación antes de contratar.'],
    ['¿Los planes VPS Windows incluyen acceso de administrador?', 'Sí. Todos los planes VPS incluyen acceso total de administrador.'],
    ['¿Qué versiones de VPS Windows Server hay?', 'Windows Server 2019, 2022 y 2025.'],
    ['¿Está incluida la licencia de Microsoft Windows?', 'No. La licencia de Microsoft que necesite el uso previsto es responsabilidad del cliente. Se puede proporcionar Windows Server Evaluation con fines de evaluación o prueba; es software de evaluación, no una instalación de Windows con licencia permanente. Puedes usar tus propias licencias de Microsoft válidas cuando lo permitan las condiciones de licencia de Microsoft. Eres responsable de comprobar que tu licencia es válida para el uso alojado que planeas.'],
    ['¿Cuándo se activa mi VPS Windows?', 'La mayoría de los servidores están activos en 60 segundos tras confirmarse el pago. En momentos de mucha demanda puede tardar unos minutos.'],
    ['¿Cómo recibo mis credenciales?', 'StealthRDP te envía las credenciales por correo tras confirmar el pago.'],
    ['¿Cómo elijo CPU, RAM y almacenamiento?', 'Parte de los requisitos de tu software, el número de usuarios, la carga de proceso y el volumen de datos. Después compara las configuraciones disponibles en la comparativa de planes.'],
    ['¿Dónde consigo soporte?', 'Hay soporte 24/7 por WhatsApp, por el sistema de tickets del área de cliente y por correo.'],
    ['¿Puedo ejecutar cualquier cosa?', 'No. El uso debe ser legal y cumplir las condiciones de uso.'],
  ],
  other: {
    title: '¿Prefieres Linux?',
    text: 'Para webs, aplicaciones, bases de datos o entornos de desarrollo, mira el VPS Linux.',
    href: localeHref('/linux-vps', 'es'),
    label: 'VPS Linux',
  },
  cta: {
    kicker: 'Planes VPS Windows',
    title: 'Compara los planes VPS Windows',
    compare: 'Comparar planes',
    compareHref: `${localeHref('/plans', 'es')}#windows-vps`,
    checkout: 'Ir a contratar',
    checkoutHref: localeHref('/plans', 'es'),
  },
};

export default page;
