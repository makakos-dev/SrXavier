'use client';

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { SignOutButton } from './SignOutButton';
import { Button } from '@/components/ui/button';
import { Session } from '@/helpers/getSession';
import { usePathname } from 'next/navigation';
import { LogoSVG } from './LogoSVG';
import { Menu } from 'lucide-react';
import { useStore } from '@/store';
import { Fragment } from 'react';

import Link from 'next/link';

export const SideMenu = ({ session }: { session: Session }) => {
  const { setIsCreateHaircutActive, setIsUpdateHaircutActive } = useStore();
  const path = usePathname();

  const isAtSchedulesList = path === '/horarios';
  const isAtSchedules = path === '/agendamentos';
  const isAtDashboard = path === '/dashboard';
  const isAtHome = path === '/';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className='flex size-9 items-center justify-center p-0'>
          <Menu className='h-full w-full' />
        </Button>
      </SheetTrigger>
      <SheetContent className='mt-auto flex flex-col'>
        <SheetHeader>
          <LogoSVG className='mx-auto size-48' />
        </SheetHeader>
        <div className='mt-auto grid py-6'>
          {!isAtHome && (
            <Button variant='outline' className='mb-4 py-6'>
              <Link className='absolute flex h-full w-full items-center justify-center' href='/'>
                Início
              </Link>
            </Button>
          )}
          {!isAtSchedulesList && (
            <Button variant='outline' className='mb-4 py-6'>
              <Link className='absolute flex h-full w-full items-center justify-center' href='/horarios'>
                Horários
              </Link>
            </Button>
          )}
          {session && (
            <div className='flex flex-col justify-center gap-4'>
              {isAtDashboard && (
                <Fragment>
                  <Button
                    onClick={() => setIsCreateHaircutActive(true)}
                    className='relative py-6'
                    variant='outline'
                  >
                    Criar Corte
                  </Button>
                  <Button
                    onClick={() => setIsUpdateHaircutActive(true)}
                    className='relative py-6'
                    variant='outline'
                  >
                    Editar Corte
                  </Button>
                </Fragment>
              )}
              {!isAtDashboard && session.accountType === 'ADMIN' && (
                <Button variant='outline' className='relative py-6'>
                  <Link className='absolute flex h-full w-full items-center justify-center' href='/dashboard'>
                    Dashboard
                  </Link>
                </Button>
              )}
              {!isAtSchedules && (
                <Button variant='outline' className='relative py-6'>
                  <Link
                    className='absolute flex h-full w-full items-center justify-center'
                    href='/agendamentos'
                  >
                    Agendamentos
                  </Link>
                </Button>
              )}
              <SignOutButton className='py-6' />
            </div>
          )}
          {!session && (
            <div className='flex flex-col justify-center gap-4'>
              <Button variant='outline' className='relative py-6'>
                <Link className='absolute flex h-full w-full items-center justify-center' href='/entrar'>
                  Entrar
                </Link>
              </Button>
              <Button className='relative py-6'>
                <Link className='absolute flex h-full w-full items-center justify-center' href='/registrar'>
                  Criar conta
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
