'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTransaction } from './CreateTransaction';
import { ArrowUpRight, DollarSign } from 'lucide-react';
import { formatDateGetDayAndYear } from '@/utils/date';
import { formatToCurrency } from '@/utils/number';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Fragment, useState } from 'react';

export const Transactions = ({ children }: { children: React.ReactNode }) => {
  const [isTransactionActive, setIsTransactionActive] = useState(false);

  return (
    <Fragment>
      <CreateTransaction {...{ isTransactionActive, setIsTransactionActive }} />
      {children}
      <div className='flex w-full flex-col gap-12 px-24 pb-12 pt-16 max-xl:px-14 max-lg:gap-8 max-lg:px-8 max-lg:pt-12 max-sm:px-6 max-sm:pt-12'>
        <main className='flex flex-1 flex-col gap-8 md:gap-8'>
          <div className='grid gap-8 md:grid-cols-1 md:gap-8 lg:grid-cols-3'>
            <div className='col-span-2 ml-2 flex flex-col gap-1 max-lg:col-span-1'>
              <h1 className='w-full font-raleway text-4xl font-medium max-md:text-3xl'>Transações</h1>
              <p className='text-base font-light max-md:text-sm'>
                Visualize e Gerencie Suas Transações Financeiras
              </p>
            </div>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Saldo</CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent className='flex flex-col gap-1.5'>
                <div className='text-2xl font-bold'>{formatToCurrency(45231.89)}</div>
                <p className='text-xs text-muted-foreground'>
                  Saldo disponível para suas transferências financeiras.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-8 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
            <Card className='xl:col-span-2'>
              <CardHeader className='flex flex-row justify-between gap-12 max-sm:flex-col max-sm:gap-2'>
                <div className='grid gap-1'>
                  <CardTitle className='text-2xl font-semibold'>Registro Financeiro</CardTitle>
                  <CardDescription>Registro das movimentações financeiras na sua barbearia.</CardDescription>
                </div>
                <Button size='sm' onClick={() => setIsTransactionActive(true)}>
                  Nova Transferência
                  <ArrowUpRight className='h-4 w-4' />
                </Button>
              </CardHeader>
              <ScrollArea>
                <CardContent className='max-h-[382px]'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className='text-right'>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Liam Johnson</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-06-23')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(250)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Olivia Smith</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-05-15')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(150)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Noah Williams</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            noah@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-01-15')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(350)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Emma Brown</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-03-01')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(450)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Liam Johnson</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-06-23')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(250)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Olivia Smith</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-05-15')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(150)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Noah Williams</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            noah@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-01-15')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(350)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className='font-medium'>Emma Brown</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell>{formatDateGetDayAndYear('2023-03-01')}</TableCell>
                        <TableCell className='text-right'>{formatToCurrency(450)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </ScrollArea>
            </Card>
            <Card className='flex flex-col'>
              <CardHeader>
                <div className='grid gap-1'>
                  <CardTitle className='text-2xl font-semibold'>Últimas Transferências</CardTitle>
                  <CardDescription>Confira as últimas transferências realizadas.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className='mt-auto grid gap-8'>
                <div className='flex items-center gap-4'>
                  <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>Olivia Martin</p>
                    <p className='text-sm text-muted-foreground'>olivia.martin@email.com</p>
                  </div>
                  <div className='ml-auto font-medium'>{formatToCurrency(1999)}</div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>Jackson Lee</p>
                    <p className='text-sm text-muted-foreground'>jackson.lee@email.com</p>
                  </div>
                  <div className='ml-auto font-medium'>{formatToCurrency(39)}</div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>Isabella Nguyen</p>
                    <p className='text-sm text-muted-foreground'>isabella.nguyen@email.com</p>
                  </div>
                  <div className='ml-auto font-medium'>{formatToCurrency(299)}</div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>William Kim</p>
                    <p className='text-sm text-muted-foreground'>will@email.com</p>
                  </div>
                  <div className='ml-auto font-medium'>{formatToCurrency(99)}</div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>Sofia Davis</p>
                    <p className='text-sm text-muted-foreground'>sofia.davis@email.com</p>
                  </div>
                  <div className='ml-auto font-medium'>{formatToCurrency(39)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Fragment>
  );
};
