export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import bcrypt from 'bcryptjs';

const TEAM_FIELDS = [
  'nameRu',
  'nameEn',
  'positionRu',
  'positionEn',
  'bioRu',
  'bioEn',
  'imageUrl',
  'cloudStoragePath',
  'isPublic',
  'sortOrder',
  'published',
] as const;

function pickTeamData(raw: Record<string, any>) {
  const data: Record<string, any> = {};
  for (const key of TEAM_FIELDS) {
    if (raw[key] !== undefined) data[key] = raw[key];
  }
  return data;
}

async function upsertUserFromTeam(raw: Record<string, any>) {
  const email = raw.loginEmail?.trim()?.toLowerCase();
  const password = raw.loginPassword;
  if (!email) return null;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const data: any = {
      name: raw.nameRu || existing.name,
    };
    if (password) {
      data.password = await bcrypt.hash(String(password), 10);
    }
    return prisma.user.update({ where: { id: existing.id }, data });
  }

  if (!password) {
    throw new Error('Для новой учётки укажите пароль');
  }

  return prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(String(password), 10),
      name: raw.nameRu || null,
      role: 'editor',
    },
  });
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const members = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(members ?? []);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const raw = await req.json();
    await upsertUserFromTeam(raw);
    const data = pickTeamData(raw);
    const member = await prisma.teamMember.create({ data });
    return NextResponse.json(member);
  } catch (e: any) {
    console.error('POST /api/admin/team', e);
    return NextResponse.json({ error: e?.message || 'Ошибка' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const raw = await req.json();
    const { id } = raw;
    if (!id) {
      return NextResponse.json({ error: 'id обязателен' }, { status: 400 });
    }
    await upsertUserFromTeam(raw);
    const data = pickTeamData(raw);
    const member = await prisma.teamMember.update({ where: { id }, data });
    return NextResponse.json(member);
  } catch (e: any) {
    console.error('PUT /api/admin/team', e);
    return NextResponse.json({ error: e?.message || 'Ошибка' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await req.json();
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
