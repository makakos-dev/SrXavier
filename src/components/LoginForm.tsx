'use client';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { type Login, LoginSchema } from '@/lib/schemas';
import { signIn } from '@/services/client-side/signIn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const LoginForm = () => {
  const form = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { push, refresh } = useRouter();

  function onSubmit(formData: Login) {
    signIn({
      formData,
      onSuccess: () => {
        push('/');
        refresh();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <Input {...field} placeholder='Email' type='email' />
              </FormControl>
              <FormMessage className='px-0.5 text-start' />
            </FormItem>
          )}
        />
        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <Input {...field} placeholder='Senha' type='password' />
              </FormControl>
              <FormMessage className='px-0.5 text-start' />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-4 w-full font-medium'>
          Entrar
        </Button>
      </form>
    </Form>
  );
};
