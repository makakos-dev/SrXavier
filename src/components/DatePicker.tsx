import { formatDateShort, formatToDateTime, isNotWithinThirtyDaysRange } from '@/utils/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createDateInputQueryString } from '@/helpers/createQueryString';
import { validateDate } from '@/helpers/validateSearchParams';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const DatePicker = () => {
  const searchParams = useSearchParams();
  const selectedDate = validateDate(searchParams.get('date'), String(new Date()), false);
  const datePlaceholder = searchParams.get('date') ? formatDateShort(selectedDate) : 'Data do Agendamento';

  return (
    <div className='flex w-full flex-col gap-2 max-md:w-full'>
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
            locale={ptBR}
            selected={new Date(selectedDate)}
            disabled={(date) => isNotWithinThirtyDaysRange(date)}
            onSelect={(date) =>
              createDateInputQueryString({ dateInput: formatToDateTime(date), searchParams })
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
