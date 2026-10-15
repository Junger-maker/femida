import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

async function getOrCreate() {
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
  return info;
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const info = await getOrCreate();
  return NextResponse.json(info);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const info = await getOrCreate();

  const updated = await prisma.contactInfo.update({
    where: { id: info.id },
    data: {
      addressRu: body.addressRu ?? info.addressRu,
      addressEn: body.addressEn ?? info.addressEn,
      phone: body.phone ?? info.phone,
      email: body.email ?? info.email,
      workHoursRu: body.workHoursRu ?? info.workHoursRu,
      workHoursEn: body.workHoursEn ?? info.workHoursEn,
      mapLat: body.mapLat !== undefined ? Number(body.mapLat) : info.mapLat,
      mapLng: body.mapLng !== undefined ? Number(body.mapLng) : info.mapLng,
    },
  });

  return NextResponse.json(updated);
}