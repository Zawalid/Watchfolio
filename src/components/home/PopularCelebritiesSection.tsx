import { Button } from '@heroui/react';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { getPopularPeople } from '@/lib/api/TMDB';
import { itemVariants } from '@/lib/animations';
import { queryKeys } from '@/lib/react-query';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';

export default function PopularCelebritiesSection() {
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

      <MediaAndCelebritiesCardsList
        contentType='person'
        queryKey={queryKeys.celebrities('popular')}
        queryFn={async () => await getPopularPeople(1)}
        asSlider={true}
        slideClassName='w-[180px]! sm:w-[200px]!'
        sliderProps={{ autoplay: true }}
      />
    </motion.div>
  );
}
