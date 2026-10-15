import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSuperAdmin } from '@/lib/admin-auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      image: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireSuperAdmin();
    if (error) return error;

    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'Пользователь с таким email уже есть' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: name || null,
        role: role === 'admin' ? 'admin' : 'editor',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (e: any) {
    console.error('POST /api/admin/users', e);
    return NextResponse.json({ error: e?.message || 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { error, session } = await requireSuperAdmin();
    if (error) return error;

    const body = await req.json();
    const { id, email, password, name, role } = body;

    if (!id) {
      return NextResponse.json({ error: 'id обязателен' }, { status: 400 });
    }

    const data: any = {};
    if (email !== undefined) data.email = String(email).trim().toLowerCase();
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role === 'admin' ? 'admin' : 'editor';
    if (password) {
      data.password = await bcrypt.hash(String(password), 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (e: any) {
    console.error('PUT /api/admin/users', e);
    return NextResponse.json({ error: e?.message || 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { error, session } = await requireSuperAdmin();
    if (error) return error;

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id обязателен' }, { status: 400 });
    }

    if (id === session?.user?.id) {
      return NextResponse.json({ error: 'Нельзя удалить свою учётку' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('DELETE /api/admin/users', e);
    return NextResponse.json({ error: e?.message || 'Ошибка сервера' }, { status: 500 });
  }
}
