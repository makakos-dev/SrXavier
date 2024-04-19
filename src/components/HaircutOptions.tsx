import { PaymentMethodPicker } from './PaymentMethodPicker';
import { EmployeePicker } from './EmployeePicker';
import { DatePicker } from './DatePicker';
import { User } from '@/lib/schemas';

export const HaircutOptions = ({ employees }: { employees: User[] }) => {
  return (
    <div className='flex flex-col justify-between gap-4'>
      <PaymentMethodPicker />
      <EmployeePicker employees={employees} />
      <DatePicker />
    </div>
  );
};
