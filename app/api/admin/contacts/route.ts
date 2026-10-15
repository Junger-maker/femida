export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
export async function GET() {
const { error } = await requireAdmin();
if (error) return error;
const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
return NextResponse.json(submissions ?? []);
}
export async function PUT(req: Request) {
const { error } = await requireAdmin();
if (error) return error;
const { id, status } = await req.json();
const sub = await prisma.contactSubmission.update({ where: { id }, data: { status } });
return NextResponse.json(sub);
}
export async function DELETE(req: Request) {
const { error } = await requireAdmin();
if (error) return error;
const { id } = await req.json();
await prisma.contactSubmission.delete({ where: { id } });
return NextResponse.json({ ok: true });
}