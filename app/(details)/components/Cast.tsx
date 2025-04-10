'use client';

import Image from 'next/image';
import { placeholder } from '@/utils/shimmer-placeholder';
import { SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import Slider from '@/components/ui/slider';

export default function Cast({ cast }: { cast: Person[] }) {
  if (!cast?.length) return null; // TODO: Handle empty cast array

  return (
    <div className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>Main Cast</h2>
      <div className='relative'>
        <Slider smartSlide={true} >
          {cast?.map((member) => (
            <SwiperSlide key={member.id} className='!w-[100px]'>
              <div>
                <div className='aspect-square overflow-hidden rounded-full'>
                  <Image
                    src={
                      member.profile_path
                        ? `http://image.tmdb.org/t/p/original${member.profile_path}`
                        : '/images/placeholder.png'
                    }
                    alt={member.name}
                    width={100}
                    height={100}
                    className='h-full w-full object-cover'
                    placeholder={placeholder}
                  />
                </div>
                <div className='mt-2 text-center'>
                  <p className='text font-medium text-white'>{member.name}</p>
                  <p className='text-sm text-gray-400'>{member.character}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    </div>
  );
}
