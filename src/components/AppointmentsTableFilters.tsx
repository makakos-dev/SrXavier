import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createDateInputQueryString, createSelectInputQueryString } from '@/helpers/createQueryString';
import { CheckCircle2, Circle, CircleDot, CircleSlash, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { validateDate, validateStatus } from '@/helpers/validateSearchParams';
import { formatDateGetDayAndYear, formatToDateTime } from '@/utils/date';
import { formatScheduleCaption } from '@/utils/caption';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { Calendar } from './ui/calendar';
import { statuses } from '@/lib/schemas';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const AppointmentsTableFilters = () => {
  const searchParams = useSearchParams();
  const selectedDate = validateDate(searchParams.get('date'), String(new Date()), true);
  const selectedStatus = validateStatus(searchParams.get('status'), 'ALL');

  const StatusIcons = {
    ALL: <Circle className='size-5' />,
    PAID: <CheckCircle2 className='size-5' />,
    BREAK: <CircleSlash className='size-5' />,
    PENDING: <CircleDot className='size-5' />,
    CANCELED: <XCircle className='size-5' />,
  };

  const datePlaceholder = searchParams.get('date')
    ? formatDateGetDayAndYear(selectedDate)
    : 'Data do Agendamento';

  const statusPlaceholder = searchParams.get('status') ? (
    <div className='flex gap-2'>
      {StatusIcons[selectedStatus]}
      {formatScheduleCaption(selectedStatus)}
    </div>
  ) : (
    'Status do Agendamento'
  );

  return (
    <div className='flex gap-2 max-[865px]:w-full max-sm:flex-col'>
      <div className='flex w-[215px] flex-col gap-2 max-[865px]:w-[50%] max-md:w-full'>
        <Select
          onValueChange={(status) =>
            createSelectInputQueryString({ inputKey: 'status', selectInput: status, searchParams })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statuses.map((status) => {
                return (
                  <SelectItem key={status} value={status} className='cursor-pointer'>
                    <div className='flex gap-2'>
                      {StatusIcons[status]}
                      {formatScheduleCaption(status)}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='flex w-[225px] flex-col gap-2  max-[865px]:w-[50%] max-md:w-full'>
        <Popover>
          <PopoverTrigger asChild className='px-3'>
            <Button variant='outline' className={cn('justify-start gap-2 text-left font-normal')}>
              <CalendarIcon className='size-5' />
              {datePlaceholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              initialFocus
              footer={
                <Button
                  className='mt-2 w-full'
                  onClick={() =>
                    createSelectInputQueryString({ inputKey: 'date', selectInput: '', searchParams })
                  }
                >
                  Limpar
                </Button>
              }
              locale={ptBR}
              selected={new Date(selectedDate)}
              onSelect={(date) =>
                createDateInputQueryString({ dateInput: formatToDateTime(date), searchParams })
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
