export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(services ?? []);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const data = await req.json();
  const service = await prisma.service.create({ data });
  return NextResponse.json(service);
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id, ...data } = await req.json();
  const service = await prisma.service.update({ where: { id }, data });
  return NextResponse.json(service);
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await req.json();
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
