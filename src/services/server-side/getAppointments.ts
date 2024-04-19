import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig/firebase';
import { AppointmentsSchema } from '@/lib/schemas';
import { redirect } from 'next/navigation';

export const getAppoimentsWithRedirect = async () => {
  try {
    const docSnap = await getDocs(collection(firestore, 'appointments'));
    return AppointmentsSchema.parse(docSnap.docs.map((data) => data.data()));
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    redirect('/');
  }
};
