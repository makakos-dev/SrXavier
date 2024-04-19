import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig/firebase';
import { uploadHaircutImage } from './createHaircut';
import { Haircut } from '@/lib/schemas';

export const updateHaircut = async (images: File[], haircut: Omit<Haircut, 'photoUri'>) => {
  try {
    const haircutRef = (
      await getDocs(query(collection(firestore, 'haircuts'), where('id', '==', haircut.id)))
    ).docs[0].ref;

    await updateDoc(haircutRef, {
      id: haircut.id,
      name: haircut.name,
      price: haircut.price,
      description: haircut.description,
      photoUri: await Promise.all(images.map((file) => uploadHaircutImage(file))),
    });

    return { status: 'success', message: 'Corte atualizado com sucesso!' } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message } as const;
  }
};
