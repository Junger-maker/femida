'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scale, Menu, X, Search } from 'lucide-react';
import { type Locale, t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export function SiteHeader({ locale }: { locale: Locale }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const navItems = [
    { href: '/', label: t('nav.home', locale) },
    { href: '/about', label: t('nav.about', locale) },
    { href: '/projects', label: t('nav.projects', locale) },
    { href: '/services', label: t('nav.services', locale) },
    { href: '/blog', label: t('nav.blog', locale) },
    { href: '/contacts', label: t('nav.contacts', locale) },
  ];

  const switchLocale = async (newLocale: Locale) => {
    await fetch('/api/locale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: newLocale }) });
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery?.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-display font-bold text-xl tracking-tight">
          <Scale className="h-7 w-7" />
          <span>{t('site.shortName', locale)}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-lg hover:bg-accent transition-colors duration-fast">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>

          <div className="flex items-center border rounded-lg overflow-hidden text-xs">
            <button onClick={() => switchLocale('ru')}
              className={`px-2 py-1 transition-colors ${locale === 'ru' ? 'bg-primary text-white' : 'hover:bg-accent'}`}>
              {t('lang.ru', locale)}
            </button>
            <button onClick={() => switchLocale('en')}
              className={`px-2 py-1 transition-colors ${locale === 'en' ? 'bg-primary text-white' : 'hover:bg-accent'}`}>
              {t('lang.en', locale)}
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-accent">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="mx-auto max-w-[600px] flex gap-2">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder', locale)}
              className="flex-1 px-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" autoFocus />
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-lg hover:bg-accent transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
