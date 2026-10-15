import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import Link from 'next/link';
import { Search, FileText, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const locale = await getLocale();
  const query = q?.trim() ?? '';

  let projects: any[] = [];
  let articles: any[] = [];

  if (query) {
    [projects, articles] = await Promise.all([
      prisma.project.findMany({
        where: {
          published: true,
          OR: [
            { titleRu: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { descriptionRu: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      }),
      prisma.article.findMany({
        where: {
          published: true,
          OR: [
            { titleRu: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { excerptRu: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
      }),
    ]);
  }

  const totalResults = (projects?.length ?? 0) + (articles?.length ?? 0);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('search.title', locale) }]} locale={locale} />
      <h1 className="font-display text-3xl font-bold tracking-tight mb-2">{t('search.title', locale)}</h1>
      <p className="text-muted-foreground mb-8">
        {query ? `"${query}" — ${totalResults} ${locale === 'ru' ? 'результатов' : 'results'}` : t('search.placeholder', locale)}
      </p>

      {totalResults === 0 && query && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('search.noResults', locale)}</p>
        </div>
      )}

      {(projects?.length ?? 0) > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />{t('projects.title', locale)}</h2>
          <div className="space-y-3">
            {(projects ?? []).map((p: any) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="block p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-primary">{getLocalized(p.titleRu, p.titleEn, locale)}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{getLocalized(p.descriptionRu, p.descriptionEn, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(articles?.length ?? 0) > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t('blog.title', locale)}</h2>
          <div className="space-y-3">
            {(articles ?? []).map((a: any) => (
              <Link key={a.id} href={`/blog/${a.slug}`} className="block p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-primary">{getLocalized(a.titleRu, a.titleEn, locale)}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{getLocalized(a.excerptRu, a.excerptEn, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
