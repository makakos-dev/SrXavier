'use client';

import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateGetDayAndYear, formatDateGetWeekday } from '@/utils/date';
import { getAppoimentWithCallback } from '@/services/client-side/getAppointment';
import { useBarberShopActions } from '@/hooks/useBarberShopActions';
import { useRouter, useSearchParams } from 'next/navigation';
import { Haircut, User, workingHours } from '@/lib/schemas';
import { AppointmentOption } from './AppointmentOption';
import { type Session } from '@/helpers/getSession';
import { HaircutOptions } from './HaircutOptions';
import { useMounted } from '@/hooks/useMounted';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const HaircutTable = ({
  haircut,
  session,
  employees,
}: {
  haircut: Haircut;
  session: Session;
  employees: User[];
}) => {
  const { scheduleDate } = useBarberShopActions(employees, haircut);
  const SearchParams = useSearchParams();
  const appointmentId = SearchParams.get('id')?.trim();

  const { isMounted } = useMounted();
  const { push } = useRouter();

  useEffect(() => {
    if (!isMounted || !appointmentId) return;

    (async () => {
      const appointment = await getAppoimentWithCallback(appointmentId, () => push('/'));
      if (appointment?.status !== 'PAID') return;

      toast.success('Pagamento efetuado com sucesso. Seu horário para o corte está reservado e confirmado!');
    })();
  }, [push, isMounted, appointmentId]);

  return (
    <div className='mt-auto flex h-full w-full max-w-[750px] flex-col justify-center gap-10 max-[1350px]:max-w-none max-md:gap-8'>
      <div className='flex flex-col gap-1 text-right max-[1350px]:text-left'>
        <h2 className='w-full font-raleway text-3xl font-medium max-md:text-3xl'>
          Horários de {formatDateGetWeekday(scheduleDate)}
        </h2>
        <p className='text-base font-light'>{formatDateGetDayAndYear(scheduleDate)}</p>
      </div>
      <HaircutOptions employees={employees} />
      <Table>
        <TableCaption>Veja os horários disponíveis para agendar seu corte.</TableCaption>
        <TableHeader className='pointer-events-none'>
          <TableRow className='max-sm:text-xs'>
            <TableHead>Hora</TableHead>
            <TableHead>Dia</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Profissional</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workingHours.map((hour) => {
            return (
              <AppointmentOption
                key={hour}
                hour={hour}
                haircut={haircut}
                session={session}
                employees={employees}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
