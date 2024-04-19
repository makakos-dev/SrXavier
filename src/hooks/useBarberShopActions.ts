import { validateDate, validateEmployee, validatePaymentMethod } from '@/helpers/validateSearchParams';
import { CreateAppointment } from '@/services/client-side/createAppointment';
import { createPaymentLink } from '@/services/client-side/createPaymentLink';
import type { Employee, Haircut, PaymentMethod, User } from '@/lib/schemas';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export const useBarberShopActions = (barbers: User[], haircut: Haircut) => {
  const [appointmentData, setAppointmentData] = useState<CreateAppointment>();
  const [isPaymentActive, setIsPaymentActive] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);
  const searchParams = useSearchParams();

  const scheduleDate = validateDate(searchParams.get('date'), String(new Date()), false);
  const paymentMethod = validatePaymentMethod(searchParams.get('payment'), 'CARD');
  const validEmployees = barbers.map(({ name }) => name);
  const scheduleEmployee = validateEmployee(searchParams.get('employee'), validEmployees, validEmployees[0]);

  const employeeParam = searchParams.get('employee') && scheduleEmployee;
  const paymentParam = searchParams.get('payment') && paymentMethod;
  const dateParam = searchParams.get('date') && scheduleDate;

  const selectedEmployee = barbers.find((employee): employee is Employee => {
    return (
      (employee.accountType === 'EMPLOYEE' || employee.accountType === 'ADMIN') &&
      employee.name === scheduleEmployee
    );
  });

  const getCurrentSchedule = (hour: number) => {
    return new Date(
      new Date(scheduleDate).getFullYear(),
      new Date(scheduleDate).getMonth(),
      new Date(scheduleDate).getDate(),
      hour,
    );
  };

  const getEmployeeCurrentHourSchedule = (hour: number) => {
    return selectedEmployee?.schedules?.find(({ scheduleDate }) => {
      return new Date(scheduleDate).getTime() === getCurrentSchedule(hour).getTime();
    });
  };

  const handleCreateAppointmentLink = async (paymentMethod: PaymentMethod) => {
    const appointmentId = crypto.randomUUID();

    const paymentLinkResponse = await createPaymentLink({
      haircutId: haircut.id,
      haircutName: haircut.name,
      haircutPrice: haircut.price,
      paymentMethod: paymentMethod,
      appointmentId: appointmentId,
      haircutDescription: haircut.description,
    });

    if (paymentLinkResponse.status === 'error') {
      return { status: 'error', message: paymentLinkResponse.message, data: undefined } as const;
    }

    setIsPaymentActive(true);
    setIsFormActive(false);

    return {
      status: 'success',
      message: 'Link de pagamento criado com sucesso!',
      data: { appointmenId: appointmentId, paymentLink: paymentLinkResponse.paymentLink } as const,
    } as const;
  };

  return {
    dateParam,
    paymentParam,
    scheduleDate,
    isFormActive,
    employeeParam,
    paymentMethod,
    appointmentData,
    isPaymentActive,
    selectedEmployee,
    scheduleEmployee,
    setIsFormActive,
    setIsPaymentActive,
    getCurrentSchedule,
    setAppointmentData,
    handleCreateAppointmentLink,
    getEmployeeCurrentHourSchedule,
  };
};
