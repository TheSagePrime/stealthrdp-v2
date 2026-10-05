import type { PrivacyCopy } from '../en/privacy';

/* /es/privacy. A translation of the English policy: no added or changed terms. The English
   version is binding, and the page says so. The consent banner's names ("Aceptar",
   "Configuración de cookies") match src/content/i18n/site.ts. */

const privacy: PrivacyCopy = {
  meta: {
    title: 'Política de privacidad | StealthRDP',
    description: 'Política de privacidad de StealthRDP: qué datos recogemos, para qué los usamos y cómo los protegemos.',
  },
  tocLabel: 'En esta página',
  kicker: 'Legal',
  title: 'Política de privacidad',
  updated: 'Última actualización: octubre de 2026',
  binding: 'Esta traducción es solo informativa. La versión en inglés es la jurídicamente vinculante.',
  keyPointsLabel: 'Lo esencial',
  keyPoints: [
    'No vendemos tus datos personales.',
    'No guardamos los datos completos de tarjetas de pago en nuestros servidores.',
    'Puedes pedir al soporte que te dé acceso a tus datos, los corrija o los elimine.',
  ],
  sections: [
    {
      id: 'information-we-collect',
      title: 'Qué datos recogemos',
      body: <p>Recogemos los datos que nos das directamente al crear una cuenta, hacer un pedido o contactar con el soporte: tu nombre, tu dirección de correo electrónico, tus datos de facturación y cualquier información que compartas en las solicitudes de soporte. También recogemos datos técnicos básicos —dirección IP, tipo de navegador y páginas visitadas— para operar y mejorar nuestros servicios.</p>,
    },
    {
      id: 'how-we-use-information',
      title: 'Para qué usamos tus datos',
      body: (
        <ul>
          <li>Prestar, mantener y proteger tus servidores y tu cuenta</li>
          <li>Procesar pagos y prevenir el fraude</li>
          <li>Responder a solicitudes de soporte y resolver problemas</li>
          <li>Enviar avisos del servicio, actualizaciones y comunicaciones transaccionales</li>
          <li>Mejorar nuestra web, nuestros servicios y la experiencia del cliente</li>
        </ul>
      ),
    },
    {
      id: 'payments',
      title: 'Pagos',
      body: <p>Los pagos se procesan a través de nuestro proveedor de facturación seguro con cifrado de nivel bancario. No guardamos los datos completos de tarjetas de pago en nuestros servidores.</p>,
    },
    {
      id: 'data-sharing',
      title: 'Cesión de datos',
      body: <p>No vendemos tus datos personales. Solo compartimos información con proveedores de servicios que nos ayudan a operar nuestro negocio, y solo en la medida necesaria para prestar nuestros servicios o cuando lo exige la ley.</p>,
    },
    {
      id: 'cookies',
      title: 'Cookies, analítica y publicidad',
      body: (
        <>
          <p>Esta web usa estas herramientas de terceros:</p>
          <ul>
            <li>Google Analytics 4 y Google Ads, a través de nuestro servidor de etiquetas en sgtm.stealthrdp.com, para medir visitas y conversiones de anuncios y crear audiencias de remarketing</li>
            <li>El píxel de Meta, para medir los anuncios de Meta</li>
            <li>DataFast, para contar visitas</li>
            <li>Un script de Yandex Webmaster desde jsDelivr, para confirmar que la web es nuestra</li>
          </ul>
          <p>Estas herramientas pueden instalar cookies o identificadores similares y reciben tu dirección IP, los datos de tu navegador y las páginas que visitas.</p>
          <p>En la UE, el EEE, el Reino Unido y Suiza solo se cargan después de que elijas «Aceptar». En otros países se cargan por defecto. Puedes cambiar tu elección en cualquier momento con «Configuración de cookies», al pie de cada página.</p>
          <p>Además guardamos dos elementos estrictamente necesarios: tu elección de consentimiento en tu navegador y una cookie de región (sr_region) que indica a la web qué regla de consentimiento se aplica.</p>
        </>
      ),
    },
    {
      id: 'retention-and-security',
      title: 'Conservación y seguridad de los datos',
      body: <p>Conservamos los registros de cuenta y facturación según lo requieran fines empresariales y legales. Aplicamos medidas técnicas y organizativas adecuadas, como infraestructura aislada y acceso restringido, para proteger tus datos.</p>,
    },
    {
      id: 'your-rights',
      title: 'Tus derechos',
      body: <p>Puedes solicitar en cualquier momento el acceso a tus datos personales, su rectificación o su supresión contactando con nuestro equipo de soporte. Respondemos a las solicitudes de privacidad a través del proceso de soporte habitual.</p>,
    },
    {
      id: 'contact',
      title: 'Contacto',
      body: (
        <p>
          Para preguntas sobre privacidad, escribe a
          {' '}
          <a href="mailto:support@stealthrdp.com">support@stealthrdp.com</a>
          {' '}
          o usa el portal de soporte de StealthRDP.
        </p>
      ),
    },
  ],
};

export default privacy;
