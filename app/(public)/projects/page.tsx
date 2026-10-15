import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SectionHeading } from '@/components/section-heading';
import { ProjectsClient } from './projects-client';


export default async function ProjectsPage() {
  const locale = await getLocale();
  const projects = await prisma.project.findMany({ where: { published: true }, orderBy: { year: 'desc' } });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('projects.title', locale) }]} locale={locale} />
      <SectionHeading title={t('projects.title', locale)} />
      <ProjectsClient
        locale={locale}
        projects={(projects ?? []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: getLocalized(p.titleRu, p.titleEn, locale),
          description: getLocalized(p.descriptionRu, p.descriptionEn, locale),
          category: p.category,
          year: p.year,
          imageUrl: p.imageUrl ?? '',
        }))}
        translations={{
          all: t('projects.filter.all', locale),
          residential: t('projects.filter.residential', locale),
          commercial: t('projects.filter.commercial', locale),
          public: t('projects.filter.public', locale),
          interior: t('projects.filter.interior', locale),
          more: t('projects.more', locale),
        }}
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
