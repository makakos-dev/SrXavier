'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateGetDayAndYear, formatDateGetHour, formatDateGetWeekday } from '@/utils/date';
import { AppointmentStaus, FormattedAppointmentData } from '@/lib/schemas';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const revalidate = 30;

export const AppointmentsList = ({ appointments }: { appointments: FormattedAppointmentData[] }) => {
  const filteredAppointments = appointments
    .filter(({ appointmentDate }) => {
      return new Date(appointmentDate).getDate() === new Date().getDate();
    })
    .sort(({ appointmentDate: dateA }, { appointmentDate: dateB }) => {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  const today = new Date().toString();
  const { refresh } = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <main className='flex h-screen w-full flex-col gap-12 px-28 pb-20 pt-14 max-xl:px-14 max-lg:px-8 max-md:px-6'>
      <div className='flex flex-col gap-1 px-2'>
        <h1 className='w-full font-raleway text-4xl font-medium'>Horários</h1>
        <p className='text-base font-light max-md:text-sm'>Acompanhamento de Horários em Tempo Real</p>
      </div>
      <Card className='relative h-full overflow-hidden'>
        {!filteredAppointments.length && (
          <span className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] py-28 pb-2 text-center text-xl font-medium text-zinc-300 max-md:text-base'>
            Sem horários agendados para hoje.
          </span>
        )}
        <CardHeader>
          <CardTitle className='text-2xl max-md:text-xl'>Horários de {formatDateGetWeekday(today)}</CardTitle>
          <CardDescription className='text-base max-md:text-sm'>
            {formatDateGetDayAndYear(today)}
          </CardDescription>
        </CardHeader>
        <ScrollArea className='h-full'>
          <CardContent id='card-content'>
            <Table>
              <TableHeader>
                <TableRow className='max-md:text-sm'>
                  <TableHead className='max-md:px-0'>Cliente</TableHead>
                  <TableHead className='max-md:hidden'>Corte</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead className='max-md:hidden'>Status</TableHead>
                  <TableHead className='text-right font-semibold'>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map(
                  ({
                    appointmentId,
                    clientName,
                    employeeName,
                    appointmentStatus,
                    haircutName,
                    appointmentDate,
                  }) => {
                    const statusColours: { [key in AppointmentStaus]: string } = {
                      Almoço: '',
                      'Todos os Status': '',
                      Pago: 'dark:bg-green-600/60 dark:brightness-125 bg-green-600/80 brightness-125',
                      Pendente: 'dark:bg-orange-500/60 dark:brightness-125 bg-orange-500/80 brightness-125',
                      Cancelado: 'dark:bg-red-600/50 dark:brightness-125 bg-red-600/80 brightness-125',
                    };

                    const [hour, minutes] = formatDateGetHour(appointmentDate).split(':');

                    return (
                      <TableRow key={appointmentId} className='max-md:text-sm'>
                        <TableCell className='text-nowrap pl-3 font-medium max-md:pl-0'>
                          {clientName}
                        </TableCell>
                        <TableCell className='text-nowrap max-md:hidden'>{haircutName}</TableCell>
                        <TableCell className='text-nowrap'>{employeeName}</TableCell>
                        <TableCell className='max-md:hidden'>
                          <Badge
                            variant='secondary'
                            className={`bg- flex w-32 justify-center py-3  uppercase ${statusColours[appointmentStatus]}`}
                          >
                            {appointmentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className='pr-3 text-right font-semibold'>
                          {hour}h{minutes}
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          </CardContent>
        </ScrollArea>
      </Card>
    </main>
  );
};
