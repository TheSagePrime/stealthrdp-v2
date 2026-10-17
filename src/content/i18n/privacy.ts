import type { SiteLocale } from '../../config/i18n';
import type { PrivacyCopy } from './en/privacy';
import de from './de/privacy';
import en from './en/privacy';
import es from './es/privacy';

export const privacyCopy: Record<SiteLocale, PrivacyCopy> = { en, de, es };
