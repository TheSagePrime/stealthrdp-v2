import type { SiteLocale } from '../../config/i18n';
import type { HomeCopy } from './en/home';
import de from './de/home';
import en from './en/home';
import es from './es/home';

export const homeCopy: Record<SiteLocale, HomeCopy> = { en, de, es };
