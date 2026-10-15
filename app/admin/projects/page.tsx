import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ProjectsAdmin } from './projects-admin';

export const dynamic = 'force-dynamic';
export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <ProjectsAdmin />;
}
