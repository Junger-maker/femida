import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Регистрация отключена. Обратитесь к администратору.' },
    { status: 403 }
  );
}
