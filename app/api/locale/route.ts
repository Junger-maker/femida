export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { locales, type Locale } from '@/lib/i18n';

export async function POST(req: Request) {
  try {
    const { locale } = await req.json();
    if (!locales.includes(locale as Locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set('locale', locale, { path: '/', maxAge: 365 * 24 * 60 * 60, sameSite: 'lax' });
    return response;
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
