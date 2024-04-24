import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { formatCPF, formatFloatNumber, formatIntNumber } from '@/utils/input';
import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { QrCode, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Label } from './ui/label';
import { toast } from 'sonner';

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

import {
  Banks,
  banks,
  CreateTransactionForm,
  CreateTransactionSchema,
  TransactionMethod,
  transactionMethods,
} from '@/lib/schemas';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type CreateTransaction = {
  isTransactionActive: boolean;
  setIsTransactionActive: Dispatch<SetStateAction<boolean>>;
};

export const CreateTransaction = ({ isTransactionActive, setIsTransactionActive }: CreateTransaction) => {
  const form = useForm<CreateTransactionForm>({ resolver: zodResolver(CreateTransactionSchema) });
  const [activeTransactionMethod, setActiveTransactionMethod] = useState<TransactionMethod>();
  const [isConfirmTransactionActive, setIsConfirmTransactionActive] = useState(false);
  const valueRef = useRef<HTMLInputElement>(null);
  const bankRef = useRef<HTMLSelectElement>(null);

  const handleResetFields = (method?: TransactionMethod) => {
    setActiveTransactionMethod(undefined);
    if (bankRef?.current?.value) bankRef.current.value = '';
    if (valueRef?.current?.value) valueRef.current.value = '';
    form.reset({ cpf: '', pix: '', agency: '', account: '', accountName: '', method });
  };

  const handleCreateTransaction = (formData: CreateTransactionForm) => {
    console.log(formData);
  };

  const handleConfirmTransaction = async () => {
    await form.trigger();
    const formErrors = Object.keys(form.formState.errors).length;
    if (formErrors) return toast.error('Preencha todos os campos corretamente!');
    setIsConfirmTransactionActive(true);
  };

  const transactionMethodsIcons = {
    PIX: <QrCode className='size-5' />,
    TED: <ReceiptText className='size-5' />,
  };

  const transactionMethodsPlaceholders = {
    PIX: 'Pix',
    TED: 'Transferência Bancária',
  };

  const transactionMethodPlaceholder = activeTransactionMethod
    ? transactionMethodsPlaceholders[activeTransactionMethod]
    : undefined;

  return (
    <Dialog
      open={isTransactionActive}
      onOpenChange={(state) => {
        handleResetFields();
        setIsTransactionActive(state);
      }}
    >
      <DialogContent className='max-[550px]:max-w-[90%] sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Realizar Transferência</DialogTitle>
          <DialogDescription>Preencha as informações para iniciar a transferência.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='create-transaction'
            onSubmit={form.handleSubmit(handleCreateTransaction)}
            className='mb-3 flex flex-col gap-3'
          >
            <FormField
              name='method'
              control={form.control}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem className='space-y-1.5'>
                  <FormControl>
                    <Fragment>
                      <Label htmlFor='method' className='px-0.5'>
                        Método de transferência:
                      </Label>
                      <Select
                        onValueChange={(transactionMethod: TransactionMethod) => {
                          onChange(transactionMethod);
                          handleResetFields(transactionMethod);
                          setActiveTransactionMethod(transactionMethod);
                        }}
                      >
                        <SelectTrigger id='method'>
                          <SelectValue {...fieldProps} placeholder={transactionMethodPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {transactionMethods.map((transactionMethod) => {
                              return (
                                <SelectItem key={transactionMethod} value={transactionMethod}>
                                  <div className='flex gap-2'>
                                    {transactionMethodsIcons[transactionMethod]}
                                    {transactionMethodsPlaceholders[transactionMethod]}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Fragment>
                  </FormControl>
                  <FormMessage className='px-0.5 text-start' />
                </FormItem>
              )}
            />
            <div className='space-y-1.5'></div>
            {activeTransactionMethod === 'PIX' && (
              <FormField
                name='pix'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='space-y-1.5'>
                    <FormControl>
                      <Fragment>
                        <Label className='px-0.5' htmlFor='pix'>
                          Código Pix:
                        </Label>
                        <Input {...field} id='pix' />
                      </Fragment>
                    </FormControl>
                    <FormMessage className='px-0.5 text-start' />
                  </FormItem>
                )}
              />
            )}
            {activeTransactionMethod === 'TED' && (
              <Fragment>
                <FormField
                  name='accountName'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='space-y-1.5'>
                      <FormControl>
                        <Fragment>
                          <Label htmlFor='accountName' className='px-0.5'>
                            Nome da conta:
                          </Label>
                          <Input {...field} id='accountName' />
                        </Fragment>
                      </FormControl>
                      <FormMessage className='px-0.5 text-start' />
                    </FormItem>
                  )}
                />
                <FormField
                  name='account'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='space-y-1.5'>
                      <FormControl>
                        <Fragment>
                          <Label htmlFor='account' className='px-0.5'>
                            Número da conta:
                          </Label>
                          <Input
                            {...field}
                            id='account'
                            inputMode='numeric'
                            maxLength={8}
                            onChange={(event) => field.onChange(formatIntNumber(event.target.value))}
                          />
                        </Fragment>
                      </FormControl>
                      <FormMessage className='px-0.5 text-start' />
                    </FormItem>
                  )}
                />
                <FormField
                  name='cpf'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='space-y-1.5'>
                      <FormControl>
                        <Fragment>
                          <Label htmlFor='cpf' className='px-0.5'>
                            CPF:
                          </Label>
                          <Input
                            {...field}
                            id='cpf'
                            maxLength={14}
                            inputMode='numeric'
                            onChange={(event) => field.onChange(formatCPF(event.target.value))}
                          />
                        </Fragment>
                      </FormControl>
                      <FormMessage className='px-0.5 text-start' />
                    </FormItem>
                  )}
                />
                <FormField
                  name='agency'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='space-y-1.5'>
                      <FormControl>
                        <Fragment>
                          <Label htmlFor='agency' className='px-0.5'>
                            Agência:
                          </Label>
                          <Input
                            {...field}
                            id='agency'
                            maxLength={4}
                            inputMode='numeric'
                            onChange={(event) => field.onChange(formatIntNumber(event.target.value))}
                          />
                        </Fragment>
                      </FormControl>
                      <FormMessage className='px-0.5 text-start' />
                    </FormItem>
                  )}
                />
                <FormField
                  name='bank'
                  control={form.control}
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem className='space-y-1.5'>
                      <FormControl>
                        <Fragment>
                          <Label htmlFor='bank' className='px-0.5'>
                            Banco:
                          </Label>
                          <Select
                            onValueChange={(selectedBank: Banks) => {
                              onChange(selectedBank);
                            }}
                          >
                            <SelectTrigger id='bank'>
                              <SelectValue {...fieldProps} ref={bankRef} placeholder={value} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {banks.map((bank) => {
                                  return (
                                    <SelectItem key={bank} value={bank}>
                                      <div className='flex gap-2'>{bank}</div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Fragment>
                      </FormControl>
                      <FormMessage className='px-0.5 text-start' />
                    </FormItem>
                  )}
                />
              </Fragment>
            )}
            <FormField
              name='value'
              control={form.control}
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <FormControl>
                    <Fragment>
                      <Label htmlFor='value' className='px-0.5'>
                        Valor:
                      </Label>
                      <Input
                        id='value'
                        {...field}
                        ref={valueRef}
                        inputMode='numeric'
                        onChange={(event) => field.onChange(formatFloatNumber(event.target.value))}
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
          <AlertDialog open={isConfirmTransactionActive}>
            <AlertDialogTrigger>
              <Button onClick={handleConfirmTransaction}>Efetuar Transferência</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Está realmente certo disso?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseja realmente confirmar a transferência? Verifique se todas as informações estão corretas
                  antes de prosseguir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsConfirmTransactionActive(false)}>
                  Cancelar
                </AlertDialogCancel>
                <Button type='submit' form='create-transaction'>
                  Confirmar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
