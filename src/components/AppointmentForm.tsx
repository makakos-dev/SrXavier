import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ScheduleFormSchema, ScheduleForm as ScheduleFormType } from '@/lib/schemas';
import { formatCPF, formatPhoneNumber } from '@/utils/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

export const AppointmentForm = ({
  handleScheduleHaircutSessionless,
}: {
  handleScheduleHaircutSessionless: (formData: ScheduleFormType) => void;
}) => {
  const form = useForm<ScheduleFormType>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: { cpf: '', name: '', phone: '' },
  });

  function onSubmit(formData: ScheduleFormType) {
    handleScheduleHaircutSessionless(formData);
  }

  return (
    <Form {...form}>
      <form id='sessionless' onSubmit={form.handleSubmit(onSubmit)} className='mb-3 mt-6 flex flex-col gap-2'>
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
      </form>
    </Form>
  );
};
