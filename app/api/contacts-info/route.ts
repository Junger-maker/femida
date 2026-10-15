import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  let info = await prisma.contactInfo.findFirst();
  if (!info) {
    info = await prisma.contactInfo.create({
      data: {
        addressRu: 'г. Москва, ул. Тверская, д. 12, оф. 305',
        addressEn: 'Moscow, Tverskaya str. 12, office 305',
        phone: '+7 (495) 123-45-67',
        email: 'info@femida-law.ru',
        workHoursRu: 'Пн-Пт: 9:00 — 18:00',
        workHoursEn: 'Mon-Fri: 9:00 AM — 6:00 PM',
        mapLat: 55.765,
        mapLng: 37.6,
      },
    });
  }
  return NextResponse.json(info);
}