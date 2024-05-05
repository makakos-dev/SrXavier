'use client';

import { generateWorkingHourDateRange } from '@/helpers/generateWorkingHourDateRange';
import { formatDateGetDayAndYear, isNotWithinThirtyDaysRange } from '@/utils/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createAppointment } from '@/services/client-side/createAppointment';
import { usePromiseToast } from '@/hooks/usePromiseToast';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { Fragment, useState } from 'react';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

export const UnavailableDatePicker = ({ employeeId }: { employeeId: string }) => {
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const { createPromiseToast } = usePromiseToast();

  const isDateRangeSelected = date?.from && date.to;

  const handleConfirmUnavailability = () => {
    if (!date?.from || !date?.to) return;

    const UnavailableDates = generateWorkingHourDateRange(
      date.from,
      date.to,
      [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    );

    const UnavailableAppointmentsPromise = UnavailableDates.map(async (appointmentDate) => {
      return createAppointment(
        {
          isDone: true,
          haircutId: 1,
          type: 'REGULAR',
          userId: employeeId,
          status: 'UNAVAILABLE',
          paymentMethod: 'CASH',
          employeeId: employeeId,
          appointmentDate: appointmentDate,
          appointmentId: crypto.randomUUID(),
          paymentLink: window.location.origin,
        },
        'Dias de ausência registrados com sucesso.',
      );
    });

    createPromiseToast('Registrando dias de ausência.', UnavailableAppointmentsPromise, () => {
      setDate(undefined);
      setIsDatePickerActive(false);
    });
  };

  return (
    <div className='grid gap-2'>
      <Popover open={isDatePickerActive} onOpenChange={(state) => setIsDatePickerActive(state)}>
        <PopoverTrigger>
          <Button
            id='date'
            variant='outline'
            onClick={() => setIsDatePickerActive(true)}
            className={cn('w-full justify-start gap-2 text-left font-normal')}
          >
            <CalendarIcon className='size-5' />
            {date?.from ? (
              date.to ? (
                <Fragment>
                  {formatDateGetDayAndYear(String(date.from))} - {formatDateGetDayAndYear(String(date.to))}
                </Fragment>
              ) : (
                formatDateGetDayAndYear(String(date.from))
              )
            ) : (
              <span>Dias de Ausência</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            locale={ptBR}
            selected={date}
            numberOfMonths={1}
            onSelect={setDate}
            defaultMonth={date?.from}
            disabled={(date) => isNotWithinThirtyDaysRange(date)}
            footer={
              isDateRangeSelected && (
                <div className='flex w-full flex-col gap-2 pt-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className='w-full'>Marcar Ausência</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja marcar ausência?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ao prosseguir, sua ausência será registrada para o período de{' '}
                          <span className='font-medium text-primary'>
                            {formatDateGetDayAndYear(String(date.from))}
                          </span>{' '}
                          até{' '}
                          <span className='font-medium text-primary'>
                            {formatDateGetDayAndYear(String(date.to))}
                          </span>
                          .
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmUnavailability}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
