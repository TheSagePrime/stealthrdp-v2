import type { SiteLocale } from '../../config/i18n';
import type { OsCopy } from './en/os';
import de from './de/os';
import en from './en/os';
import es from './es/os';

export const osCopy: Record<SiteLocale, OsCopy> = { en, de, es };
