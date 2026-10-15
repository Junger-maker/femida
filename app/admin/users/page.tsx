import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UsersAdmin } from './users-admin';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  if ((session.user as any).role !== 'admin') redirect('/admin');
  return <UsersAdmin />;
}
