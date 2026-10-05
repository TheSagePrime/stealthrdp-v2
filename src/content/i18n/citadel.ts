import type { SiteLocale } from '../../config/i18n';
import type { CitadelCopy } from './en/citadel';
import de from './de/citadel';
import en from './en/citadel';
import es from './es/citadel';

export const citadelCopy: Record<SiteLocale, CitadelCopy> = { en, de, es };
