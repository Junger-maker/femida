export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const slides = await prisma.slide.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(slides ?? []);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const data = await req.json();
  const slide = await prisma.slide.create({ data });
  return NextResponse.json(slide);
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id, ...data } = await req.json();
  const slide = await prisma.slide.update({ where: { id }, data });
  return NextResponse.json(slide);
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await req.json();
  await prisma.slide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
