import { validateDate, validateEmployee, validateStatus } from '@/helpers/validateSearchParams';
import { FormattedAppointmentData, User } from '@/lib/schemas';
import { formatScheduleCaption } from '@/utils/caption';
import { isAppointmentOnSameDate } from '@/utils/date';
import { useSearchParams } from 'next/navigation';

export const useDashboardTableFilter = (data: FormattedAppointmentData[], employees: User[]) => {
  const validEmployees = employees.map(({ name }) => name);
  const searchParams = useSearchParams();

  const employee = validateEmployee(searchParams.get('employee'), validEmployees, validEmployees[0]);
  const date = validateDate(searchParams.get('date'), String(new Date()), true);
  const status = validateStatus(searchParams.get('status'), 'ALL');

  const isEmployeeSelected = searchParams.get('employee') && searchParams.get('employee') !== 'ALL';
  const isDateSelected = searchParams.get('date');

  const filteredData = data.filter(({ appointmentDate, employeeName, appointmentStatus }) => {
    return (
      (isDateSelected ? isAppointmentOnSameDate(date, appointmentDate) : appointmentDate) &&
      appointmentStatus === (status === 'ALL' ? appointmentStatus : formatScheduleCaption(status)) &&
      employeeName === (isEmployeeSelected ? employee : employeeName)
    );
  });

  const filteredDataByEmployee = data.filter(({ appointmentDate, employeeName }) => {
    return (
      (isDateSelected ? isAppointmentOnSameDate(date, appointmentDate) : appointmentDate) &&
      employeeName === (isEmployeeSelected ? employee : employeeName)
    );
  });

  return { filteredData, filteredDataByEmployee, date, status, employee, isEmployeeSelected, isDateSelected };
};
