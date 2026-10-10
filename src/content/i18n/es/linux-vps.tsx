/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { LinuxVpsCopy } from '../en/linux-vps';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { localeHref } from '../../../lib/stealth/i18n';
import pricing from './pricing';

/* /es/linux-vps. Keywords: keyword-map-es-es.json (primary "vps linux"). */

const page: LinuxVpsCopy = {
  meta: {
    title: 'VPS Linux con acceso root | EE. UU. y UE | StealthRDP',
    description: 'VPS Linux con acceso root total, almacenamiento NVMe y Ubuntu, Debian, AlmaLinux u otra distribución de la lista. Regiones en EE. UU. y la UE.',
  },
  jsonLd: {
    name: 'VPS Linux',
    description: 'VPS Linux con acceso root total, amplia elección de distribuciones, almacenamiento NVMe y regiones en EE. UU. o la UE.',
  },
  kicker: 'VPS Linux',
  title: ['VPS Linux con acceso root y la distribución', 'que necesitas.'],
  lede: 'Un VPS Linux de StealthRDP es un servidor que administras como root, en EE. UU. o en la UE: con Ubuntu, Debian, CentOS u otra imagen de la lista, a un precio que ves antes de pagar.',
  compareButton: 'Comparar planes VPS Linux',
  distrosButton: 'Distribuciones Linux',
  latest: 'Última',
  pricing: { kicker: 'Catálogo VPS actual', title: 'Elige los recursos de tu servidor Linux' },
  resources: ({ bronze, cheapest }) => (
    <>
      <p>
        {`El catálogo actual empieza con ${cheapest.name} desde ${cheapest.price}/mes. Elige Ubuntu, Debian u otra distribución de la lista al contratar.`}
      </p>
      <p>
        {bronze.map(plan => `${plan.name}: ${pricing.spec(plan.specs.cpu)}, ${plan.specs.ram} de RAM, ${plan.specs.storage} y ancho de banda ${pricing.spec(plan.specs.bandwidth).toLowerCase()}.`).join(' ')}
        {' '}
        Revisa la fila actual antes de contratar. Los precios y la disponibilidad pueden cambiar.
      </p>
      <div className="sr-inline-links">
        <Link href={`${localeHref('/plans', 'es')}#linux-vps`}>
          Catálogo VPS Linux
          <ArrowRight size={16} />
        </Link>
        <Link href={`${localeHref('/plans', 'es')}#comparison`}>
          Comparativa de planes
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  ),
  faqTitle: 'Preguntas sobre el VPS Linux',
  questions: ({ cheapest }) => [
    ['¿Cuánto cuesta un VPS Linux?', `El plan más pequeño, ${cheapest.name}, cuesta ${cheapest.price} al mes. Confirma el precio actual y la región al contratar.`],
    ['¿Qué distribuciones Linux puedo usar?', 'AlmaLinux 8, 9 y 10; Alpine Linux 3.15, 3.19 y 3.23; CentOS 7, Stream 8 y Stream 9; Debian 10, 11, 12 y 13; Fedora 37 a 44; FreeBSD 13.2 a 15.0; Rocky Linux 8, 9 y 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS y 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux en su última versión, y Oracle Linux 8 y 9.'],
    ['¿Puedo tener un VPS con Ubuntu?', 'Sí. Elige Ubuntu como sistema operativo al contratar: 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS o 26.04 LTS. Recibes el VPS con Ubuntu instalado y acceso root total.'],
    ['¿Servidor Debian o Ubuntu: cuál elijo?', 'Los dos funcionan bien con la mayoría del software de servidor. Ubuntu LTS es habitual en tutoriales y guías de paneles de control. Debian stable cambia menos entre versiones. Si tu software documenta uno de los dos, elige ese.'],
    ['¿Los planes incluyen acceso root?', 'Sí. Todos los planes VPS incluyen acceso root total.'],
    ['¿Hay planes Linux en EE. UU. y en la UE?', 'Sí. Los planes de EE. UU. funcionan en Phoenix, Arizona, y los de la UE en Ámsterdam, Países Bajos; ambos centros de datos son conformes al RGPD. Confirma la región al contratar.'],
    ['¿Cuándo se activa?', 'La mayoría de los servidores están activos en 60 segundos tras confirmarse el pago. En momentos de mucha demanda puede tardar unos minutos.'],
    ['¿Cómo recibo las credenciales?', 'Por correo, tras confirmarse el pago.'],
  ],
  other: {
    title: '¿Prefieres Windows?',
    text: 'Para tu software de Windows y el acceso remoto a un escritorio o servidor Windows, mira el VPS Windows.',
    href: localeHref('/windows-vps', 'es'),
    label: 'VPS Windows',
  },
  cta: {
    kicker: 'Planes VPS Linux',
    title: 'Compara los planes VPS Linux',
    text: 'Revisa el plan, la región y el precio, y confirma Linux y la imagen exacta al contratar.',
    compare: 'Comparar planes VPS Linux',
    compareHref: `${localeHref('/plans', 'es')}#linux-vps`,
    checkout: 'Ir a contratar',
    checkoutHref: localeHref('/plans', 'es'),
  },
};

export default page;
