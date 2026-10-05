/* The FAQ page in English: page words around the questions in src/content/faqs.json. */

const faq = {
  meta: {
    title: 'Common Questions — StealthRDP Resources',
    description: 'Quick answers about StealthRDP VPS plans, setup, operating systems, upgrades, refunds, billing, security, and support.',
  },
  title: 'Common questions',
  description: 'Plans, setup, billing, operating systems, security, refunds, and support. Search from the resource bar above or jump to a topic.',
  topicsLabel: 'FAQ topics',
  unit: (count: number): string => (count === 1 ? 'answer' : 'answers'),
  /* The words in an answer that link to the Windows licensing doc. */
  licensingPhrase: 'Windows licensing page in Docs',
  /* English category names, so topic tiles get the same icons in every language. */
  iconHints: {} as Record<string, string>,
  support: {
    title: 'Still need help?',
    text: 'Account, billing, and server-specific questions are handled through support.',
    ticket: 'Open a support ticket',
    whatsapp: 'WhatsApp support',
  },
};

export type FaqPageCopy = typeof faq;

export default faq;
