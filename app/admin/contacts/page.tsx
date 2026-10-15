import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ContactsAdmin } from './contacts-admin';
export const dynamic = 'force-dynamic';
export default async function ContactsPage() {
const session = await auth();
if (!session?.user) redirect('/admin/login');
return <ContactsAdmin />;
}