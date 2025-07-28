import { useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { getMovies, getTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { TABS_CLASSNAMES } from '@/styles/heroui';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';
import { Button } from '@heroui/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const movieQuery = { queryKey: queryKeys.category('movie', 'top-rated'), queryFn: () => getMovies('top-rated') };
const tvQuery = { queryKey: queryKeys.category('tv', 'top-rated'), queryFn: () => getTvShows('top-rated') };

export default function TopRatedSection() {
  const [selectedTab, setSelectedTab] = useState<'movie' | 'tv'>('movie');

  return (
    <div className='space-y-6'>
      <div className='flex justify-between'>
        <Title type={selectedTab} />

        <div className='flex flex-col items-end'>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as 'movie' | 'tv')}
            classNames={{ ...TABS_CLASSNAMES, tabList: TABS_CLASSNAMES.tabList + ' self-center' }}
            className='flex-1'
          >
            <Tab key='movie' title='Movies' />
            <Tab key='tv' title='TV Shows' />
          </Tabs>
          <Button
            as={Link}
            to={`/${selectedTab}s?category=top-rated`}
            size='sm'
            className='button-secondary! text-xs!'
            endContent={<ArrowRight className='h-4 w-4' />}
          >
            View All
          </Button>
        </div>
      </div>

      <div className='relative'>
        <MediaAndCelebritiesCardsList
          queryKey={selectedTab === 'movie' ? movieQuery.queryKey : tvQuery.queryKey}
          queryFn={selectedTab === 'movie' ? movieQuery.queryFn : tvQuery.queryFn}
          asSlider={true}
          sliderProps={{ autoplay: true, loop: true }}
        />
      </div>
    </div>
  );
}

function Title({ type }: { type?: 'movie' | 'tv' }) {
  return (
    <div className='flex flex-col gap-3'>
      <h2 className='outline-heading'>
        <span className='letter-shadow -ml-4'>T</span>
        <span className='letter-shadow -ml-4'>O</span>
        <span className='letter-shadow -ml-4'>P</span>
        <span className='letter-shadow -ml-'>R</span>
        <span className='letter-shadow -ml-4'>A</span>
        <span className='letter-shadow -ml-4'>T</span>
        <span className='letter-shadow -ml-4'>E</span>
        <span className='letter-shadow -ml-4'>D</span>
      </h2>
      <h3 className='flex flex-col gap-1 text-lg font-bold tracking-[4px] text-white uppercase'>
        {type === 'movie' ? 'Movies' : 'TV Shows'}
      </h3>
    </div>
  );
}
