import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from './admin-shell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const pathname = '/admin'; // layout doesn't need exact path for auth check

  // Don't redirect on login page
  if (!session?.user) {
    return <>{children}</>;
  }

  return <AdminShell user={{ name: session.user.name ?? '', email: session.user.email ?? '', role: (session.user as any).role ?? 'editor' }}>{children}</AdminShell>;
}
