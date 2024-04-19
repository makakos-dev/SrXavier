import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig/firebase';
import { HaircutSchema } from '@/lib/schemas';

export const getHaircut = async (id: number) => {
  try {
    const haircutQuery = query(collection(firestore, 'haircuts'), where('id', '==', id));
    const haircut = HaircutSchema.safeParse((await getDocs(haircutQuery)).docs[0]?.data());
    if (!haircut.success) throw new Error('Ocorreu um error ao buscar pelo corte.');
    return { status: 'success', message: undefined, data: haircut.data } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message, data: undefined } as const;
  }
};
