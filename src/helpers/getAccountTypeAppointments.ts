import type { Appointment } from '@/lib/schemas';
import { Session } from '@/helpers/getSession';

export const getAccountTypeAppointments = (session: Session, appointments: Appointment[]) => {
  if (session?.accountType === 'EMPLOYEE' || session?.accountType === 'ADMIN') {
    return appointments.filter((appointment) => {
      return appointment.employeeId === session.id;
    });
  }

  return appointments.filter((appointment) => {
    return appointment.type === 'REGULAR' && appointment.userId === session?.id;
  });
};
