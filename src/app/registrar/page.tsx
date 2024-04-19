import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/RegisterForm';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

import Link from 'next/link';

export default function Page() {
  return (
    <div className='grid min-h-screen grid-cols-2 max-lg:grid-cols-1'>
      <div className='flex h-full items-center justify-center border-r border-zinc-800 bg-zinc-900 py-10 pl-[10%] pr-10 max-lg:hidden'>
        <Logo />
      </div>
      <div className='flex flex-col items-center justify-center px-[10%] py-10 max-lg:px-10'>
        <div className='mb-auto flex w-full justify-between font-medium'>
          <Button variant='secondary' className='px-0 py-0'>
            <Link href='/' className='w-full px-4 py-2'>
              Voltar
            </Link>
          </Button>
          <Button variant='secondary' className='px-0 py-0'>
            <Link href='/entrar' className='w-full px-4 py-2'>
              Entrar
            </Link>
          </Button>
        </div>
        <Card className='mb-auto max-w-[540px] border-none pb-20 text-center shadow-none'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>Crie sua conta</CardTitle>
            <CardDescription>Preencha os campos abaixo para criar sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter>
            <p className='px-8 text-center text-sm text-muted-foreground'>
              Ao clicar em criar conta, você concorda com nossos{' '}
              <Link href='#' className='underline underline-offset-4 hover:text-primary'>
                Termos de Serviços
              </Link>{' '}
              e{' '}
              <Link href='#' className='underline underline-offset-4 hover:text-primary'>
                Política de Privacidade
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
