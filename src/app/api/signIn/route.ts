import { initApp } from '@/firebaseConfig/firebase-admin-config';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from 'firebase-admin';

initApp();

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return NextResponse.json('malformed token', { status: 400 });

  const [_, token] = authorization.split('Bearer ');
  const decodedToken = await auth().verifyIdToken(token);
  if (!decodedToken) return NextResponse.json('invalid token', { status: 401 });

  const oneDay = 24 * 60 * 60 * 1000;
  const sessionCookie = await auth().createSessionCookie(token, { expiresIn: oneDay });

  cookies().set({
    secure: true,
    httpOnly: true,
    sameSite: true,
    name: 'session',
    value: sessionCookie,
    expires: Date.now() + oneDay,
  });

  return NextResponse.json({}, { status: 200 });
}
