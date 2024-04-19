import { createSelectInputQueryString } from '@/helpers/createQueryString';
import { validateEmployee } from '@/helpers/validateSearchParams';
import { CircleUser, Contact } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { User } from '@/lib/schemas';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const EmployeePicker = ({ employees }: { employees: User[] }) => {
  const searchParams = useSearchParams();
  const validEmployees = employees.map(({ name }) => name);
  const selectedEmployee = validateEmployee(searchParams.get('employee'), validEmployees, validEmployees[0]);

  const employeePlaceholder = searchParams.get('employee') ? (
    <div className='flex gap-2'>
      <Contact className='size-5' />
      {selectedEmployee}
    </div>
  ) : (
    <div className='flex gap-2'>
      <CircleUser className='size-5' />
      Escolha do Profissional
    </div>
  );

  return (
    <div className='flex w-full flex-col gap-2 max-md:w-full'>
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
            {employees.map((employeeOption) => {
              return (
                <SelectItem key={employeeOption.name} value={employeeOption.name}>
                  <div className='flex gap-2'>
                    <Contact className='size-5' />
                    {employeeOption.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
