/* eslint-disable better-tailwindcss/no-unknown-classes */
import { SiWhatsapp } from '@icons-pack/react-simple-icons';

/* The official WhatsApp brand glyph, in its brand green, on the disc. Decorative:
   every link that uses it carries its own label. */
export function WhatsAppMark({ size = 24 }: { size?: number }) {
  return (
    <span className="sr-wa-mark" style={{ '--wa-size': `${size}px` } as React.CSSProperties} aria-hidden="true">
      <SiWhatsapp size={Math.round(size * 0.58)} color="default" title="" />
    </span>
  );
}
