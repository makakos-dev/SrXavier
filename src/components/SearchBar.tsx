'use client';

import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useStore } from '@/store';

export const SearchBar = () => {
  const setSearchBar = useStore().setSearchBar;

  return (
    <div className='relative flex w-full max-w-[275px] items-center max-sm:max-w-full'>
      <Input
        onChange={(event) => setSearchBar(event.target.value)}
        placeholder='Busque pelo nome do corte...'
        className='w-full'
      />
      <Search className='absolute right-3 size-5 opacity-70' />
    </div>
  );
};
