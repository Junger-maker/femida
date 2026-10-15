import Link from 'next/link';
import { Scale, Phone, Mail, MapPin } from 'lucide-react';
import { type Locale, t } from '@/lib/i18n';
import { prisma } from '@/lib/db';

export async function SiteFooter({ locale }: { locale: Locale }) {
  let info = await prisma.contactInfo.findFirst();

  const address =
    locale === 'ru'
      ? info?.addressRu || 'г. Москва, ул. Тверская, д. 12, оф. 305'
      : info?.addressEn || 'Moscow, Tverskaya str. 12, office 305';

  const phone = info?.phone || '+7 (495) 123-45-67';
  const email = info?.email || 'info@femida-law.ru';

  return (
    <footer className="bg-[#1E3A8A] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl mb-4">
              <Scale className="h-6 w-6" />
              <span>{t('site.shortName', locale)}</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              {t('home.about.text', locale)}
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">{t('nav.services', locale)}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-white/70 text-sm hover:text-white transition-colors">
                {t('nav.about', locale)}
              </Link>
              <Link href="/projects" className="text-white/70 text-sm hover:text-white transition-colors">
                {t('nav.projects', locale)}
              </Link>
              <Link href="/services" className="text-white/70 text-sm hover:text-white transition-colors">
                {t('nav.services', locale)}
              </Link>
              <Link href="/blog" className="text-white/70 text-sm hover:text-white transition-colors">
                {t('nav.blog', locale)}
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">{t('contacts.title', locale)}</h3>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span suppressHydrationWarning>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span suppressHydrationWarning>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span suppressHydrationWarning>{email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>{t('footer.rights', locale)}</p>
          <Link href="/privacy" className="hover:text-white transition-colors">
            {t('footer.privacy', locale)}
          </Link>
        </div>
      </div>
    </footer>
  );
}