import type { SiteLocale } from '../../config/i18n';
import type { StatusCopy } from './en/status';
import de from './de/status';
import en from './en/status';
import es from './es/status';

export const statusCopy: Record<SiteLocale, StatusCopy> = { en, de, es };
