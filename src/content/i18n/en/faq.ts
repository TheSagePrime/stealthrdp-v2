/* The FAQ page in English: page words around the questions in src/content/faqs.json. */

const faq = {
  meta: {
    title: 'Common Questions — StealthRDP Resources',
    description: 'Quick answers about StealthRDP VPS plans, setup, operating systems, upgrades, refunds, billing, security, and support.',
  },
  title: 'Common questions',
  description: 'Plans, setup, billing, operating systems, security, refunds, and support. Search the docs or jump to a topic.',
  topicsLabel: 'FAQ topics',
  /* The words in an answer that link to the Windows licensing doc. */
  licensingPhrase: 'Windows licensing page in Docs',
  support: {
    title: 'Still need help?',
    text: 'Account, billing, and server-specific questions are handled through support.',
    ticket: 'Open a support ticket',
    whatsapp: 'WhatsApp support',
  },
};

export type FaqPageCopy = typeof faq;

export default faq;
