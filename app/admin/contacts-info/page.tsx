import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ContactsInfoAdmin } from './contacts-info-admin';

export const dynamic = 'force-dynamic';

export default async function ContactsInfoPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <ContactsInfoAdmin />;
}