import { prisma } from '@/lib/db';
import { getLocale } from '@/lib/locale-cookie';
import { t, getLocalized } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Scale, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || !project.published) return notFound();

  const title = getLocalized(project.titleRu, project.titleEn, locale);
  const description = getLocalized(project.descriptionRu, project.descriptionEn, locale);
  const content = getLocalized(project.contentRu, project.contentEn, locale);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('projects.title', locale), href: '/projects' }, { label: title }]} locale={locale} />
      {project.imageUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-8">
          <Image src={project.imageUrl} alt={title} fill className="object-cover" priority />
        </div>
      ) : (
        <div className="aspect-video rounded-xl bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center mb-8">
          <Scale className="h-20 w-20 text-primary/20" />
        </div>
      )}
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
        <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground">{project.category}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {project.year}</span>
      </div>
      {description && <p className="text-lg text-muted-foreground mb-8">{description}</p>}
      {content && <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  );
}
