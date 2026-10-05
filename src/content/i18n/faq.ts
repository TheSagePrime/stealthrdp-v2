import type { SiteLocale } from '../../config/i18n';
import type { Faq } from '../../lib/stealth/content';
import type { FaqPageCopy } from './en/faq';
import { faqs as enFaqs } from '../../lib/stealth/content';
import de from './de/faq';
import deFaqs from './de/faqs';
import en from './en/faq';
import es from './es/faq';
import esFaqs from './es/faqs';

export const faqPageCopy: Record<SiteLocale, FaqPageCopy> = { en, de, es };

/* English answers come from src/content/faqs.json; German and Spanish carry their own lists. */
export const faqsByLocale: Record<SiteLocale, Faq[]> = { en: enFaqs, de: deFaqs, es: esFaqs };
