import { verifyReCaptcha } from '@/services/server-side/verifyRecaptcha';
import { type NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/lib/env/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const token = z.string().safeParse(await request.json());
    if (!token.success) throw new Error('Malformed token.');
    await verifyReCaptcha(token.data, serverEnv.RECAPTCHA_SECRET_KEY);
    return NextResponse.json('Validação concluída com sucesso.', { status: 200 });
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return NextResponse.json(error.message, { status: 400 });
  }
}
