import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { HomeClient } from './home-client';


export default async function HomePage() {
  const locale = await getLocale();
  const [slides, articles] = await Promise.all([
    prisma.slide.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.article.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
  ]);

  return (
    <HomeClient
      locale={locale}
      slides={(slides ?? []).map((s: any) => ({
        id: s.id,
        title: getLocalized(s.titleRu, s.titleEn, locale),
        subtitle: getLocalized(s.subtitleRu, s.subtitleEn, locale),
        imageUrl: s.imageUrl ?? '',
        linkUrl: s.linkUrl ?? '',
      }))}
      articles={(articles ?? []).map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: getLocalized(a.titleRu, a.titleEn, locale),
        excerpt: getLocalized(a.excerptRu, a.excerptEn, locale),
        imageUrl: a.imageUrl ?? '',
        publishedAt: a.publishedAt?.toISOString() ?? '',
        tags: (() => { try { return JSON.parse(a.tags ?? '[]'); } catch { return []; } })(),
      }))}
      translations={{
        heroTitle: t('home.hero.title', locale),
        heroSubtitle: t('home.hero.subtitle', locale),
        heroCta: t('home.hero.cta', locale),
        popularTitle: t('home.popular', locale),
        aboutTitle: t('home.about.title', locale),
        aboutText: t('home.about.text', locale),
        aboutCta: t('home.about.cta', locale),
        newsTitle: t('home.news', locale),
        newsAll: t('home.news.all', locale),
        readMore: t('blog.readMore', locale),
      }}
    />
  );
}
export const dynamic = 'force-dynamic';
