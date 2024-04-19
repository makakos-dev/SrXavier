import { getEmployeeWithRedirect } from '@/services/server-side/getEmployees';
import { getUserByIdWithRedirect } from '@/services/server-side/getUserById';
import { getHaircutWithRedirect } from '@/services/server-side/getHaircuts';
import { formatScheduleCaption } from '@/utils/caption';
import { Appointment } from '@/lib/schemas';

export const formatAppointmentsData = async (data: Appointment[]) => {
  return await Promise.all(
    data?.map(async (appointment) => {
      const isAppointmentRegular = appointment.type === 'REGULAR';
      const [haircut, employee, client] = await Promise.all([
        getHaircutWithRedirect(appointment.haircutId),
        getEmployeeWithRedirect(appointment.employeeId),
        isAppointmentRegular ? getUserByIdWithRedirect(appointment.userId) : { name: appointment.name },
      ]);

      return {
        clientName: client.name,
        employeeId: employee.id,
        haircutName: haircut.name,
        isDone: appointment.isDone,
        employeeName: employee.name,
        haircutPrice: haircut.price,
        appointmentId: appointment.id,
        paymentLink: appointment.paymentLink,
        paymentMethod: appointment.paymentMethod,
        appointmentDate: appointment.scheduleDate,
        appointmentStatus: formatScheduleCaption(appointment.status),
      };
    }),
  );
};
