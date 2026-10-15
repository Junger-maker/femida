import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SlidesAdmin } from './slides-admin';

export const dynamic = 'force-dynamic';

export default async function SlidesPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <SlidesAdmin />;
}
