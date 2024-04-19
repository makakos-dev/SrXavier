import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { CreateHaircutForm, CreateHaircutSchema } from '@/lib/schemas';
import { createHaircut } from '@/services/client-side/createHaircut';
import { usePromiseToast } from '@/hooks/usePromiseToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatFloatNumber } from '@/utils/input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Fragment, useRef } from 'react';
import { useStore } from '@/store';
import { Label } from './ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const CreateHaircut = () => {
  const form = useForm<CreateHaircutForm>({ resolver: zodResolver(CreateHaircutSchema) });
  const { isCreateHaircutActive, setIsCreateHaircutActive } = useStore();
  const priceInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPromiseToast } = usePromiseToast();

  const handleCreateHaircut = (formData: CreateHaircutForm) => {
    const { name, price, images, description } = formData;

    const createHaircutPromise = createHaircut(images, { name, price, description });
    createPromiseToast('Criando o corte.', createHaircutPromise, () => {
      setIsCreateHaircutActive(false);
      form.reset({ name: '', description: '', images: [] });
      if (fileInputRef?.current?.value) fileInputRef.current.value = '';
      if (priceInputRef?.current?.value) priceInputRef.current.value = '';
    });
  };

  return (
    <Dialog open={isCreateHaircutActive} onOpenChange={setIsCreateHaircutActive}>
      <DialogContent className='max-[550px]:max-w-[90%] sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Criar Novo Corte</DialogTitle>
          <DialogDescription>
            Insira o nome, uma breve descrição e o preço do novo corte de cabelo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='createHaircut'
            onSubmit={form.handleSubmit(handleCreateHaircut)}
            className='mb-3 mt-6 flex flex-col gap-3'
          >
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <FormControl>
                    <Fragment>
                      <Label className='px-0.5' htmlFor='name'>
                        Nome:
                      </Label>
                      <Input {...field} id='name' />
                    </Fragment>
                  </FormControl>
                  <FormMessage className='px-0.5 text-start' />
                </FormItem>
              )}
            />
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <FormControl>
                    <Fragment>
                      <Label htmlFor='description' className='px-0.5'>
                        Descrição:
                      </Label>
                      <Input {...field} id='description' />
                    </Fragment>
                  </FormControl>
                  <FormMessage className='px-0.5 text-start' />
                </FormItem>
              )}
            />
            <FormField
              name='price'
              control={form.control}
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <FormControl>
                    <Fragment>
                      <Label htmlFor='price' className='px-0.5'>
                        Preço:
                      </Label>
                      <Input
                        {...field}
                        id='price'
                        inputMode='numeric'
                        ref={priceInputRef}
                        onChange={(event) => field.onChange(formatFloatNumber(event.target.value))}
                      />
                    </Fragment>
                  </FormControl>
                  <FormMessage className='px-0.5 text-start' />
                </FormItem>
              )}
            />
            <FormField
              name='images'
              control={form.control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className='space-y-1.5'>
                  <FormControl>
                    <Fragment>
                      <Label htmlFor='images' className='px-0.5'>
                        Fotos:
                      </Label>
                      <Input
                        {...fieldProps}
                        multiple
                        ref={fileInputRef}
                        id='images'
                        type='file'
                        accept='image/*'
                        onChange={(event) => onChange(Array.from(event.target.files ?? []))}
                      />
                    </Fragment>
                  </FormControl>
                  <FormMessage className='px-0.5 text-start' />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='createHaircut'>
            Criar Corte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
