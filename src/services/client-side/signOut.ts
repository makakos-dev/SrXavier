import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig/firebase';
import { toast } from 'sonner';

export const signOut = async (onSuccess: () => void) => {
  try {
    await firebaseSignOut(auth);
    const response = await fetch('/api/signOut', { method: 'POST' });
    if (response.status != 200) throw new Error('Ocorreu um erro durante o encerramento da sessão.');

    onSuccess();
    toast.error('Sessão encerrada.');
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return toast.error(error.message);
  }
};
