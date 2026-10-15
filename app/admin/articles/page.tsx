import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ArticlesAdmin } from './articles-admin';

export const dynamic = 'force-dynamic';
export default async function ArticlesPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <ArticlesAdmin />;
}
