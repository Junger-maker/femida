'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Scale,
  LayoutDashboard,
  Image,
  Users,
  Briefcase,
  FileText,
  Newspaper,
  MessageSquare,
  LogOut,
  Menu,
  MapPin,
  UserCog,
} from 'lucide-react';
import { useState } from 'react';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/slides', label: 'Слайды', icon: Image },
  { href: '/admin/team', label: 'Команда', icon: Users },
  { href: '/admin/projects', label: 'Проекты', icon: Briefcase },
  { href: '/admin/services', label: 'Услуги', icon: FileText },
  { href: '/admin/articles', label: 'Статьи', icon: Newspaper },
  { href: '/admin/contacts', label: 'Заявки', icon: MessageSquare },
  { href: '/admin/contacts-info', label: 'Контакты', icon: MapPin },
  { href: '/admin/users', label: 'Учётки', icon: UserCog, adminOnly: true },
];

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminUser;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg">Фемида CMS</span>
        </div>

        <nav className="p-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-sm mb-2">
            <p className="font-medium truncate">{user?.name || 'Админ'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAdmin ? 'Администратор' : 'Сотрудник'}
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectTo: '/admin/login' })}
            className="flex items-center gap-2 text-sm text-destructive hover:underline"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur border-b flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <Link href="/" target="_blank" className="text-sm text-primary hover:underline">
            Просмотр сайта →
          </Link>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
