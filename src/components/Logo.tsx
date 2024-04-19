'use client';

import { usePathname } from 'next/navigation';
import { LogoSVG } from './LogoSVG';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export const Logo = ({ className }: JSX.IntrinsicElements['div']) => {
  const path = usePathname();
  const isNotAtLoginOrRegisterPage = path !== '/entrar' && path !== '/registrar';

  return (
    <Link
      href='/'
      className={cn(
        'flex items-center gap-4 whitespace-nowrap font-poppins text-2xl text-black ',
        className,
        { 'w-2/3': !isNotAtLoginOrRegisterPage },
        { 'pointer-events-none': !isNotAtLoginOrRegisterPage },
        { 'dark:text-gray-200': isNotAtLoginOrRegisterPage || !isNotAtLoginOrRegisterPage },
      )}
    >
      <LogoSVG className={cn('size-32', { 'size-full': !isNotAtLoginOrRegisterPage })} />
    </Link>
  );
};
