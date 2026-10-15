import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Scale, Calendar, Tag } from 'lucide-react';
import { SafeDate } from '@/components/safe-format';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.published) return notFound();

  const title = getLocalized(article.titleRu, article.titleEn, locale);
  const content = getLocalized(article.contentRu, article.contentEn, locale);
  let tags: string[] = [];
  try { tags = JSON.parse(article.tags ?? '[]'); } catch { tags = []; }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: article.publishedAt?.toISOString(),
    publisher: { '@type': 'Organization', name: 'Юридическое агентство «Фемида»' },
  };

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: t('blog.title', locale), href: '/blog' }, { label: title }]} locale={locale} />
      {article.imageUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-8">
          <Image src={article.imageUrl} alt={title} fill className="object-cover" priority />
        </div>
      ) : (
        <div className="aspect-video rounded-xl bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center mb-8">
          <Scale className="h-16 w-16 text-primary/20" />
        </div>
      )}
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /><SafeDate date={article.publishedAt} options={{ dateStyle: 'long' }} locale={locale === 'ru' ? 'ru-RU' : 'en-US'} /></span>
        {tags.length > 0 && <span className="flex items-center gap-1"><Tag className="h-4 w-4" />{tags.join(', ')}</span>}
      </div>
      {content && <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  );
}
