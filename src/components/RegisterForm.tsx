'use client';

import { createFirebaseUserAccount, createUserAccount } from '@/services/client-side/createUserAccount';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { type Register, RegisterSchema } from '@/lib/schemas';
import { formatCPF, formatPhoneNumber } from '@/utils/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const RegisterForm = () => {
  const form = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { cpf: '', name: '', phone: '', email: '', password: '', confirmPassword: '' },
  });

  const { push } = useRouter();

  async function onSubmit(formData: Register) {
    const user = await createFirebaseUserAccount(formData.email, formData.password);
    if (user.status === 'error') return toast.error(user.message);

    const { status, message } = await createUserAccount(formData, user.data);
    if (status === 'error') return toast.error(message);

    toast.success(message);
    push('/entrar');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <Input {...field} placeholder='Nome' />
              </FormControl>
              <FormMessage className='px-0.5 text-start' />
            </FormItem>
          )}
        />
        <FormField
          name='cpf'
          control={form.control}
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <Input
                  {...field}
                  maxLength={14}
                  placeholder='CPF'
                  inputMode='numeric'
                  onChange={(event) => field.onChange(formatCPF(event.target.value))}
                />
              </FormControl>
              <FormMessage className='px-0.5 text-start' />
            </FormItem>
          )}
        />
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
          name='phone'
          control={form.control}
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <Input
                  {...field}
                  maxLength={15}
                  inputMode='numeric'
                  placeholder='Telefone'
                  onChange={(event) => field.onChange(formatPhoneNumber(event.target.value))}
                />
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
        <FormField
          name='confirmPassword'
          control={form.control}
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <Input {...field} placeholder='Confirmar Senha' type='password' />
              </FormControl>
              <FormMessage className='px-0.5 text-start' />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-4 w-full font-medium'>
          Criar Conta
        </Button>
      </form>
    </Form>
  );
};
