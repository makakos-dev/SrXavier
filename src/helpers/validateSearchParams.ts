import { PaymentMethod, Status, paymentMethodSchema, paymentMethods, statuses } from '@/lib/schemas';
import { isNotWithinThirtyDaysRange } from '@/utils/date';
import { z } from 'zod';

export const validateDate = (param: string | null, defaultDate: string, isDateRangeDisabled: boolean) => {
  const date = z.string().safeParse(param);
  if (!param || !date.success) return defaultDate;
  if (!isDateRangeDisabled && isNotWithinThirtyDaysRange(new Date(param))) return defaultDate;
  return date.data;
};

export const validateEmployee = (param: string | null, validEmployees: string[], defaultEmployee: string) => {
  const employee = z.coerce.string().trim().min(1).safeParse(param);
  if (!param || !employee.success || !validEmployees.includes(employee.data)) return defaultEmployee;
  return employee.data;
};

export const validatePaymentMethod = (param: string | null, defaultPaymentMethod: PaymentMethod) => {
  const paymentMethod = paymentMethodSchema.safeParse(param);
  if (!param || !paymentMethod.success || !paymentMethods.includes(paymentMethod.data)) {
    return defaultPaymentMethod;
  }
  return paymentMethod.data;
};

export const validateStatus = (param: string | null, defaultStatus: Status) => {
  const status = z.enum(statuses).safeParse(param);
  if (!param || !status.success) return defaultStatus;
  return status.data;
};
