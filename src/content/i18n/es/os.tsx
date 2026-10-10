import type { OsCopy } from '../en/os';
import Link from 'next/link';

const os: OsCopy = {
  session: {
    computer: 'Tu ordenador',
    signedInAs: 'Sesión como',
    regionNote: 'Región elegida en cada plan',
    facts: ['Activo en unos 60 s', 'IPv4 dedicada', 'Ancho de banda ilimitado'],
    windows: { client: 'Escritorio remoto', session: 'Sesión RDP' },
    linux: { client: 'Cliente SSH', session: 'Sesión SSH' },
    linuxImage: 'Linux',
  },
  journey: {
    kicker: 'Del pedido al acceso',
    title: {
      windows: 'Cuatro pasos del pedido a tu escritorio Windows',
      linux: 'Cuatro pasos del pedido a una shell root',
    },
    intro: 'La mayoría de los servidores están activos en 60 segundos tras confirmarse el pago. En momentos de mucha demanda puede tardar unos minutos.',
    pick: {
      title: 'Elige plan y región',
      text: 'Compara arriba CPU, RAM, almacenamiento, ancho de banda y precio, en EE. UU. o en la UE.',
    },
    windowsOs: { title: 'Elige Windows Server al contratar', text: 'Al contratar eliges el sistema operativo: Windows Server 2019, 2022 o 2025.' },
    linuxOs: { title: 'Elige una distribución al contratar', text: 'Al contratar eliges el sistema operativo entre las imágenes Linux disponibles.' },
    credentials: {
      title: 'Recibe tus credenciales',
      text: 'StealthRDP te las envía por correo tras confirmar el pago.',
      time: 'Normalmente en 60 segundos',
    },
    windowsConnect: {
      title: 'Conéctate por Escritorio remoto',
      text: 'Introduce la IP del servidor que recibes por correo e inicia sesión como Administrator.',
      linkLabel: 'Guía: iniciar sesión en Windows (en inglés)',
    },
    linuxConnect: { title: 'Inicia sesión como root', text: 'Conéctate por SSH a la IP del servidor con las credenciales root que recibes por correo.' },
  },
  versions: {
    kicker: 'Entorno',
    title: 'Elige la versión de Windows que necesita tu software',
    intro: 'Estas son las versiones de Windows Server disponibles. Elige una al contratar, según lo que pida tu software.',
    product: 'Windows Server',
    selected: 'Se elige al contratar',
    licensing: (
      <>
        <strong>Licencia de Windows no incluida.</strong>
        {' '}
        StealthRDP solo proporciona la infraestructura. La licencia de Microsoft Windows no está incluida ni la
        suministra StealthRDP. Cada cliente es responsable de cumplir con su licencia.
        {' '}
        <Link href="/docs/windows-licensing">Más sobre las licencias de Windows (en inglés)</Link>
        .
      </>
    ),
  },
  distros: {
    kicker: 'Entorno',
    title: 'Distribuciones Linux disponibles',
    intro: 'Elige la familia de sistema que necesita tu stack y confirma la imagen y la versión exactas al contratar.',
    directAdmin: 'Guía: instalar DirectAdmin en Linux (en inglés)',
  },
  resources: {
    kicker: 'Recursos',
    title: 'Dimensiona el servidor según tu stack',
    intro: 'Cuenta lo que se ejecuta a la vez. Cada punto es un plan del catálogo actual.',
    items: {
      cpu: {
        label: 'CPU',
        unit: 'vCPU',
        carries: 'Trabajo simultáneo',
        text: {
          windows: 'Ajústala a la carga de proceso y a las tareas simultáneas.',
          linux: 'Compara la CPU con la aplicación, los servicios, los workers y la carga prevista.',
        },
      },
      ram: {
        label: 'RAM',
        unit: 'GB',
        carries: 'Servicios activos',
        text: {
          windows: 'Cuenta con Windows, las aplicaciones y los usuarios conectados a la vez.',
          linux: 'Calcula memoria para el sistema más el servidor web, los procesos, las bases de datos, los paneles y las tareas.',
        },
      },
      storage: {
        label: 'Almacenamiento',
        unit: 'GB',
        carries: 'Archivos y datos',
        text: {
          windows: 'Incluye el sistema operativo, el software instalado, los archivos y lo que añadirás más adelante.',
          linux: 'Incluye el sistema operativo, los paquetes, las bases de datos, los archivos y lo que añadirás más adelante.',
        },
      },
    },
    scaleLabel: (label, min, max, unit, count) => `${label} de ${min} a ${max} ${unit} en ${count} planes`,
  },
  regions: {
    kicker: 'Regiones',
    title: 'EE. UU. o UE',
    intro: 'Elige la región según tus usuarios, la latencia y tus requisitos. Los centros de datos están en Phoenix (EE. UU.) y Ámsterdam (UE), ambos conformes al RGPD. Las cifras salen del catálogo en vivo.',
    names: { USA: 'EE. UU.', EU: 'UE' },
    plans: 'Planes',
    from: 'Desde',
    perMonth: '/mes',
    stock: 'Servidores disponibles',
    view: region => `Ver planes de ${region}`,
  },
  support: {
    kicker: 'Soporte y normas',
    title: 'Ayuda cuando la necesitas y las normas que se aplican',
    heading: 'Soporte',
    whatsapp: 'Soporte por WhatsApp',
    tickets: 'Sistema de tickets del área de cliente',
    email: 'Soporte por correo',
    faqLink: 'Detalles del soporte en las preguntas frecuentes',
    responsibilities: 'Tus responsabilidades',
    access: { windows: 'El acceso total de Administrador de Windows', linux: 'El acceso root total' },
    accessRest: 'te da el control del servidor y del software que instales. Eres responsable de hacer copias de seguridad periódicas de tus datos importantes.',
    lawful: 'El uso debe ser legal. Las condiciones prohíben el abuso, los escaneos, el hacking, el spam, las botnets y usos indebidos similares.',
    terms: 'Condiciones de uso (en inglés)',
    guides: 'Guías (en inglés)',
    windowsGuides: [
      { href: '/docs/how-do-i-log-into-windows', label: 'Iniciar sesión en Windows' },
      { href: '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial', label: 'Ampliar la prueba de 180 días de Windows' },
      { href: '/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework', label: 'Reparar WinRM e instalar .NET Framework' },
      { href: '/docs/how-to-rebuild-a-server', label: 'Reinstalar un servidor' },
    ],
    linuxGuides: [
      { href: '/docs/how-to-install-direct-admin-in-a-linux-server', label: 'Instalar DirectAdmin' },
      { href: '/docs/install-cyber-panel-with-open-lite-speed-in-linux', label: 'Instalar CyberPanel con OpenLiteSpeed' },
      { href: '/docs/how-to-setup-your-vpn-on-linux-server-using-outline', label: 'Configurar un servidor VPN Outline' },
      { href: '/docs/how-to-rebuild-a-server', label: 'Reinstalar un servidor' },
    ],
    allHelp: 'Todos los artículos de ayuda (en inglés)',
  },
  faq: {
    kicker: 'Preguntas frecuentes',
    intro: 'Respuestas rápidas sobre software, acceso, activación y soporte.',
    other: 'Elige otro entorno',
  },
};

export default os;
