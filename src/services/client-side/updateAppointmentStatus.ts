import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { AppointmentsSchema, Status } from '@/lib/schemas';
import { formatScheduleCaption } from '@/utils/caption';
import { firestore } from '@/firebaseConfig/firebase';

export type UpdateAppointmentStatus = {
  id: string;
  status: Status;
  clientName: string;
  employeeId?: string;
};

export const updateAppointmentStatus = async ({
  id,
  status,
  clientName,
  employeeId,
}: UpdateAppointmentStatus) => {
  try {
    const appointment = await getDocs(query(collection(firestore, 'appointments'), where('id', '==', id)));
    const employee = await getDocs(query(collection(firestore, 'users'), where('id', '==', employeeId)));
    const appointmentRef = appointment.docs[0].ref;
    const employeeRef = employee.docs[0].ref;

    const employeeAppointments = AppointmentsSchema.safeParse(employee.docs[0].data().schedules);
    if (!employeeAppointments.success) {
      throw new Error('Algo inesperado aconteceu. Por favor, tente novamente em breve.');
    }

    const appointmentToUpdate = employeeAppointments.data.find((appointment) => appointment.id === id);
    if (!appointmentToUpdate) throw new Error('Agendamento não encontrado.');

    appointmentToUpdate.status = status;

    const filteredAppointments = employeeAppointments.data.filter((appointmentsToKeep) => {
      return appointmentsToKeep.id !== appointmentToUpdate.id;
    });

    await updateDoc(appointmentRef, { status: status });
    await updateDoc(employeeRef, { schedules: [...filteredAppointments, appointmentToUpdate] });

    return {
      status: 'sucess',
      message: `O status do agendamento de ${clientName.toUpperCase()} foi alterado para ${formatScheduleCaption(status).toUpperCase()}.`,
    } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return {
      status: 'error',
      message: 'Ops! Algo deu errado ao tentar alterar o status do agendamento.',
    } as const;
  }
};
