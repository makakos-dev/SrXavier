'use client';

import { usePagination } from '@/hooks/usePagination';
import { formatToCurrency } from '@/utils/number';
import { Card } from '@/components/ui/card';
import { Haircut } from '@/lib/schemas';
import { useStore } from '@/store';
import { Fragment } from 'react';

import Image from 'next/image';
import Link from 'next/link';

export const HaircutGrid = ({ haircuts }: { haircuts: Haircut[] }) => {
  const search = useStore().searchBar;

  const filteredData = haircuts.filter(({ name }) => {
    return search.trim().length
      ? name.toLowerCase().trim().includes(search.toLowerCase().trim())
      : name === name;
  });

  const { PaginationSection, CURRENT_PAGE_ITEMS } = usePagination(filteredData);

  return (
    <Fragment>
      {PaginationSection}
      {CURRENT_PAGE_ITEMS.length === 0 && (
        <span className='m-auto py-60 font-raleway text-3xl'>Nenhum corte encontrado.</span>
      )}
      {CURRENT_PAGE_ITEMS.length > 0 && (
        <div className='grid w-full grid-flow-row grid-cols-4 gap-10 py-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1'>
          {CURRENT_PAGE_ITEMS.map(({ id, name, photoUri, price }, index) => {
            return (
              <Card key={index} className='flex w-full select-none items-start overflow-hidden'>
                <Link href={`corte/${id}`} className='flex h-full w-full transform flex-col gap-4 pb-4'>
                  <div className='relative h-80 w-full rounded-sm'>
                    <Image
                      fill
                      quality={100}
                      src={photoUri[0]}
                      alt='haircut-image'
                      className='object-cover'
                    />
                  </div>
                  <div className='flex flex-col justify-between gap-1 px-4'>
                    <span className='text-xl font-light'>{name}</span>
                    <span className='font-semibold'>{formatToCurrency(price)}</span>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
      {PaginationSection}
    </Fragment>
  );
};
