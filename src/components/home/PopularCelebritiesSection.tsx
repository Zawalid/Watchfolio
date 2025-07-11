import { Button } from '@heroui/button';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { getPopularPeople } from '@/lib/api/TMDB';
import PersonCard from '@/components/celebrity/details/CelebrityCard';
import { itemVariants } from '@/lib/animations';
import { queryKeys } from '@/lib/react-query';

export default function PopularCelebritiesSection() {
  const {
    data: popularCelebrities,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.celebrities('popular', 1),
    queryFn: async () => await getPopularPeople(1),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isError) {
    return (
      <motion.div
        variants={itemVariants}
        className='flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm'
      >
        <div className='text-Grey-400'>
          <span className='text-lg'>Failed to load popular celebrities</span>
          <p className='mt-2 text-sm'>Please try again later</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Tertiary-500 to-Primary-500 shadow-Tertiary-500/20 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Users className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <h2 className='text-2xl font-bold text-white'>Popular Celebrities</h2>
            <p className='text-Grey-400 mt-1 text-sm'>Discover trending actors, directors, and creators</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/celebrities'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      <Slider autoplay>
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Slider.Slide key={index} className='w-[180px]! sm:w-[200px]!'>
                <div className='group bg-Grey-800 relative aspect-[2/3] w-full animate-pulse overflow-hidden rounded-xl border border-white/10'>
                  <div className='absolute right-0 bottom-0 left-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent' />
                  <div className='absolute right-4 bottom-4 left-4 space-y-2'>
                    <div className='bg-Grey-700 h-4 w-3/4 rounded' />
                    <div className='bg-Grey-700 h-3 w-1/2 rounded' />
                  </div>
                </div>
              </Slider.Slide>
            ))
          : popularCelebrities?.results.slice(0, 12).map((person) => (
              <Slider.Slide key={person.id} className='w-[180px]! sm:w-[200px]!'>
                <PersonCard person={person} />
              </Slider.Slide>
            ))}
      </Slider>
    </motion.div>
  );
}
