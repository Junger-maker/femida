import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SectionHeading } from '@/components/section-heading';
import { BlogClient } from './blog-client';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const locale = await getLocale();
  const articles = await prisma.article.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('blog.title', locale) }]} locale={locale} />
      <SectionHeading title={t('blog.title', locale)} />
      <BlogClient
        locale={locale}
        articles={(articles ?? []).map((a: any) => ({
          id: a.id,
          slug: a.slug,
          title: getLocalized(a.titleRu, a.titleEn, locale),
          excerpt: getLocalized(a.excerptRu, a.excerptEn, locale),
          imageUrl: a.imageUrl ?? '',
          publishedAt: a.publishedAt?.toISOString() ?? '',
          tags: (() => { try { return JSON.parse(a.tags ?? '[]'); } catch { return []; } })(),
        }))}
        readMore={t('blog.readMore', locale)}
      />
    </div>
  );
}
