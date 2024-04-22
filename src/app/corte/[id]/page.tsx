import { getEmployeesWithRedirect } from '@/services/server-side/getEmployees';
import { getHaircutWithRedirect } from '@/services/server-side/getHaircuts';
import { HaircutCarousel } from '@/components/HaircutCarousel';
import { HaircutTable } from '@/components/HaircutTable';
import { getSession } from '@/helpers/getSession';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Fragment } from 'react';

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const [haircut, employees, session] = await Promise.all([
    getHaircutWithRedirect(Number(id)),
    getEmployeesWithRedirect(),
    getSession(),
  ]);

  return (
    <Fragment>
      <Navbar />
      <div className='grid grid-cols-2 justify-items-center gap-20 px-20 pb-20 pt-14 max-2xl:px-8 max-[1350px]:grid-cols-1 max-[1350px]:justify-items-start max-md:gap-6 max-md:px-6 max-md:pb-14 max-md:pt-10'>
        <HaircutCarousel haircut={haircut} />
        <HaircutTable haircut={haircut} session={session} employees={employees} />
      </div>
      <Footer />
    </Fragment>
  );
}
