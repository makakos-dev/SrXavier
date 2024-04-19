'use client';

import { CheckCircle2, Circle, CircleDot, CircleSlash, Contact, UserCircle, XCircle } from 'lucide-react';
import { useDashboardTableFilter } from '@/hooks/useDashboardTableFilter';
import { FormattedAppointmentData, Haircut, User } from '@/lib/schemas';
import { DashboardTableFilters } from './DashboardTableFilters';
import { useDashboardTable } from '@/hooks/useDashboardTable';
import { formatScheduleCaption } from '@/utils/caption';
import { EmployeeEarnings } from './EmployeeEarnings';
import { CalendarIcon } from '@radix-ui/react-icons';
import { DashboardTable } from './DashboardTable';
import { CreateHaircut } from './CreateHaircut';
import { UpdateHaircut } from './UpdateHaircut';
import { formatDateShort } from '@/utils/date';
import { Session } from '@/helpers/getSession';
import { Fragment } from 'react';

export const Dashboard = ({
  session,
  children,
  haircuts,
  employees,
  appointmentsData,
}: {
  session: Session;
  employees: User[];
  haircuts: Haircut[];
  children: React.ReactNode;
  appointmentsData: FormattedAppointmentData[];
}) => {
  const { filteredData, filteredDataByEmployee, date, status, employee, isEmployeeSelected, isDateSelected } =
    useDashboardTableFilter(appointmentsData, employees);

  const { columns } = useDashboardTable();

  const StatusIcons = {
    ALL: <Circle className='size-5' />,
    PAID: <CheckCircle2 className='size-5' />,
    BREAK: <CircleSlash className='size-5' />,
    PENDING: <CircleDot className='size-5' />,
    CANCELED: <XCircle className='size-5' />,
  };

  return (
    <Fragment>
      <CreateHaircut />
      <UpdateHaircut haircuts={haircuts} />
      {children}
      <div className='flex w-full flex-col gap-12 px-28 pb-20 pt-14 max-xl:px-14 max-lg:gap-8 max-lg:px-8 max-sm:px-6 max-sm:pt-6'>
        <div className='grid grid-cols-2 gap-4 max-lg:grid-cols-1 max-lg:gap-8'>
          <div className='flex flex-col gap-2 max-lg:flex-row max-lg:justify-between max-sm:flex-col'>
            <div className='flex flex-col gap-1 max-sm:gap-2'>
              <h1 className='w-full font-raleway text-4xl font-medium max-md:text-3xl'>Dashboard</h1>
              <p className='text-base font-light max-md:text-sm'>Análise e Monitoramento de Agendamentos </p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='flex items-center gap-1 text-sm font-light max-lg:justify-end max-sm:justify-start'>
                <CalendarIcon className='size-5' />{' '}
                {isDateSelected ? formatDateShort(date) : 'Todas as Datas'}
              </p>
              <p className='flex items-center gap-1 text-sm font-light max-lg:justify-end max-sm:justify-start'>
                {isEmployeeSelected ? <Contact className='size-5' /> : <UserCircle className='size-5' />}
                {isEmployeeSelected ? employee : 'Todos os Profissionais'}
              </p>
              <p className='flex items-center gap-1 text-sm font-light max-lg:justify-end max-sm:justify-start'>
                {StatusIcons[status]}
                {formatScheduleCaption(status)}
              </p>
            </div>
          </div>
          <EmployeeEarnings filteredData={filteredDataByEmployee} />
        </div>
        <DashboardTable session={session} tableData={{ data: filteredData, columns: columns }}>
          <DashboardTableFilters employees={employees} />
        </DashboardTable>
      </div>
    </Fragment>
  );
};
