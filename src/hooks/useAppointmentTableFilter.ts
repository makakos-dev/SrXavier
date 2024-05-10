import { validateDate, validateStatus } from '@/helpers/validateSearchParams';
import { FormattedAppointmentData } from '@/lib/schemas';
import { formatScheduleCaption } from '@/utils/caption';
import { isAppointmentOnSameDate } from '@/utils/date';
import { useSearchParams } from 'next/navigation';

export const useAppointmentTableFilter = (data: FormattedAppointmentData[]) => {
  const searchParams = useSearchParams();
  const date = validateDate(searchParams.get('date'), String(new Date()), true);
  const status = validateStatus(searchParams.get('status'), 'ALL');

  const filteredData = data.filter(({ appointmentDate, appointmentStatus }) => {
    const isDateSelected = searchParams.get('date');

    return isDateSelected
      ? isAppointmentOnSameDate(date, appointmentDate)
      : appointmentDate &&
          appointmentStatus === (status === 'ALL' ? appointmentStatus : formatScheduleCaption(status));
  });

  return { filteredData, date, status, searchParams };
};
