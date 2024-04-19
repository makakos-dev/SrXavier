import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { auth, firestore } from '../../firebaseConfig/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Register } from '@/lib/schemas';

export const createFirebaseUserAccount = async (email: string, password: string) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return { status: 'success', message: 'Usuário criado com sucesso!', data: user } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message, data: undefined } as const;
  }
};

export const createUserAccount = async (registerData: Register, userCredentials: UserCredential) => {
  //temos que criptografar o cpf, telefone e email do cara no banco de dados, pq se alguem roubar o banco de dados, ele vai ter acesso a esses dados

  try {
    await setDoc(doc(firestore, 'users', userCredentials.user.uid), {
      accountType: 'USER',
      cpf: registerData.cpf,
      name: registerData.name,
      email: registerData.email,
      id: userCredentials.user.uid,
      cellphone: registerData.phone,
      createdAt: String(new Date()),
    });

    return { status: 'success', message: 'Conta criada com sucesso!' } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message } as const;
  }
};
