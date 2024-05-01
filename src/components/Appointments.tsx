'use client';

import { useAppointmentTableFilter } from '@/hooks/useAppointmentTableFilter';
import { EmployeeAppointmentsDetails } from './EmployeeAppointmentsDetails';
import { AppointmentsTableFilters } from './AppointmentsTableFilters';
import { useAppointmentsTable } from '@/hooks/useAppointmentsTable';
import { FormattedAppointmentData } from '@/lib/schemas';
import { AppointmentsTable } from './AppointmentsTable';
import type { Session } from '@/helpers/getSession';
import { Fragment } from 'react';

export const Appointments = ({
  session,
  children,
  appointmentsData,
}: {
  session: Session;
  children: React.ReactNode;
  appointmentsData: FormattedAppointmentData[];
}) => {
  const isUserAuthorized = session?.accountType === 'ADMIN' || session?.accountType === 'EMPLOYEE';
  const { filteredData } = useAppointmentTableFilter(appointmentsData);
  const { columns } = useAppointmentsTable(session);

  return (
    <Fragment>
      {children}
      <div className='flex w-full flex-col gap-12 px-28 pb-20 pt-14 max-xl:px-14 max-lg:gap-8 max-lg:px-8 max-sm:px-6 max-sm:pt-6'>
        <div className='flex flex-col gap-1 max-[565px]:gap-2'>
          <h1 className='w-full font-raleway text-3xl font-bold uppercase max-md:text-3xl'>Agendamentos</h1>
          <p className='text-base font-light max-md:text-sm'>
            Veja e Gerencie seus Próximos Cortes Agendados
          </p>
        </div>
        {isUserAuthorized && <EmployeeAppointmentsDetails appointmentsData={filteredData} />}
        <AppointmentsTable session={session} tableData={{ data: filteredData, columns: columns }}>
          <AppointmentsTableFilters />
        </AppointmentsTable>
      </div>
    </Fragment>
  );
};
