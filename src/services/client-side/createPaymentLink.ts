import type { PaymentMethod } from '@/lib/schemas';

export type PaymentLinkOptions = {
  haircutId: number;
  haircutName: string;
  haircutPrice: number;
  appointmentId: string;
  haircutDescription: string;
  paymentMethod: PaymentMethod;
};

export const createPaymentLink = async (paymentLinkOptions: PaymentLinkOptions) => {
  const options = {
    dueDateLimitDays: 10,
    chargeType: 'DETACHED',
    notificationEnabled: false,
    name: paymentLinkOptions.haircutName,
    value: paymentLinkOptions.haircutPrice,
    haircutId: paymentLinkOptions.haircutId,
    appointmentId: paymentLinkOptions.appointmentId,
    description: paymentLinkOptions.haircutDescription,
    billingType: paymentLinkOptions.paymentMethod === 'PIX' ? 'PIX' : 'CREDIT_CARD',
  };

  try {
    const response = await fetch('/api/paymentLink', { method: 'POST', body: JSON.stringify(options) });
    const paymentData = await response.json();

    if (!response.ok) {
      throw new Error(
        'Ops! Parece que algo deu errado ao criar o link de pagamento. Por favor, tente novamente mais tarde.',
      );
    }

    return {
      status: 'success',
      message: 'Link de pagamento criado com sucesso!',
      paymentLink: paymentData.data.url,
    } as const;
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: 'error', message: error.message, paymentLink: undefined } as const;
  }
};
