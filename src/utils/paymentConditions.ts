import { Employee, PaymentMethod, specialCashPaymentEmployees } from '@/lib/schemas';

export const paymentConditions = (employee: Employee, paymentMethod: PaymentMethod) => {
  if (specialCashPaymentEmployees.includes(employee.name) && paymentMethod === 'CASH') {
    return {
      paymentStatus: 'error',
      paymentMessage:
        'Para confirmar o agendamento, é necessário realizar o pagamento em dinheiro pessoalmente.',
    } as const;
  }

  return { paymentStatus: 'success', paymentMessage: undefined } as const;
};
