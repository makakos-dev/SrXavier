import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig/firebase';

export const deleteHaircut = async (haircutId: number) => {
  try {
    const haircutRef = (await getDocs(query(collection(firestore, 'haircuts'), where('id', '==', haircutId))))
      .docs[0].ref;

    await deleteDoc(haircutRef);
    return { status: 'success', message: 'Corte deletado com sucesso!' } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message } as const;
  }
};
