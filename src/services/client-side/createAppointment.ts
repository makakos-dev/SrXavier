import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig/firebase';
import { PaymentMethod, Status } from '@/lib/schemas';

export type CreateAppointment = {
  status: Status;
  isDone: boolean;
  haircutId: number;
  employeeId: string;
  paymentLink: string;
  appointmentId: string;
  appointmentDate: Date;
  paymentMethod: PaymentMethod;
} & ({ userId: string; type: 'REGULAR' } | { cpf: string; name: string; phone: string; type: 'SESSIONLESS' });

export const createAppointment = async (params: CreateAppointment) => {
  const appointment =
    params.type === 'REGULAR'
      ? {
          type: params.type,
          userId: params.userId,
          status: params.status,
          isDone: params.isDone,
          id: params.appointmentId,
          haircutId: params.haircutId,
          employeeId: params.employeeId,
          paymentLink: params.paymentLink,
          paymentMethod: params.paymentMethod,
          scheduleDate: String(params.appointmentDate),
        }
      : {
          cpf: params.cpf,
          name: params.name,
          type: params.type,
          phone: params.phone,
          status: params.status,
          isDone: params.isDone,
          id: params.appointmentId,
          haircutId: params.haircutId,
          employeeId: params.employeeId,
          paymentLink: params.paymentLink,
          paymentMethod: params.paymentMethod,
          scheduleDate: String(params.appointmentDate),
        };

  try {
    await addDoc(collection(firestore, 'appointments'), appointment);
    await updateDoc(doc(firestore, 'users', params.employeeId), { schedules: arrayUnion(appointment) });

    return {
      status: 'success',
      message: 'Horário reservado com sucesso! Estamos te redirecionando para o link de pagamento.',
    } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return {
      status: 'error',
      message: 'Houve um problema ao processar a reserva do horário.',
    } as const;
  }
};
