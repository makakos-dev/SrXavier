import { collection, getDocs, query, where } from 'firebase/firestore';
import { initApp } from '@/firebaseConfig/firebase-admin-config';
import { firestore } from '@/firebaseConfig/firebase';
import { UserSchema } from '@/lib/schemas';
import { redirect } from 'next/navigation';

initApp();

export const getUserById = async (id: string) => {
  try {
    const userQuery = await getDocs(query(collection(firestore, 'users'), where('id', '==', id)));
    return { data: UserSchema.parse(userQuery.docs[0].data()), status: 200 } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { data: undefined, status: 500 } as const;
  }
};

export const getUserByIdWithRedirect = async (id: string) => {
  try {
    const userQuery = await getDocs(query(collection(firestore, 'users'), where('id', '==', id)));
    return UserSchema.parse(userQuery.docs[0].data());
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    redirect('/');
  }
};
