import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig/firebase';
import { AppointmentSchema } from '@/lib/schemas';

export const getAppoimentWithCallback = async (id: string, callback: () => void) => {
  try {
    const q = query(collection(firestore, 'appointments'), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    return AppointmentSchema.parse(querySnapshot.docs[0].data());
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    callback();
  }
};
