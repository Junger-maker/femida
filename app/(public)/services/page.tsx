import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SectionHeading } from '@/components/section-heading';
import { ServicesClient } from './services-client';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const locale = await getLocale();
  const services = await prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('services.title', locale) }]} locale={locale} />
      <SectionHeading title={t('services.title', locale)} />
      <ServicesClient
        locale={locale}
        services={(services ?? []).map((s: any) => ({
          id: s.id,
          title: getLocalized(s.titleRu, s.titleEn, locale),
          description: getLocalized(s.descriptionRu, s.descriptionEn, locale),
          iconName: s.iconName ?? 'scale',
        }))}
        stagesTitle={t('services.stages', locale)}
      />
    </div>
  );
}
