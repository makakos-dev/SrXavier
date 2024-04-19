import { collection, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../../firebaseConfig/firebase';
import { Haircut } from '@/lib/schemas';

export const uploadHaircutImage = async (file: File): Promise<string> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, file.name);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    throw new Error(`Failed to upload photo: ${error.message}`);
  }
};

export const getLastHaircutIndex = async () => {
  try {
    const haircutsRef = collection(firestore, 'haircuts');
    const haircutsQuery = query(haircutsRef, orderBy('id', 'desc'), limit(1));
    const haircutsSnapshot = await getDocs(haircutsQuery);

    if (haircutsSnapshot.empty) return 0;
    const maxId = haircutsSnapshot.docs[0].data().id;

    return maxId;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    throw new Error(`Failed to get max haircut id: ${error.message}`);
  }
};

export const createHaircut = async (images: File[], haircut: Omit<Haircut, 'id' | 'photoUri'>) => {
  try {
    await addDoc(collection(firestore, 'haircuts'), {
      name: haircut.name,
      price: haircut.price,
      description: haircut.description,
      id: (await getLastHaircutIndex()) + 1,
      photoUri: await Promise.all(images.map((file) => uploadHaircutImage(file))),
    });

    return { status: 'success', message: 'Corte criado com sucesso!' } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message } as const;
  }
};
