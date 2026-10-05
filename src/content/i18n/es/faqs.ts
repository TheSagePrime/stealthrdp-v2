import type { Faq } from '../../../lib/stealth/content';

/* /es/faq. Only answers backed by PRODUCT_FACTS.md. English entries whose claims are not approved
   (bandwidth tiers, discount percentages, payment methods, upgrades, cancellation, data-centre
   security) are left out until the owner confirms them. Ids match faqs.json where the question
   matches, so anchors stay stable across languages. */

const faq = (displayOrder: number, _id: string, category: string, question: string, answer: string): Faq =>
  ({ _id, category, question, answer, displayOrder, isPublished: true });

const services = 'Servicios y planes';
const billing = 'Precios y facturación';
const account = 'Cuenta';
const support = 'Soporte y seguridad';

const faqs: Faq[] = [
  faq(1, '681b38574f70a98a746bfc2a', services, '¿Qué ofrece StealthRDP?', 'StealthRDP ofrece VPS Windows y Linux (también llamados servidores RDP) con regiones en EE. UU. y la UE, y Citadel, una protección DDoS de capa 7 independiente para aplicaciones HTTP/HTTPS. Además de los planes estándar, puedes configurar tu propio VPS.'),
  faq(2, '681b69d1e75118f3793b13ca', services, '¿Dónde están vuestros centros de datos?', 'En Phoenix, Arizona (planes de EE. UU.) y en Ámsterdam, Países Bajos (planes de la UE). Ambos son conformes al RGPD. Elige la ubicación más cercana a ti o a los servicios con los que trabaja el servidor para reducir la latencia; desde España, la más cercana es Ámsterdam.'),
  faq(3, '681b72067bfe24c6e835c48f', services, '¿Qué diferencia hay entre los planes de EE. UU. y de la UE?', 'Sobre todo la ubicación: los planes de EE. UU. funcionan en Phoenix y los de la UE en Ámsterdam. Elige la región más cercana a ti o a tu público para reducir la latencia. Los recursos y precios de planes equivalentes pueden variar ligeramente entre regiones.'),
  faq(4, '68235345089f47364fbefe63', services, '¿Qué es «Configura tu propio VPS»?', 'En el configurador eliges tú los núcleos de CPU, la RAM y el almacenamiento NVMe, además del sistema operativo, la ubicación (EE. UU. o UE) y el periodo de facturación. Así pagas por los recursos que de verdad necesitas.'),
  faq(5, '68235350089f47364fbefe65', services, '¿Qué sistemas operativos hay?', 'Windows Server 2019, 2022 y 2025. Imágenes Linux: AlmaLinux 8, 9 y 10; Alpine Linux 3.15, 3.19 y 3.23; CentOS 7, Stream 8 y Stream 9; Debian 10, 11, 12 y 13; Fedora 37 a 44; FreeBSD 13.2 a 15.0; Rocky Linux 8, 9 y 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS y 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux en su última versión, y Oracle Linux 8 y 9.'),
  faq(6, '6824a2fd105d77ad34fbf0b2', services, '¿Cuánto tarda en activarse un servicio?', 'La mayoría de los servidores están activos en 60 segundos tras confirmarse el pago. Según el sistema operativo y la carga, puede tardar unos minutos. Recibes un correo con las credenciales en cuanto el servidor está listo.'),
  faq(7, '6824a33f105d77ad34fbf0b8', services, '¿Qué acceso tengo al servidor?', 'Todos los planes incluyen acceso total de Administrador (Windows) o root (Linux). Instalas software, cambias la configuración y gestionas usuarios tú mismo, dentro de las condiciones de uso.'),
  faq(8, '6824a262105d77ad34fbf0ac', billing, '¿Hay periodo de prueba?', 'No hay prueba gratuita. Pero cada servicio nuevo se puede reembolsar en los 7 días siguientes al pago, como saldo en tu cuenta de StealthRDP.'),
  faq(9, '6824a270105d77ad34fbf0ae', billing, '¿Puedo pedir un reembolso si no estoy satisfecho?', 'Sí. Un servicio nuevo se puede reembolsar en los 7 días siguientes al pago. El reembolso se hace como saldo en tu cuenta de StealthRDP, no en el medio de pago original. Pasados esos 7 días, los servicios no son reembolsables. Los detalles están en las condiciones de pago (en inglés).'),
  faq(10, 'bd1ec784d5cc89de37f5febc', billing, '¿Puedo cambiar la dirección IP de mi servidor?', 'Sí. Cada servidor tiene una dirección IPv4 dedicada. El cambio de IP cuesta 5 € por cambio. Pídelo por WhatsApp, con un ticket en el área de cliente o por correo a support@stealthrdp.com.'),
  faq(11, '6824a283105d77ad34fbf0b0', account, '¿Cómo contrato un servidor?', 'Elige en la web el plan y el periodo de facturación y completa el pedido. Tras confirmarse el pago recibes las credenciales por correo; la mayoría de los servidores están activos en 60 segundos.'),
  faq(12, '6824a351105d77ad34fbf0ba', support, '¿Qué hago si tengo un problema técnico?', 'Escribe al soporte por WhatsApp al +44 7441 426993, por el sistema de tickets del área de cliente o por correo a support@stealthrdp.com. El soporte está disponible 24/7. Para urgencias, lo mejor es WhatsApp.'),
  faq(13, 'gdpr', support, '¿StealthRDP cumple el RGPD?', 'Sí. El alojamiento en los dos centros de datos, Ámsterdam y Phoenix, es conforme al RGPD.'),
  faq(14, '6824a3b0105d77ad34fbf0c0', support, '¿Hacéis copias de seguridad?', 'Hacemos copias semanales de toda la infraestructura para recuperación ante desastres. Aun así, no uses el servidor como único almacén de datos importantes: un servidor puede tener fallos de hardware o dejar de responder, y no podemos restaurar archivos sueltos. Hacer tus propias copias periódicas es responsabilidad tuya.'),
  faq(15, '6824a3d4105d77ad34fbf0c3', support, '¿Qué pasa si incumplo las condiciones de uso?', 'Un incumplimiento puede suponer la suspensión o la baja inmediata del servicio sin reembolso. Están prohibidos, entre otros, la distribución de contenido ilegal, los escaneos o intentos de hacking no autorizados, el spam, las botnets y el abuso de recursos que perjudique a otros clientes. Las faltas leves pueden recibir un aviso; las graves, la baja inmediata.'),
  faq(16, '68c9a0114f70a98a746b0001', support, '¿Está incluida la licencia de Microsoft Windows?', 'No. StealthRDP no proporciona licencias de Microsoft Windows, licencias SPLA, licencias RDS, claves de activación ni servicios de licencias, aunque se soliciten. Se puede proporcionar Windows Server Evaluation con fines de evaluación o prueba; es software de evaluación, no una instalación de Windows con licencia permanente. Eres responsable de las licencias que necesite tu uso. Puedes usar tus propias licencias de Microsoft válidas cuando lo permitan las condiciones de Microsoft. Todos los detalles están en la página de licencias de Windows (en inglés).'),
];

export default faqs;
