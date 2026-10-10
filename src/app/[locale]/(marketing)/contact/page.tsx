/* eslint-disable better-tailwindcss/no-unknown-classes -- Existing site layout class. */
import type { Metadata } from 'next';
import { SiDiscord, SiInstagram, SiTelegram, SiWhatsapp, SiX } from '@icons-pack/react-simple-icons';
import Image from 'next/image';
import { Contact7 } from '@/components/shadcnblocks/contact7';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { contactCopy } from '@/content/i18n/contact';
import { localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/contact', { en: contactCopy.en.meta, de: contactCopy.de.meta, es: contactCopy.es.meta });
}

export default async function ContactPage() {
  const locale = await requirePageLocale('/contact');
  const t = contactCopy[locale];
  const supportUrls = ['https://wa.me/447441426993', 'https://dash.stealthrdp.com/submitticket.php', 'mailto:support@stealthrdp.com', localeHref('/status', locale)];
  const supportIcons = [<SiWhatsapp key="wa" size={40} color="default" aria-hidden="true" />, <Image key="ticket" className={iconStyles.artwork} src="/images/fluent-color/chat.svg" width={40} height={40} alt="" />, <Image key="email" className={iconStyles.artwork} src="/images/fluent-color/mail.svg" width={40} height={40} alt="" />, <Image key="status" className={iconStyles.artwork} src="/images/fluent-color/data-trending.svg" width={40} height={40} alt="" />];
  const socialUrls = ['https://discord.gg/9JJFs4DDyF', 'https://t.me/StealthRDP', 'https://x.com/stealthrdp', 'https://www.instagram.com/stealth_rdp'];
  const socialIcons = [<SiDiscord key="discord" size={40} color="default" aria-hidden="true" />, <SiTelegram key="telegram" size={40} color="default" aria-hidden="true" />, <SiX key="x" size={40} color="default" aria-hidden="true" />, <SiInstagram key="instagram" size={40} color="default" aria-hidden="true" />];
  return (
    <div className="srv-page">
      <Contact7 primary eyebrow={t.eyebrow} title={t.title} description={t.description} items={t.support.map(([title, description, label], index) => ({ title: title!, description: description!, label: label!, href: supportUrls[index]!, icon: supportIcons[index] }))} />
      <Contact7 eyebrow={t.communityEyebrow} title={t.communityTitle} description={t.communityDescription} items={t.social.map(([title, description, label], index) => ({ title: title!, description: description!, label: label!, href: socialUrls[index]!, icon: socialIcons[index] }))} />
    </div>
  );
}
