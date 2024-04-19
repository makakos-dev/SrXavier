import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { CreateHaircutForm, CreateHaircutSchema, Haircut } from '@/lib/schemas';
import { updateHaircut } from '@/services/client-side/updateHaircut';
import { deleteHaircut } from '@/services/client-side/deleteHaircut';
import { usePromiseToast } from '@/hooks/usePromiseToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useRef, useState } from 'react';
import { formatFloatNumber } from '@/utils/input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Scissors } from 'lucide-react';
import { useStore } from '@/store';
import { Label } from './ui/label';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const UpdateHaircut = ({ haircuts }: { haircuts: Haircut[] }) => {
  const form = useForm<CreateHaircutForm>({ resolver: zodResolver(CreateHaircutSchema) });
  const [activeHaircut, setActiveHaircut] = useState<Haircut | undefined>(undefined);
  const [isDeleteHaircutActive, setIsDeleteHaircutActive] = useState(false);
  const { isUpdateHaircutActive, setIsUpdateHaircutActive } = useStore();
  const priceInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPromiseToast } = usePromiseToast();

  const handleUpdateUI = () => {
    setActiveHaircut(undefined);
    form.reset({ name: '', description: '', images: [] });
    if (fileInputRef?.current?.value) fileInputRef.current.value = '';
    if (priceInputRef?.current?.value) priceInputRef.current.value = '';
  };

  const handleShowDeleteHaircut = () => {
    if (!activeHaircut) return toast.error('Selecione um corte para deletar!');
    setIsDeleteHaircutActive(true);
  };

  const handleUpdateHaircut = (formData: CreateHaircutForm) => {
    const { name, price, images, description } = formData;
    if (!activeHaircut) return toast.error('Selecione um corte para editar!');

    const updateHaircutPromise = updateHaircut(images, {
      name,
      price,
      description,
      id: activeHaircut.id,
    });

    createPromiseToast('Atualizando o corte.', updateHaircutPromise, () => {
      handleUpdateUI();
      setIsUpdateHaircutActive(false);
    });
  };

  const handleDeleteHaircut = (haircutId?: number) => {
    if (!haircutId) return;

    const deleteHaircutPromise = deleteHaircut(haircutId);
    createPromiseToast('Deletando o corte.', deleteHaircutPromise, () => {
      handleUpdateUI();
      setIsDeleteHaircutActive(false);
    });
  };

  return (
    <Dialog open={isUpdateHaircutActive} onOpenChange={setIsUpdateHaircutActive}>
      <DialogContent className='max-[550px]:max-w-[90%] sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar Corte</DialogTitle>
          <DialogDescription>Ajuste o nome, descrição, preço e fotos do corte de cabelo.</DialogDescription>
        </DialogHeader>
        <div className='space-y-1.5'>
          <Label htmlFor='haircut' className='px-0.5'>
            Selecione um corte para revisão e ajuste.
          </Label>
          <Select
            onValueChange={(haircutId) => {
              const haircut = haircuts.find(({ id }) => String(id) === haircutId);

              if (!haircut) return;
              setActiveHaircut(haircut);
              form.setValue('name', haircut.name);
              form.setValue('price', haircut.price);
              form.setValue('description', haircut.description);
            }}
          >
            <SelectTrigger id='haircut'>
              <SelectValue placeholder={activeHaircut?.name} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {haircuts.map(({ id, name }) => {
                  return (
                    <SelectItem key={id} value={String(id)}>
                      <div className='flex gap-2'>
                        <Scissors className='size-5' />
                        {name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Form {...form}>
          <form
            id='updateHaircut'
            onSubmit={form.handleSubmit(handleUpdateHaircut)}
            className='mb-3 flex flex-col gap-3'
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
                        multiple
                        id='images'
                        type='file'
                        {...fieldProps}
                        accept='image/*'
                        ref={fileInputRef}
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
        <DialogFooter className='flex gap-1.5'>
          <AlertDialog open={isDeleteHaircutActive}>
            <AlertDialogTrigger onClick={handleShowDeleteHaircut}>
              <Button variant='destructive' className='w-full'>
                Deletar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Está realmente certo disso?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação é irreversível. Ela removerá permanentemente o corte de cabelo do site, junto com
                  todas as suas informações associadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteHaircutActive(false)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteHaircut(activeHaircut?.id)}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button type='submit' form='updateHaircut'>
            Atualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
