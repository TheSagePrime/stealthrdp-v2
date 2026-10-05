import type { SiteLocale } from '../../config/i18n';
import type { LinuxVpsCopy } from './en/linux-vps';
import de from './de/linux-vps';
import en from './en/linux-vps';
import es from './es/linux-vps';

export const linuxVpsCopy: Record<SiteLocale, LinuxVpsCopy> = { en, de, es };
