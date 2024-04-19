import { formatDateGetWeekAndDay, formatDateGetHour, formatDateShort, formatDateGetDay } from '@/utils/date';
import { handleReCaptchaVerifyResponse } from '@/helpers/handleReCaptchaVerifyResponse';
import { formatScheduleStatus, getScheduleStatusColor } from '@/utils/caption';
import { createAppointment } from '@/services/client-side/createAppointment';
import { useBarberShopActions } from '@/hooks/useBarberShopActions';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { paymentConditions } from '@/utils/paymentConditions';
import { TableCell, TableRow } from '@/components/ui/table';
import { Haircut, ScheduleForm, User } from '@/lib/schemas';
import { usePromiseToast } from '@/hooks/usePromiseToast';
import { ToastLoadingState } from './ToastLoadingState';
import { type Session } from '@/helpers/getSession';
import { AppointmentForm } from './AppointmentForm';
import { ReCaptchaBadge } from './ReCaptchaBadge';
import { useMounted } from '@/hooks/useMounted';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { toast } from 'sonner';

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

export const AppointmentOption = ({
  hour,
  haircut,
  session,
  employees,
}: {
  hour: number;
  haircut: Haircut;
  session: Session;
  employees: User[];
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { createPromiseToast } = usePromiseToast();
  const { push, refresh } = useRouter();
  const { isMounted } = useMounted();

  const {
    dateParam,
    paymentParam,
    scheduleDate,
    isFormActive,
    paymentMethod,
    employeeParam,
    appointmentData,
    isPaymentActive,
    scheduleEmployee,
    selectedEmployee,
    setIsFormActive,
    getCurrentSchedule,
    setIsPaymentActive,
    setAppointmentData,
    handleCreateAppointmentLink,
    getEmployeeCurrentHourSchedule,
  } = useBarberShopActions(employees, haircut);

  const isScheduleNotActive = hour < new Date().getHours() && new Date() >= new Date(scheduleDate);
  const currentHourSchedule = getEmployeeCurrentHourSchedule(hour);
  const isEmployeeBusy =
    currentHourSchedule?.status !== 'CANCELED' && currentHourSchedule?.status !== undefined;

  const handleScheduleHaircut = async () => {
    if (!session || !selectedEmployee || isEmployeeBusy || isScheduleNotActive) return;

    const { paymentStatus, paymentMessage } = paymentConditions(selectedEmployee, paymentMethod);
    if (paymentStatus === 'error') return toast.error(paymentMessage);

    const toastId = toast.message(<ToastLoadingState loadingMessage='Criando link de pagamento.' />);

    const appointmentLink = await handleCreateAppointmentLink(paymentMethod);
    if (appointmentLink.status === 'error') return toast.error(appointmentLink.message);

    toast.dismiss(toastId);
    toast.success(appointmentLink.message);

    setAppointmentData({
      paymentMethod,
      isDone: false,
      type: 'REGULAR',
      status: 'PENDING',
      userId: session.id,
      haircutId: haircut.id,
      employeeId: selectedEmployee.id,
      appointmentDate: getCurrentSchedule(hour),
      paymentLink: appointmentLink.data.paymentLink,
      appointmentId: appointmentLink.data.appointmenId,
    });
  };

  const handleScheduleBreak = async () => {
    if (!session || !selectedEmployee || isEmployeeBusy || isScheduleNotActive) return;

    const toastId = toast.message(<ToastLoadingState loadingMessage='Criando horário de almoço.' />);

    const appointmentResponse = await createAppointment({
      isDone: true,
      paymentMethod,
      type: 'REGULAR',
      status: 'BREAK',
      userId: session.id,
      haircutId: haircut.id,
      employeeId: selectedEmployee.id,
      appointmentId: crypto.randomUUID(),
      paymentLink: window.location.origin,
      appointmentDate: getCurrentSchedule(hour),
    });

    if (appointmentResponse.status === 'error') return toast.error(appointmentResponse.message);

    refresh();
    toast.dismiss(toastId);
    setIsFormActive(false);
    toast.success('Horário de almoço confirmado!');
  };

  const handleScheduleHaircutSessionless = async (formData: ScheduleForm) => {
    if (!executeRecaptcha || !selectedEmployee || isEmployeeBusy || isScheduleNotActive) return;
    const { cpf, name, phone } = formData;

    const { paymentStatus, paymentMessage } = paymentConditions(selectedEmployee, paymentMethod);
    if (paymentStatus === 'error') return toast.error(paymentMessage);

    const reCaptchaToken = await executeRecaptcha('createSessionlessAppointment');
    const { isHuman, message } = await handleReCaptchaVerifyResponse(reCaptchaToken);

    if (!isHuman) return toast.error(message);
    const toastId = toast.message(<ToastLoadingState loadingMessage='Criando link de pagamento.' />);

    const appointmentLink = await handleCreateAppointmentLink(paymentMethod);
    if (appointmentLink.status === 'error') return toast.error(appointmentLink.message);

    toast.dismiss(toastId);
    toast.success(appointmentLink.message);

    setAppointmentData({
      cpf,
      name,
      phone,
      paymentMethod,
      isDone: false,
      status: 'PENDING',
      type: 'SESSIONLESS',
      haircutId: haircut.id,
      employeeId: selectedEmployee.id,
      appointmentDate: getCurrentSchedule(hour),
      paymentLink: appointmentLink.data.paymentLink,
      appointmentId: appointmentLink.data.appointmenId,
    });
  };

  const handleShowModal = () => {
    if (!dateParam || !paymentParam || !employeeParam) {
      toast.error('Para completar o agendamento, selecione o profissional, a data e o método de pagamento.');
      return;
    }

    setIsFormActive(true);
  };

  const handleCreateAppointment = () => {
    if (!appointmentData) return;

    const createAppointmentPromise = createAppointment(appointmentData);
    createPromiseToast('Criando agendamento.', createAppointmentPromise, () => {
      setTimeout(() => push(appointmentData.paymentLink), 3000);
    });
  };

  return (
    <Fragment>
      <AlertDialog open={isFormActive}>
        <TableRow
          className={`relative cursor-pointer hover:border-t hover:brightness-110 max-sm:text-xs hover:${getScheduleStatusColor(!isScheduleNotActive ? currentHourSchedule?.status : 'DISABLED')} ${getScheduleStatusColor(!isScheduleNotActive ? currentHourSchedule?.status : 'DISABLED')}`}
        >
          <TableCell className='max-sm:py-2.5'>
            {formatDateGetHour(String(getCurrentSchedule(hour)))}h
          </TableCell>
          <TableCell className='max-md:hidden'>
            {formatDateGetWeekAndDay(String(getCurrentSchedule(hour)))}
          </TableCell>
          <TableCell className='md:hidden'>{formatDateGetDay(String(getCurrentSchedule(hour)))}</TableCell>
          <TableCell className='font-medium max-md:hidden'>
            {formatScheduleStatus('long', !isScheduleNotActive ? currentHourSchedule?.status : 'DISABLED')}
          </TableCell>
          <TableCell className='font-medium md:hidden'>
            {formatScheduleStatus('short', !isScheduleNotActive ? currentHourSchedule?.status : 'DISABLED')}
          </TableCell>
          <TableCell className='text-right'>{scheduleEmployee}</TableCell>
          {(!isEmployeeBusy || !isScheduleNotActive) && isMounted && (
            <AlertDialogTrigger onClick={handleShowModal} className='absolute inset-0 h-full w-full' />
          )}
        </TableRow>
        <AlertDialogContent className='max-[550px]:max-w-[90%]'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {(session?.accountType === 'ADMIN' || session?.accountType === 'EMPLOYEE') &&
                'Opções de Horário'}
              {paymentMethod === 'CASH' &&
                (session?.accountType === 'USER' || !session) &&
                'Pagamento em Dinheiro'}
              {paymentMethod !== 'CASH' &&
                (session?.accountType === 'USER' || !session) &&
                'Confirmar Agendamento'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {(session?.accountType === 'ADMIN' || session?.accountType === 'EMPLOYEE') && (
                <Fragment>
                  {`Você prefere agendar um compromisso com o cliente para ${formatDateShort(String(getCurrentSchedule(hour)))} às ${formatDateGetHour(String(getCurrentSchedule(hour)))}h, ou transformar este horário em seu intervalo de almoço?`}
                  <AppointmentForm handleScheduleHaircutSessionless={handleScheduleHaircutSessionless} />
                  <ReCaptchaBadge />
                </Fragment>
              )}
              {paymentMethod === 'CASH' &&
                (session?.accountType === 'USER' || !session) &&
                `Tem certeza de que deseja pagar pelo agendamento com dinheiro no momento da visita para o horário ${formatDateShort(String(getCurrentSchedule(hour)))} às ${formatDateGetHour(String(getCurrentSchedule(hour)))}h?`}
              {paymentMethod !== 'CASH' &&
                (session?.accountType === 'USER' || !session) &&
                `Tem certeza de que deseja confirmar o agendamento para o horário ${formatDateShort(String(getCurrentSchedule(hour)))} às ${formatDateGetHour(String(getCurrentSchedule(hour)))}h?`}
              {!session && (
                <Fragment>
                  <AppointmentForm handleScheduleHaircutSessionless={handleScheduleHaircutSessionless} />
                  <ReCaptchaBadge />
                </Fragment>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='mr-auto max-sm:w-full' onClick={() => setIsFormActive(false)}>
              Cancelar
            </AlertDialogCancel>
            {(session?.accountType === 'ADMIN' || session?.accountType === 'EMPLOYEE') && (
              <div className='flex gap-2 max-sm:flex-col'>
                <AlertDialogAction onClick={handleScheduleBreak}>Horário de Almoço</AlertDialogAction>
                <AlertDialogAction type='submit' form='sessionless'>
                  Agendar para Cliente
                </AlertDialogAction>
              </div>
            )}
            {paymentMethod === 'CASH' && (
              <Fragment>
                {session?.accountType === 'USER' && (
                  <AlertDialogAction onClick={handleScheduleHaircut}>Pagar com Dinheiro</AlertDialogAction>
                )}
                {!session && (
                  <AlertDialogAction type='submit' form='sessionless'>
                    Pagar com Dinheiro
                  </AlertDialogAction>
                )}
              </Fragment>
            )}
            {paymentMethod !== 'CASH' && (
              <Fragment>
                {session?.accountType === 'USER' && (
                  <AlertDialogAction onClick={handleScheduleHaircut}>Confirmar Agendamento</AlertDialogAction>
                )}
                {!session && (
                  <AlertDialogAction type='submit' form='sessionless'>
                    Confirmar Agendamento
                  </AlertDialogAction>
                )}
              </Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isPaymentActive}>
        <AlertDialogContent className='max-[550px]:max-w-[90%]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Reserva</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Estamos quase prontos! Agora, basta prosseguir com o pagamento para finalizar sua reserva.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsPaymentActive(false)}>Cancelar Reserva</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateAppointment}>Efetuar Pagamento</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};
