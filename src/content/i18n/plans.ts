import type { SiteLocale } from '../../config/i18n';
import type { PlansCopy } from './en/plans';
import de from './de/plans';
import en from './en/plans';
import es from './es/plans';

export const plansCopy: Record<SiteLocale, PlansCopy> = { en, de, es };
