import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig/firebase';
import { AppointmentsSchema } from '@/lib/schemas';

export type UpdateAppointmentPresence = {
  id: string;
  presence: boolean;
  clientName: string;
  employeeId?: string;
};

export const updateAppointmentPresence = async ({
  id,
  presence,
  employeeId,
  clientName,
}: UpdateAppointmentPresence) => {
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

    appointmentToUpdate.isDone = presence;

    const filteredAppointments = employeeAppointments.data.filter((appointmentsToKeep) => {
      return appointmentsToKeep.id !== appointmentToUpdate.id;
    });

    await updateDoc(appointmentRef, { isDone: presence });
    await updateDoc(employeeRef, { schedules: [...filteredAppointments, appointmentToUpdate] });

    return {
      status: 'sucess',
      message: `A presença do agendamento de ${clientName.toUpperCase()} foi alterada para ${presence ? 'PRESENTE' : 'AUSENTE'}.`,
    } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return {
      status: 'error',
      message: 'Ops! Algo deu errado ao tentar alterar a presença do agendamento.',
    } as const;
  }
};
