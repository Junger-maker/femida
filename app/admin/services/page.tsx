import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ServicesAdmin } from './services-admin';

export const dynamic = 'force-dynamic';
export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <ServicesAdmin />;
}
