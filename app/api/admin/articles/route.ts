export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(articles ?? []);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const data = await req.json();
  const article = await prisma.article.create({ data });
  return NextResponse.json(article);
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id, ...data } = await req.json();
  const article = await prisma.article.update({ where: { id }, data });
  return NextResponse.json(article);
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await req.json();
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
