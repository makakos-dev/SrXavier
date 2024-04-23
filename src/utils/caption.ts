import { AppointmentStaus, PaymentMethod, Status } from '@/lib/schemas';

export const formatPaymentMethod = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case 'PIX':
      return 'Pix';
    case 'CASH':
      return 'Dinheiro';
    case 'CARD':
      return 'Cartão de crédito';
  }
};

export const formatScheduleStatus = (style: 'short' | 'long', status?: Status | 'DISABLED') => {
  switch (status) {
    case 'PAID':
    case 'PENDING':
      return style === 'long' ? 'Horário reservado' : 'Reservado';
    case 'BREAK':
      return style === 'long' ? 'Horário de almoço' : 'Almoço';
    case 'DISABLED':
      return style === 'long' ? 'Horário expirado' : 'Expirado';
    default:
      return style === 'long' ? 'Horário disponível' : 'Disponível';
  }
};

export const getScheduleStatusColor = (status?: Status | 'DISABLED') => {
  switch (status) {
    case 'PAID':
    case 'BREAK':
    case 'PENDING':
      return 'bg-orange-500/70 cursor-default pointer-events-none';
    case 'DISABLED':
      return 'bg-red-500/70 cursor-default pointer-events-none';
    default:
      return 'bg-green-500/70';
  }
};

export const formatScheduleCaption = (status: Status): AppointmentStaus => {
  switch (status) {
    case 'ALL':
      return 'Todos os Status';
    case 'PAID':
      return 'Pago';
    case 'PENDING':
      return 'Pendente';
    case 'BREAK':
      return 'Almoço';
    case 'CANCELED':
      return 'Cancelado';
  }
};

export const formatPaymentMethodCaption = (status: PaymentMethod) => {
  switch (status) {
    case 'CARD':
      return 'Cartão de crédito';
    case 'CASH':
      return 'Dinheiro';
    case 'PIX':
      return 'Pix';
  }
};
