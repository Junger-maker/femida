import { getLocale } from '@/lib/locale-cookie';
import { t } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const locale = await getLocale();
  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <Breadcrumbs items={[{ label: t('privacy.title', locale) }]} locale={locale} />
      <h1 className="font-display text-3xl font-bold tracking-tight mb-8">{t('privacy.title', locale)}</h1>
      <div className="prose prose-lg max-w-none text-muted-foreground">
        {locale === 'ru' ? (
          <>
            <h2>Общие положения</h2>
            <p>Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта Юридического агентства «Фемида».</p>
            <h2>Сбор данных</h2>
            <p>Мы собираем только те данные, которые вы добровольно предоставляете через форму обратной связи: имя, адрес электронной почты, телефон, текст сообщения.</p>
            <h2>Использование данных</h2>
            <p>Персональные данные используются исключительно для связи с вами по вашему запросу. Мы не передаём их третьим лицам.</p>
            <h2>Контакты</h2>
            <p>По всем вопросам, связанным с обработкой персональных данных, вы можете связаться с нами по адресу info@femida-law.ru.</p>
          </>
        ) : (
          <>
            <h2>General Provisions</h2>
            <p>This privacy policy defines the procedure for processing and protecting personal data of users of the Femida Law Agency website.</p>
            <h2>Data Collection</h2>
            <p>We only collect data that you voluntarily provide through the contact form: name, email address, phone number, message text.</p>
            <h2>Data Usage</h2>
            <p>Personal data is used solely to communicate with you regarding your request. We do not share it with third parties.</p>
            <h2>Contact</h2>
            <p>For all questions related to personal data processing, you can contact us at info@femida-law.ru.</p>
          </>
        )}
      </div>
    </div>
  );
}
