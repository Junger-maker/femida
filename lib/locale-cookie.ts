import { cookies } from 'next/headers';
import { type Locale, defaultLocale, locales } from './i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('locale')?.value;
  if (raw && locales.includes(raw as Locale)) return raw as Locale;
  return defaultLocale;
}
