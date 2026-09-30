/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta } from '@/components/seo/Article';
import { TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import rdpGuide from '@/content/rdp-vps-guide.json';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';

function findPublication() {
  const config = getSeoConfig();
  return { config, publication: config.articles.publications.find(item => item.slug === rdpGuide.slug) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { config, publication } = findPublication();
  return publication ? createArticleMetadata(publication, config) : {};
}

export default function RdpVpsGuidePage() {
  const { config, publication } = findPublication();
  if (!publication) {
    notFound();
  }

  return (
    /* The guide body stays prose: a reading-width shell, not a card. */
    <article className="mx-auto grid w-full max-w-3xl gap-8 px-5 pt-24 pb-28">
      <header className="grid gap-4">
        <p className="sr-kicker">{rdpGuide.category}</p>
        <h1 className="text-display-1 tracking-tight text-balance">{rdpGuide.h1}</h1>
        <ArticlePublicationMeta article={publication} />
        <p className="sr-lede">{rdpGuide.excerpt}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-body-muted">{rdpGuide.author}</Badge>
          <Badge variant="outline" className="text-body-muted">
            {rdpGuide.readingTime}
            {' '}
            min read
          </Badge>
        </div>
      </header>
      <ArticleJsonLd article={publication} config={config} />
      <TrustedArticleBody html={rdpGuide.html} />
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/plans">View plans</Link>
        </Button>
        <Button asChild size="sm">
          <a href="https://dash.stealthrdp.com/submitticket.php">Ask support</a>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a href="https://wa.me/447441426993">WhatsApp</a>
        </Button>
      </div>
    </article>
  );
}
