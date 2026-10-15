import { getLocale } from '@/lib/locale-cookie';
import { t } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SectionHeading } from '@/components/section-heading';
import { ContactsClient } from './contacts-client';
import { prisma } from '@/lib/db';


export default async function ContactsPage() {
  const locale = await getLocale();

  const info = await prisma.contactInfo.findFirst();

  const address =
    locale === 'ru'
      ? info?.addressRu || 'г. Москва, ул. Тверская, д. 12, оф. 305'
      : info?.addressEn || 'Moscow, Tverskaya str. 12, office 305';

  const phone = info?.phone || '+7 (495) 123-45-67';
  const email = info?.email || 'info@femida-law.ru';
  const workHours =
    locale === 'ru'
      ? info?.workHoursRu || 'Пн-Пт: 9:00 — 18:00'
      : info?.workHoursEn || 'Mon-Fri: 9:00 AM — 6:00 PM';

  const mapLat = info?.mapLat ?? 55.765;
  const mapLng = info?.mapLng ?? 37.6;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Юридическое агентство «Фемида»',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Москва',
      addressCountry: 'RU',
    },
    telephone: phone,
    email: email,
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ label: t('contacts.title', locale) }]} locale={locale} />
      <SectionHeading title={t('contacts.title', locale)} />
      <ContactsClient
        locale={locale}
        contactInfo={{
          address,
          phone,
          email,
          workHours,
          mapLat,
          mapLng,
        }}
        translations={{
          name: t('contacts.form.name', locale),
          email: t('contacts.form.email', locale),
          phone: t('contacts.form.phone', locale),
          subject: t('contacts.form.subject', locale),
          message: t('contacts.form.message', locale),
          send: t('contacts.form.send', locale),
          success: t('contacts.form.success', locale),
          error: t('contacts.form.error', locale),
          addressLabel: t('contacts.address', locale),
          phoneLabel: t('contacts.phone', locale),
          emailLabel: t('contacts.email', locale),
          workHours: t('contacts.workHours', locale),
        }}
      />
    </div>
  );
}
export const dynamic = 'force-dynamic';
