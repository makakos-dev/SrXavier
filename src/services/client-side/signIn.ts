import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig/firebase';
import { Login } from '@/lib/schemas';
import { toast } from 'sonner';

export const signIn = async ({ formData, onSuccess }: { formData: Login; onSuccess: () => void }) => {
  try {
    const session = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    const response = await fetch('/api/signIn', {
      method: 'POST',
      headers: { Authorization: `Bearer ${await session.user.getIdToken()}` },
    });

    if (response.status != 200) return toast.error('Ocorreu um erro durante o login.');
    toast.success(`Logado como ${session.user.providerData[0].email}`);

    onSuccess();
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return toast.error('Credenciais incorretas.');
  }
};
