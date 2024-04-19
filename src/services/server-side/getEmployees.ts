import { and, collection, getDocs, or, query, where } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig/firebase';
import { UserSchema, UsersSchema } from '@/lib/schemas';
import { redirect } from 'next/navigation';

export const getEmployeesWithRedirect = async () => {
  try {
    const employeesQuery = query(
      collection(firestore, 'users'),
      or(where('accountType', '==', 'EMPLOYEE'), where('accountType', '==', 'ADMIN')),
    );

    return UsersSchema.parse((await getDocs(employeesQuery)).docs.map((doc) => doc.data()));
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    redirect('/');
  }
};

export const getEmployeeWithRedirect = async (id: string) => {
  try {
    const employeeQuery = query(
      collection(firestore, 'users'),
      and(
        where('id', '==', id),
        or(where('accountType', '==', 'EMPLOYEE'), where('accountType', '==', 'ADMIN')),
      ),
    );

    return UserSchema.parse((await getDocs(employeeQuery)).docs[0]?.data());
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    redirect('/');
  }
};
