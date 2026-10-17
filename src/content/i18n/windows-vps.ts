import type { SiteLocale } from '../../config/i18n';
import type { WindowsVpsCopy } from './en/windows-vps';
import de from './de/windows-vps';
import en from './en/windows-vps';
import es from './es/windows-vps';

export const windowsVpsCopy: Record<SiteLocale, WindowsVpsCopy> = { en, de, es };
