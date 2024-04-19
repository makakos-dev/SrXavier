import { getUserById } from '@/services/server-side/getUserById';
import type { AccountType } from '@/lib/schemas';
import { cookies } from 'next/headers';
import { auth } from 'firebase-admin';

export type Session = { id: string; name: string; accountType: AccountType } | null;

export const getSession = async () => {
  const session = cookies().get('session');
  if (!session) return null;

  const decodedToken = await auth().verifySessionCookie(session.value, true);
  if (!decodedToken) return null;

  const { data, status } = await getUserById(decodedToken.uid);
  if (status !== 200) return null;

  return { id: data.id, name: data.name, accountType: data.accountType };
};
