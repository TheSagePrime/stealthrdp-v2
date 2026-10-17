import Image from 'next/image';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { osLogos } from '@/config/os-logos';

/* Icons of the docs shell, from the site's own sets (DESIGN.md, "Color icon artwork"): the
   Microsoft Fluent Color artwork in public/images/fluent-color for sections, groups and links,
   and the real Windows mark the OS pages use for Windows. */

export type FluentIconName
  = | 'board'
    | 'book-open'
    | 'chat'
    | 'chat-bubbles-question'
    | 'cloud'
    | 'data-trending'
    | 'database'
    | 'gauge'
    | 'globe'
    | 'headset'
    | 'laptop'
    | 'notebook'
    | 'person-key'
    | 'receipt'
    | 'settings'
    | 'shield-checkmark';

export function FluentIcon({ name, size = 16 }: { name: FluentIconName; size?: number }) {
  return <Image className={iconStyles.artwork} src={`/images/fluent-color/${name}.svg`} width={size} height={size} alt="" />;
}

export function WindowsMark({ size = 16 }: { size?: number }) {
  // The panel serves this logo; next/image would need its host in the image config.
  // eslint-disable-next-line next/no-img-element
  return <img className={iconStyles.artwork} src={osLogos.windows} width={size} height={size} alt="" />;
}
