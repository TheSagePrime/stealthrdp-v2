import type { FaqPageCopy } from '../en/faq';

/* /es/faq. No keyword target in keyword-map-es-es.json: the page answers questions people ask
   before they order, under the plain Spanish heading "Preguntas frecuentes". */

const faq: FaqPageCopy = {
  meta: {
    title: 'Preguntas frecuentes sobre VPS | StealthRDP',
    description: 'Respuestas sobre StealthRDP: planes, ubicaciones, sistemas operativos, activación, reembolsos, cambio de IP, RGPD, licencias de Windows y soporte.',
  },
  title: 'Preguntas frecuentes',
  description: 'Planes, activación, facturación, sistemas operativos, seguridad y soporte. Salta directamente a un tema.',
  topicsLabel: 'Temas de las preguntas frecuentes',
  licensingPhrase: 'página de licencias de Windows (en inglés)',
  support: {
    title: '¿Necesitas más ayuda?',
    text: 'Las preguntas sobre tu cuenta, la facturación o un servidor concreto las resuelve el soporte.',
    ticket: 'Abrir un ticket de soporte',
    whatsapp: 'Soporte por WhatsApp',
  },
};

export default faq;
