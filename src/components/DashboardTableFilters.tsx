import { CheckCircle2, Circle, CircleDot, CircleSlash, Contact, UserCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createDateInputQueryString, createSelectInputQueryString } from '@/helpers/createQueryString';
import { validateDate, validateEmployee, validateStatus } from '@/helpers/validateSearchParams';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateGetDayAndYear, formatToDateTime } from '@/utils/date';
import { formatScheduleCaption } from '@/utils/caption';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import { statuses, User } from '@/lib/schemas';
import { Calendar } from './ui/calendar';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const DashboardTableFilters = ({ employees }: { employees: User[] }) => {
  const searchParams = useSearchParams();
  const validEmployees = employees.map(({ name }) => name);

  const StatusIcons = {
    ALL: <Circle className='size-5' />,
    PAID: <CheckCircle2 className='size-5' />,
    BREAK: <CircleSlash className='size-5' />,
    PENDING: <CircleDot className='size-5' />,
    CANCELED: <XCircle className='size-5' />,
  };

  const selectedEmployee = validateEmployee(searchParams.get('employee'), validEmployees, employees[0].name);
  const selectedDate = validateDate(searchParams.get('date'), String(new Date()), true);
  const selectedStatus = validateStatus(searchParams.get('status'), 'ALL');

  const employeePlaceholder =
    searchParams.get('employee') && searchParams.get('employee') !== 'ALL' ? (
      <div className='flex gap-2'>
        <Contact className='size-5' />
        {selectedEmployee}
      </div>
    ) : (
      <div className='flex items-center gap-2'>
        <UserCircle className='size-5' />
        Escolha do Profissional
      </div>
    );

  const statusPlaceholder = searchParams.get('status') ? (
    <div className='flex gap-2'>
      {StatusIcons[selectedStatus]}
      {formatScheduleCaption(selectedStatus)}
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      {StatusIcons['ALL']}
      Status do Agendamento
    </div>
  );

  const datePlaceholder = searchParams.get('date')
    ? formatDateGetDayAndYear(selectedDate)
    : 'Data do Agendamento';

  return (
    <div className='flex gap-2 max-[1100px]:w-full max-[1100px]:flex-col'>
      <div className='flex w-[225px] flex-col gap-2 max-[1100px]:w-full'>
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
              onSelect={(date) =>
                createDateInputQueryString({ dateInput: formatToDateTime(date), searchParams })
              }
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
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex w-[235px] flex-col gap-2 max-[1100px]:w-full'>
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
      <div className='flex w-[235px] flex-col gap-2 max-[1100px]:w-full'>
        <Select
          onValueChange={(employee) =>
            createSelectInputQueryString({ inputKey: 'employee', selectInput: employee, searchParams })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={employeePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='ALL'>
                <div className='flex gap-2'>
                  <UserCircle className='size-5' />
                  Todos os Profissionais
                </div>
              </SelectItem>
              {employees.map((employee) => {
                return (
                  <SelectItem key={employee.id} value={employee.name} className='cursor-pointer'>
                    <div className='flex gap-2'>
                      <Contact className='size-5' />
                      {employee.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
