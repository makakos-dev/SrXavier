'use client';

import { formatDate, formatDateGetDay, formatDateGetHour } from '@/utils/date';
import { formatPaymentMethodCaption } from '@/utils/caption';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { FormattedAppointmentData } from '@/lib/schemas';
import { usePromiseToast } from './usePromiseToast';
import { formatToCurrency } from '@/utils/number';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Session } from '@/helpers/getSession';
import { Badge } from '@/components/ui/badge';
import { Fragment } from 'react';
import { toast } from 'sonner';

import {
  updateAppointmentPresence,
  type UpdateAppointmentPresence,
} from '@/services/client-side/updateAppointmentPresence';

import {
  updateAppointmentStatus,
  type UpdateAppointmentStatus,
} from '@/services/client-side/updateAppointmentStatus';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const useAppointmentsTable = (session: Session) => {
  const { createPromiseToast } = usePromiseToast();

  const columns: ColumnDef<FormattedAppointmentData>[] = [
    {
      accessorKey: 'clientName',
      header: () => <div>Cliente</div>,
      cell: ({ row }) => <div>{row.getValue('clientName')}</div>,
    },

    {
      accessorKey: 'employeeName',
      header: () => <div>Profissional</div>,
      cell: ({ row }) => <div>{row.getValue('employeeName')}</div>,
    },

    {
      accessorKey: 'haircutName',
      header: 'Corte',
      cell: ({ row }) => <div>{row.getValue('haircutName')}</div>,
    },

    {
      accessorKey: 'haircutPrice',
      header: () => <div>Preço</div>,
      cell: ({ row }) => <div className='font-medium'>{formatToCurrency(row.getValue('haircutPrice'))}</div>,
    },

    {
      accessorKey: 'isDone',
      header: 'Presença',
      cell: ({ row }) => {
        const oneHour = 1 * 60 * 60 * 1000;
        const appointmentHour = new Date(row.getValue('appointmentDate')).getTime();

        const userAppointment = appointmentHour + oneHour > new Date().getTime() &&
          (Boolean(row.getValue('isDone')) || Boolean(!row.getValue('isDone'))) && (
            <Badge className='flex w-full justify-center bg-orange-400 py-1.5 uppercase text-zinc-900 brightness-110 hover:bg-orange-300'>
              Agendado
            </Badge>
          );

        const userPresence = appointmentHour + oneHour < new Date().getTime() &&
          Boolean(row.getValue('isDone')) && (
            <Badge className='flex justify-center bg-green-500 py-1.5 uppercase text-zinc-900 brightness-110 hover:bg-green-400'>
              Presente
            </Badge>
          );

        const userAbsence = appointmentHour + oneHour < new Date().getTime() &&
          Boolean(!row.getValue('isDone')) && (
            <Badge className='flex justify-center bg-red-900 py-1.5 font-medium uppercase text-gray-200 brightness-110 hover:bg-red-800'>
              Ausente
            </Badge>
          );

        return <Fragment>{userAppointment || userPresence || userAbsence}</Fragment>;
      },
    },

    {
      accessorKey: 'appointmentDate',
      header: ({ column }) => {
        return (
          <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Data
            <ArrowUpDown className='ml-2 h-4 w-4 min-w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Fragment>
          <div className='max-lg:hidden'>{formatDate(row.getValue('appointmentDate'))}h</div>
          <div className='lg:hidden'>
            {formatDateGetDay(row.getValue('appointmentDate'))} às{' '}
            {formatDateGetHour(row.getValue('appointmentDate'))}h
          </div>
        </Fragment>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(String(rowA.getValue(columnId))).getTime();
        const dateB = new Date(String(rowB.getValue(columnId))).getTime();
        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
      },
    },

    {
      accessorKey: 'paymentMethod',
      header: () => <div>Método de Pagamento</div>,
      cell: ({ row }) => {
        return <div className='font-medium'>{formatPaymentMethodCaption(row.getValue('paymentMethod'))}</div>;
      },
    },

    {
      accessorKey: 'appointmentStatus',
      header: () => <div className='text-right'>Status</div>,
      cell: ({ row }) => (
        <div className='text-right font-bold'>{String(row.getValue('appointmentStatus')).toUpperCase()}</div>
      ),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const { appointmentId, paymentLink, appointmentStatus, clientName } = row.original;

        const handleUpdateAppointmentStatus = ({
          id,
          status,
          clientName,
          employeeId,
        }: UpdateAppointmentStatus) => {
          const updateAppointmentStatusPromise = updateAppointmentStatus({
            id,
            status,
            employeeId,
            clientName,
          });

          createPromiseToast('Atualizando o status.', updateAppointmentStatusPromise);
        };

        const handleUpdateAppointmentPresence = ({
          id,
          presence,
          clientName,
          employeeId,
        }: UpdateAppointmentPresence) => {
          const updateAppointmentPresencePromise = updateAppointmentPresence({
            id,
            presence,
            employeeId,
            clientName,
          });

          createPromiseToast('Atualizando a presença.', updateAppointmentPresencePromise);
        };

        if (session?.accountType === 'USER') {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Abrir Menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='flex flex-col'>
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (appointmentStatus === 'Pago') {
                      toast.error('Pagamento já efetuado para este agendamento.');
                      return;
                    }

                    navigator.clipboard.writeText(String(paymentLink));
                    toast.success('Link de pagamento copiado para a área de transferência.');
                  }}
                  className='cursor-pointer'
                >
                  Copiar Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Abrir Menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='flex flex-col'>
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(appointmentId);
                  toast.success('ID do agendamento copiado para a área de transferência.');
                }}
                className='cursor-pointer'
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(String(paymentLink));
                  toast.success('Link de pagamento copiado para a área de transferência.');
                }}
                className='cursor-pointer'
              >
                Copiar Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='flex flex-col'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' className='h-8 w-full justify-start px-2 py-[0.375rem]'>
                          Pago
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='max-[550px]:max-w-[90%]'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja marcar este agendamento como pago?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateAppointmentStatus({
                                employeeId: session?.id,
                                id: appointmentId,
                                status: 'PAID',
                                clientName,
                              })
                            }
                          >
                            Confirmar Pagamento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' className='h-8 w-full justify-start px-2 py-[0.375rem]'>
                          Almoço
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='max-[550px]:max-w-[90%]'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Marcar como Horário de Almoço</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja marcar este agendamento como horário de almoço?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateAppointmentStatus({
                                employeeId: session?.id,
                                id: appointmentId,
                                status: 'BREAK',
                                clientName,
                              })
                            }
                          >
                            Confirmar Almoço
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' className='h-8 w-full justify-start px-2 py-[0.375rem]'>
                          Pendente
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='max-[550px]:max-w-[90%]'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Pendência</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja marcar este agendamento como pendente?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateAppointmentStatus({
                                employeeId: session?.id,
                                id: appointmentId,
                                status: 'PENDING',
                                clientName,
                              })
                            }
                          >
                            Confirmar Pendência
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' className='h-8 w-full justify-start px-2 py-[0.375rem]'>
                          Cancelado
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='max-[550px]:max-w-[90%]'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja cancelar este agendamento?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Manter</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateAppointmentStatus({
                                employeeId: session?.id,
                                id: appointmentId,
                                status: 'CANCELED',
                                clientName,
                              })
                            }
                          >
                            Confirmar Cancelamento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Presença</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='flex flex-col'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' className='h-8 w-full justify-start px-2 py-[0.375rem]'>
                          Ausente
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='max-[550px]:max-w-[90%]'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Ausencia</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja registrar a ausência deste agendamento?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateAppointmentPresence({
                                employeeId: session?.id,
                                id: appointmentId,
                                presence: false,
                                clientName,
                              })
                            }
                          >
                            Registrar Ausência
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' className='h-8 w-full justify-start px-2 py-[0.375rem]'>
                          Presente
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='max-[550px]:max-w-[90%]'>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Presença</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza de que deseja confirmar a presença deste agendamento?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleUpdateAppointmentPresence({
                                employeeId: session?.id,
                                id: appointmentId,
                                presence: true,
                                clientName,
                              })
                            }
                          >
                            Confirmar Presença
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return { columns };
};
