import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { User } from './lib/schemas';

export async function middleware(request: NextRequest) {
  const session = cookies().get('session');

  if (['/entrar', '/registrar'].some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (session) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (!session) return NextResponse.redirect(new URL('/entrar', request.url));

  const userAuthentication = await fetch(`${request.nextUrl.origin}/api/auth`, {
    headers: { Cookie: `session=${session.value}` },
  });

  if (userAuthentication.status !== 200) return NextResponse.redirect(new URL('/entrar', request.url));

  if (['/dashboard', '/transacoes'].some((pathname) => pathname.startsWith(request.nextUrl.pathname))) {
    const user: User = await userAuthentication.json();

    const isNotAuthorizedUser = user.accountType !== 'ADMIN';
    if (isNotAuthorizedUser) return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/entrar', '/registrar', '/dashboard', '/agendamentos', '/transacoes'],
};
