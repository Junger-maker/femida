import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SectionHeading } from '@/components/section-heading';
import { AboutClient } from './about-client';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const locale = await getLocale();
  const team = await prisma.teamMember.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('about.title', locale) }]} locale={locale} />
      <SectionHeading title={t('about.title', locale)} />

      <div className="prose prose-lg max-w-none mb-16">
        <p className="text-muted-foreground leading-relaxed">
          {locale === 'ru'
            ? 'Юридическое агентство \u00abФемида\u00bb было основано в 2010 году группой опытных юристов, объединённых идеей справедливости и профессионализма. За годы работы мы успешно завершили более 500 дел и помогли сотням клиентов защитить свои права и интересы.'
            : 'Femida Law Agency was founded in 2010 by a group of experienced lawyers united by the idea of justice and professionalism. Over the years, we have successfully completed over 500 cases and helped hundreds of clients protect their rights and interests.'}
        </p>
      </div>

      <SectionHeading title={t('about.team', locale)} />
      <AboutClient
        locale={locale}
        team={(team ?? []).map((m: any) => ({
          id: m.id,
          name: getLocalized(m.nameRu, m.nameEn, locale),
          position: getLocalized(m.positionRu, m.positionEn, locale),
          bio: getLocalized(m.bioRu, m.bioEn, locale),
          imageUrl: m.imageUrl ?? '',
        }))}
      />
    </div>
  );
}
