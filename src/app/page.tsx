import { getHaircuts } from '@/services/server-side/getHaircuts';
import { HaircutGrid } from '@/components/HaircutGrid';
import { SearchBar } from '@/components/SearchBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Fragment } from 'react';

export default async function Home() {
  const haircuts = await getHaircuts();

  return (
    <Fragment>
      <Navbar />
      <div className='flex flex-col items-start px-28 pb-20 pt-14 max-xl:px-20 max-md:px-6 max-md:pb-12 max-md:pt-10'>
        <div className='mb-6 flex w-full justify-between gap-6 max-md:mb-4 max-sm:flex-col'>
          <div className='flex flex-col'>
            <h1 className='w-full font-galada text-6xl font-medium max-lg:text-4xl'>Barbearia Sr. Xavier</h1>
            <p className='text-base  font-light max-md:text-sm'>
              Cortes Tradicionais e Atendimento Personalizado
            </p>
          </div>
          <SearchBar />
        </div>
        {haircuts.status === 'error' && (
          <span className='m-auto py-60 font-raleway text-3xl'>{haircuts.message}</span>
        )}
        {haircuts.status === 'success' && <HaircutGrid haircuts={haircuts.data} />}
      </div>
      <Footer />
    </Fragment>
  );
}
