/* eslint-disable better-tailwindcss/no-unknown-classes -- Existing site layout class. */
import type { Metadata } from 'next';
import { SiDiscord, SiInstagram, SiTelegram, SiWhatsapp, SiX } from '@icons-pack/react-simple-icons';
import { EnvelopeSimple, Pulse, Ticket } from '@phosphor-icons/react/dist/ssr';
import { Contact7 } from '@/components/shadcnblocks/contact7';
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
  const supportIcons = [<SiWhatsapp key="wa" size={24} aria-hidden="true" />, <Ticket key="ticket" size={24} weight="fill" />, <EnvelopeSimple key="email" size={24} weight="fill" />, <Pulse key="status" size={24} weight="fill" />];
  const socialUrls = ['https://discord.gg/9JJFs4DDyF', 'https://t.me/StealthRDP', 'https://x.com/stealthrdp', 'https://www.instagram.com/stealth_rdp'];
  const socialIcons = [<SiDiscord key="discord" size={24} />, <SiTelegram key="telegram" size={24} />, <SiX key="x" size={24} />, <SiInstagram key="instagram" size={24} />];
  return (
    <div className="srv-page">
      <Contact7 primary eyebrow={t.eyebrow} title={t.title} description={t.description} items={t.support.map(([title, description, label], index) => ({ title: title!, description: description!, label: label!, href: supportUrls[index]!, icon: supportIcons[index] }))} />
      <Contact7 eyebrow={t.communityEyebrow} title={t.communityTitle} description={t.communityDescription} items={t.social.map(([title, description, label], index) => ({ title: title!, description: description!, label: label!, href: socialUrls[index]!, icon: socialIcons[index] }))} />
    </div>
  );
}
