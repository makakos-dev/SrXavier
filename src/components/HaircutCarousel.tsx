'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Haircut } from '@/lib/schemas';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

export const HaircutCarousel = ({ haircut }: { haircut: Haircut }) => {
  return (
    <div className='flex w-full max-w-[600px] flex-col gap-14 max-[1350px]:justify-self-center max-md:max-w-none max-md:gap-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='w-full font-raleway text-4xl font-medium max-md:text-3xl'>{haircut.name}</h1>
        <p className='text-sm font-light'>{haircut.description}</p>
      </div>
      <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className='w-full'>
        <CarouselContent>
          {haircut.photoUri.map((image, index) => (
            <CarouselItem key={index} className='relative h-[600px] w-full '>
              <Image
                fill
                src={image}
                quality={100}
                alt={haircut.name}
                className='h-auto w-full object-cover'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
