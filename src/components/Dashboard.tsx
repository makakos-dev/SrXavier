'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatDateGetCurrentYearAndMonthName, formatDateShort } from '@/utils/date';
import { useDashboardTableFilter } from '@/hooks/useDashboardTableFilter';
import { FormattedAppointmentData, Haircut, User } from '@/lib/schemas';
import { DashboardTableFilters } from './DashboardTableFilters';
import { useDashboardTable } from '@/hooks/useDashboardTable';
import { formatScheduleCaption } from '@/utils/caption';
import { EmployeeEarnings } from './EmployeeEarnings';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatToCurrency } from '@/utils/number';
import { DashboardTable } from './DashboardTable';
import { CreateHaircut } from './CreateHaircut';
import { UpdateHaircut } from './UpdateHaircut';
import { Session } from '@/helpers/getSession';
import { useChart } from '@/hooks/useChart';
import { Button } from './ui/button';
import { Fragment } from 'react';

import {
  CheckCircle2,
  ChevronLeftIcon,
  ChevronRightIcon,
  Circle,
  CircleDot,
  CircleSlash,
  Contact,
  UserCircle,
  XCircle,
} from 'lucide-react';

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

  const { activeMonth, currentMonthTotalRevenue, updateActiveMonth, ChartElement } =
    useChart(appointmentsData);

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
      <div className='flex h-full w-full flex-col gap-12 px-28 pb-20 pt-14 max-xl:px-14 max-lg:gap-8 max-lg:px-8 max-sm:px-6 max-sm:pt-6'>
        <div className='grid grid-cols-2 gap-4 max-lg:grid-cols-1 max-lg:gap-8'>
          <div className='flex flex-col gap-2 max-lg:flex-row max-lg:justify-between max-sm:flex-col'>
            <div className='flex flex-col gap-1 max-sm:gap-2'>
              <h1 className='w-full font-raleway text-3xl font-bold uppercase max-md:text-3xl'>Dashboard</h1>
              <p className='text-base font-light max-md:text-sm'>Análise e Monitoramento de Agendamentos </p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='flex items-center gap-1 text-sm font-light max-lg:justify-end max-sm:justify-start'>
                {isEmployeeSelected ? <Contact className='size-5' /> : <UserCircle className='size-5' />}
                {isEmployeeSelected ? employee : 'Todos os Profissionais'}
              </p>
              <p className='flex items-center gap-1 text-sm font-light max-lg:justify-end max-sm:justify-start'>
                {StatusIcons[status]}
                {formatScheduleCaption(status)}
              </p>
              <p className='flex items-center gap-1 text-sm font-light max-lg:justify-end max-sm:justify-start'>
                <CalendarIcon className='size-5' />{' '}
                {isDateSelected ? formatDateShort(date) : 'Todas as Datas'}
              </p>
            </div>
          </div>
          <EmployeeEarnings filteredData={filteredDataByEmployee} />
        </div>
        <DashboardTable session={session} tableData={{ data: filteredData, columns: columns }}>
          <DashboardTableFilters employees={employees} />
        </DashboardTable>
        <div className='grid min-h-[540px] grid-cols-6 gap-8 max-xl:grid-cols-1 md:gap-8'>
          <Card className='col-span-4 flex h-full flex-col max-xl:col-auto max-xl:min-h-96 max-sm:min-h-[550px]'>
            <CardHeader className='flex flex-row items-start justify-between gap-4 max-sm:flex-col max-sm:gap-2'>
              <div className='grid gap-1 max-sm:gap-2'>
                <CardTitle className='flex items-center gap-6 text-2xl font-semibold max-sm:flex-col max-sm:items-start max-sm:gap-2'>
                  Receita Mensal
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => updateActiveMonth('decrement')}
                      className='h-7 w-7 p-0'
                    >
                      <ChevronLeftIcon className='h-4 w-4' />
                    </Button>
                    <span className='text-sm font-medium'>
                      {formatDateGetCurrentYearAndMonthName(activeMonth)}
                    </span>
                    <Button
                      variant='outline'
                      onClick={() => updateActiveMonth('increment')}
                      className='h-7 w-7 p-0'
                    >
                      <ChevronRightIcon className='h-4 w-4' />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Analise os padrões de receita diária em um mês selecionado.</CardDescription>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <span className='flex flex-col text-right text-sm font-normal max-sm:text-left'>
                  Faturamento Total
                  <span className='text-2xl font-bold'>{formatToCurrency(currentMonthTotalRevenue)}</span>
                </span>
              </div>
            </CardHeader>
            <CardContent className='h-full'>{ChartElement}</CardContent>
          </Card>
          <Card className='col-span-2 flex h-full min-h-80 flex-col max-xl:col-auto'>
            <CardHeader>
              <div className='grid gap-1'>
                <CardTitle className='text-2xl font-semibold'>Clientes Recentes</CardTitle>
                <CardDescription>
                  Descubra quem foram os últimos clientes a receberem os seus serviços.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className='grid gap-8'>
              {!appointmentsData.length && (
                <span className='py-40 text-center text-lg font-medium text-zinc-300 max-lg:py-24 max-md:text-base'>
                  Não há clientes recentes.
                </span>
              )}
              {appointmentsData
                .filter(({ appointmentStatus }) => appointmentStatus === 'Pago')
                .slice(0, 6)
                .map(({ clientName, haircutName, haircutPrice, appointmentId }) => {
                  return (
                    <div key={appointmentId} className='flex items-center gap-4'>
                      <div className='grid gap-1'>
                        <p className='text-sm font-medium leading-none'>{clientName}</p>
                        <p className='text-sm text-muted-foreground'>{haircutName}</p>
                      </div>
                      <div className='ml-auto font-medium'>{formatToCurrency(haircutPrice)}</div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};
