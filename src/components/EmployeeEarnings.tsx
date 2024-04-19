import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FormattedAppointmentData } from '@/lib/schemas';
import { Activity, DollarSign } from 'lucide-react';
import { formatToCurrency } from '@/utils/number';

export const EmployeeEarnings = ({ filteredData }: { filteredData: FormattedAppointmentData[] }) => {
  const futureEarnings = filteredData.reduce(
    (futureEarnings, { haircutPrice, appointmentStatus, appointmentDate }) => {
      const oneHour = 1 * 60 * 60 * 1000;

      appointmentStatus === 'Pendente' &&
        new Date(appointmentDate).getTime() + oneHour > new Date().getTime() &&
        (futureEarnings += haircutPrice);
      return futureEarnings;
    },
    0,
  );

  const earnings = filteredData.reduce((earnings, { haircutPrice, appointmentStatus }) => {
    appointmentStatus === 'Pago' && (earnings += haircutPrice);
    return earnings;
  }, 0);

  return (
    <div className='grid w-full grid-cols-2 gap-4 max-[565px]:grid-cols-1 md:gap-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Ganhos</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{formatToCurrency(earnings)}</div>
          <p className='flex flex-col text-xs text-muted-foreground'>
            Quantia total recebida pelos serviços já prestados e confirmados como pagos.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Ganhos Futuros</CardTitle>
          <Activity className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{formatToCurrency(futureEarnings)}</div>
          <p className='flex flex-col text-xs text-muted-foreground'>
            Quantia prevista a ser recebida pelos serviços agendados e ainda não realizados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
