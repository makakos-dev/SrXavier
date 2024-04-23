import { signOut } from '@/services/client-side/signOut';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export const SignOutButton = ({ className }: JSX.IntrinsicElements['div']) => {
  const { refresh } = useRouter();

  return (
    <Button onClick={() => signOut(() => refresh())} className={className}>
      Sair
    </Button>
  );
};
