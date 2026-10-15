import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Image, Users, Briefcase, Newspaper, MessageSquare, FileText } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  const [slides, team, projects, services, articles, contacts] = await Promise.all([
    prisma.slide.count(),
    prisma.teamMember.count(),
    prisma.project.count(),
    prisma.service.count(),
    prisma.article.count(),
    prisma.contactSubmission.count({ where: { status: 'new' } }),
  ]);

  const stats = [
    { label: 'Слайды', count: slides, icon: Image, href: '/admin/slides', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Команда', count: team, icon: Users, href: '/admin/team', color: 'bg-green-500/10 text-green-600' },
    { label: 'Проекты', count: projects, icon: Briefcase, href: '/admin/projects', color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Услуги', count: services, icon: FileText, href: '/admin/services', color: 'bg-orange-500/10 text-orange-600' },
    { label: 'Статьи', count: articles, icon: Newspaper, href: '/admin/articles', color: 'bg-teal-500/10 text-teal-600' },
    { label: 'Новые заявки', count: contacts, icon: MessageSquare, href: '/admin/contacts', color: 'bg-red-500/10 text-red-600' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
