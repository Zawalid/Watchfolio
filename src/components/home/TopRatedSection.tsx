import { useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { getMovies, getTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { TABS_CLASSNAMES } from '@/styles/heroui';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';
import { Button } from '@heroui/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/utils';

const movieQuery = { queryKey: queryKeys.category('movie', 'top-rated'), queryFn: () => getMovies('top-rated') };
const tvQuery = { queryKey: queryKeys.category('tv', 'top-rated'), queryFn: () => getTvShows('top-rated') };

export default function TopRatedSection() {
  const [selectedTab, setSelectedTab] = useState<MediaType>('movie');

  return (
    <div className='space-y-6'>
      <div className='xs:flex-row xs:items-center xs:justify-between flex flex-col gap-3'>
        <div className='min-w-0 flex-1'>
          <Title type={selectedTab} />
        </div>

        <div className='flex flex-shrink-0 flex-col xs:items-end gap-2'>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as MediaType)}
            classNames={{ ...TABS_CLASSNAMES, tabList: cn(TABS_CLASSNAMES.tabList, 'w-full flex-nowrap!') }}
          >
            <Tab key='movie' title='Movies' />
            <Tab key='tv' title='TV Shows' />
          </Tabs>
          <Button
            as={Link}
            to={`/${selectedTab}s?category=top-rated`}
            size='sm'
            className='button-secondary! text-xs!'
            endContent={<ArrowRight className='h-3 w-3 sm:h-4 sm:w-4' />}
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

function Title({ type }: { type?: MediaType }) {
  return (
    <div className='flex flex-col gap-2 sm:gap-3'>
      <h2 className='outline-heading'>
        <span className='letter-shadow -ml-2 sm:-ml-4'>T</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>O</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>P</span>
        <span className='letter-shadow -ml-1 sm:-ml-'>R</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>A</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>T</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>E</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>D</span>
      </h2>
      <h3 className='text-sm sm:text-lg font-bold tracking-[2px] sm:tracking-[4px] text-white uppercase'>
        {type === 'movie' ? 'Movies' : 'TV Shows'}
      </h3>
    </div>
  );
}
