import { collection, getDocs, query, where } from 'firebase/firestore';
import { HaircutSchema, HaircutsSchema } from '@/lib/schemas';
import { firestore } from '@/firebaseConfig/firebase';
import { redirect } from 'next/navigation';

export const getHaircuts = async () => {
  try {
    const docSnap = await getDocs(collection(firestore, 'haircuts'));
    const haircuts = HaircutsSchema.safeParse(docSnap.docs.map((doc) => doc.data()));

    if (!haircuts.success) {
      throw new Error('Algo saiu do planejado. Por favor, recarregue a página e tente novamente.');
    }

    return { status: 'success', message: undefined, data: haircuts.data } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return {
      status: 'error',
      message: error.message,
      data: undefined,
    } as const;
  }
};

export const getHaircutWithRedirect = async (id: number) => {
  try {
    const q = query(collection(firestore, 'haircuts'), where('id', '==', id));
    return HaircutSchema.parse((await getDocs(q)).docs[0]?.data());
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    redirect('/');
  }
};

export const getHaircutsWithRedirect = async () => {
  try {
    const docSnap = await getDocs(collection(firestore, 'haircuts'));
    return HaircutsSchema.parse(docSnap.docs.map((doc) => doc.data()));
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    redirect('/');
  }
};
