import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { isNoindexDocPath } from './routes';

/* Articles live one per file:
   src/content/guides/<slug>.html  front matter + HTML body
   src/content/docs/<slug>.md      front matter + Markdown body
   `order` in the front matter sets the list order. Relative imports only: the SEO scripts load this
   module outside Next.js. */

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: number;
  image?: string;
  sources?: { title: string; url: string; publisher?: string; accessedAt?: string }[];
  html: string;
};

export type DocArticle = {
  slug: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  relatedSlugs: string[];
  sourceUrl?: string;
  illustration?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
};

const FRONT_MATTER = /^---\n([\s\S]*?\n)---\n([\s\S]*)$/;

function loadArticles<T extends { slug: string }>(dir: string, extension: string, bodyKey: string): T[] {
  const folder = path.join(process.cwd(), 'src/content', dir);

  return fs.readdirSync(folder)
    .filter(file => file.endsWith(`.${extension}`))
    .map((file) => {
      const source = fs.readFileSync(path.join(folder, file), 'utf8');
      const match = FRONT_MATTER.exec(source);
      if (!match) {
        throw new Error(`${dir}/${file} has no front matter`);
      }
      const { order, ...meta } = parse(match[1]!) as { order: number } & Record<string, unknown>;
      return { order, article: { slug: file.slice(0, -(extension.length + 1)), ...meta, [bodyKey]: match[2] } as unknown as T };
    })
    .sort((a, b) => a.order - b.order)
    .map(entry => entry.article);
}

export const blogArticles = loadArticles<BlogArticle>('guides', 'html', 'html');
const docsArticles = loadArticles<DocArticle>('docs', 'md', 'content');
export const citadelDocsArticles = docsArticles.filter(article => article.slug.startsWith('citadel-'));
export const helpDocsArticles = docsArticles.filter(article => !article.slug.startsWith('citadel-'));

const docsPublicSlugs: Record<string, string> = {
  '1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial': 'how-to-re-activate-and-extend-your-180-day-windows-trial',
  '1737946054-how-to-setup-your-vpn-on-linux-server-using-outline': 'how-to-setup-your-vpn-on-linux-server-using-outline',
  '1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel': 'install-fast-panel-in-linux-good-web-hosting-free-panel',
  '1737944013-use-of-service': 'use-of-service',
  '1737946470-how-to-install-centos-web-panel-cwp-free-web-panel': 'how-to-install-centos-web-panel-cwp-free-web-panel',
  '1737946390-setup-tun-tap-for-open_vpn': 'setup-tun-tap-for-open-vpn',
  '1737943955-introduction': 'introduction',
  '1737944110-termination-of-service': 'termination-of-service',
  '1737944184-payment-terms': 'payment-terms',
  '1737944204-user-responsibilities': 'user-responsibilities',
  '1737944952-server-stops-randomly': 'server-stops-randomly',
  '1737945157-how-do-i-log-into-windows': 'how-do-i-log-into-windows',
  '1737945947-how-to-force-https-using-htaccess': 'how-to-force-https-using-htaccess',
  '1737945988-why-you-should-redirect-all-http-traffic-to-https': 'why-you-should-redirect-all-http-traffic-to-https',
  '1737946010-10-ways-to-optimize-your-word_press-website-for-speed': '10-ways-to-optimize-your-word-press-website-for-speed',
  '1737946490-how-to-install-direct-admin-in-a-linux-server': 'how-to-install-direct-admin-in-a-linux-server',
  '1737946509-install-cpanel-and-whm-in-linux-you-need-a-license': 'install-cpanel-and-whm-in-linux-you-need-a-license',
  '1737946534-install-cyber-panel-with-open_lite_speed-in-linux': 'install-cyber-panel-with-open-lite-speed-in-linux',
  '1737948398-frequently-asked-questions-fa_qs': 'frequently-asked-questions-fa-qs',
  '1740916941-how-to-rebuild-a-server': 'how-to-rebuild-a-server',
  '1740917234-how-to-reset-server-change-or-reset-client-area-password': 'how-to-reset-server-change-or-reset-client-area-password',
  '1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework': 'step-by-step-guide-to-fix-win-rm-and-install-net-framework',
  'windows-licensing': 'windows-licensing',
};

export function docPublicSlug(article: DocArticle): string {
  return docsPublicSlugs[article.slug] ?? article.slug.replace(/^\d+-/, '');
}

const docPublicPaths = helpDocsArticles.map(article => `/docs/${docPublicSlug(article)}`);
export const citadelDocPublicPaths = citadelDocsArticles.map(
  article => `/citadel/docs/${docPublicSlug(article).replace(/^citadel-/, '')}`,
);
export const indexableDocPublicPaths = docPublicPaths.filter(path => !isNoindexDocPath(path));

export function findDocByPublicSlug(slug: string): DocArticle | undefined {
  return helpDocsArticles.find(article => docPublicSlug(article) === slug);
}

export function findCitadelDocByPublicSlug(slug: string): DocArticle | undefined {
  return citadelDocsArticles.find(
    article => docPublicSlug(article).replace(/^citadel-/, '') === slug,
  );
}

export function findBlog(slug: string): BlogArticle | undefined {
  return blogArticles.find(article => article.slug === slug);
}

export function articlePath(article: BlogArticle): string {
  return article.slug === 'vps-hosting-minecraft'
    ? '/vps-hosting-minecraft'
    : `/blog/${article.slug}.html`;
}
