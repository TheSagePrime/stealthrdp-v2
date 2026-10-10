import type { SiteLocale } from '../../config/i18n';
import type { PricingCopy } from './en/pricing';
import de from './de/pricing';
import en from './en/pricing';
import es from './es/pricing';

export const pricingCopy: Record<SiteLocale, PricingCopy> = { en, de, es };
