import { CheckCircle, DollarSign, UserMinus2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FormattedAppointmentData } from '@/lib/schemas';
import { formatToCurrency } from '@/utils/number';

export const EmployeeAppointmentsDetails = ({
  appointmentsData,
}: {
  appointmentsData: FormattedAppointmentData[];
}) => {
  const oneHour = 1 * 60 * 60 * 1000;

  const earnings = appointmentsData.reduce((earnings, { isDone, appointmentStatus, haircutPrice }) => {
    if (isDone && appointmentStatus === 'Pago') earnings += haircutPrice;
    return earnings;
  }, 0);

  const absences = appointmentsData.reduce((absences, { isDone, appointmentDate }) => {
    if (!isDone && new Date(appointmentDate).getTime() + oneHour < new Date().getTime()) absences++;
    return absences;
  }, 0);

  const presences = appointmentsData.reduce((presences, { isDone, appointmentDate }) => {
    if (isDone && new Date(appointmentDate).getTime() + oneHour < new Date().getTime()) presences++;
    return presences;
  }, 0);

  const haircutsTotal = appointmentsData.reduce((haircutsTotal, { isDone, appointmentStatus }) => {
    if (isDone && appointmentStatus === 'Pago') haircutsTotal++;
    return haircutsTotal;
  }, 0);

  return (
    <div className='grid w-full grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1 max-[565px]:grid-cols-1 md:gap-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Ganhos</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{formatToCurrency(earnings)}</div>
          <p className='flex flex-col text-xs text-muted-foreground'>
            Quantia total recebida pelos serviços já prestados, marcados como pagos e com cliente presente.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Cortes Realizados</CardTitle>
          <CheckCircle className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{haircutsTotal}</div>
          <p className='flex flex-col text-xs text-muted-foreground'>
            Quantidade total de cortes realizados, marcados como pagos e com cliente presente.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Presenças</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{presences}</div>
          <p className='flex flex-col text-xs text-muted-foreground'>
            Número de clientes que compareceram aos seus agendamentos, com as presenças sendo confirmadas uma
            hora após o horário agendado.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Ausências</CardTitle>
          <UserMinus2 className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <div className='text-2xl font-bold'>{absences}</div>
          <p className='flex flex-col text-xs text-muted-foreground'>
            Quantidade de clientes ausentes nos agendamentos, considerando que as ausências são registradas
            uma hora após o horário marcado para o agendamento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
