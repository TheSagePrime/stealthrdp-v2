import type { SiteLocale } from '../../config/i18n';
import type { AboutCopy } from './en/about';
import de from './de/about';
import en from './en/about';
import es from './es/about';

export const aboutCopy: Record<SiteLocale, AboutCopy> = { en, de, es };
