'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Session } from '@/helpers/getSession';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

type AppointmentsTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export const AppointmentsTable = <TData, TValue>({
  session,
  children,
  tableData: { data, columns },
}: {
  session: Session;
  children: React.ReactNode;
  tableData: AppointmentsTableProps<TData, TValue>;
}) => {
  const isUserAuthorized = session?.accountType === 'ADMIN' || session?.accountType === 'EMPLOYEE';
  const columnsVisibility = {
    actions: true,
    appointmentId: false,
    clientName: isUserAuthorized,
    employeeName: !isUserAuthorized,
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(columnsVisibility);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className='flex w-full flex-col items-center gap-8'>
      <div className='flex w-full items-end justify-between gap-2 max-[865px]:flex-col'>
        {isUserAuthorized && (
          <Input
            placeholder='Busque pelo nome do cliente...'
            value={(table.getColumn('clientName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('clientName')?.setFilterValue(event.target.value)}
            className='max-w-sm max-[865px]:max-w-full'
          />
        )}
        {!isUserAuthorized && (
          <Input
            placeholder='Busque pelo nome do profissional...'
            value={(table.getColumn('employeeName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('employeeName')?.setFilterValue(event.target.value)}
            className='max-w-sm max-[865px]:max-w-full'
          />
        )}
        {children}
      </div>
      <div className='flex w-full flex-col gap-8'>
        <div className='flex items-center justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
        <div className='w-full rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className='whitespace-nowrap'>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap ${!isUserAuthorized && 'py-3.5'}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-[500px] text-center'>
                    Nenhum Resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
