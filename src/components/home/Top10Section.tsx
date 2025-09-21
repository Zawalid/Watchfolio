import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tabs, Tab } from '@heroui/react';
import { getTrendingMovies, getTrendingTvShows } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { TABS_CLASSNAMES } from '@/styles/heroui';
import MediaCard from '@/components/media/MediaCard';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/utils';

const movieQuery = {
  queryKey: queryKeys.trending('movie', 'day'),
  queryFn: () => getTrendingMovies('day'),
  staleTime: 1000 * 60 * 60,
};

const tvQuery = {
  queryKey: queryKeys.trending('tv', 'day'),
  queryFn: () => getTrendingTvShows('day'),
  staleTime: 1000 * 60 * 60,
};

export default function Top10Section() {
  const [selectedTab, setSelectedTab] = useState<MediaType>('movie');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const { data: movies, isLoading: moviesLoading, isError: moviesError } = useQuery(movieQuery);
  const { data: tvShows, isLoading: tvLoading, isError: tvError } = useQuery(tvQuery);

  const currentData = selectedTab === 'movie' ? movies : tvShows;
  const isLoading = selectedTab === 'movie' ? moviesLoading : tvLoading;
  const isError = selectedTab === 'movie' ? moviesError : tvError;

  // Get top 10 items
  const topItems = currentData?.results?.slice(0, 10) || [];

  return (
    <div className='space-y-8'>
      <div className='xs:flex-row xs:items-center xs:justify-between flex flex-col gap-3'>
        <Title type={selectedTab} />

        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as MediaType)}
          classNames={{ ...TABS_CLASSNAMES, tabList: cn(TABS_CLASSNAMES.tabList, 'w-full flex-nowrap!') }}
        >
          <Tab key='movie' title='Movies' />
          <Tab key='tv' title='TV Shows' />
        </Tabs>
      </div>

      {isError ? (
        <div className='border-Error-500/20 bg-Error-500/5 flex h-[280px] items-center justify-center rounded-xl border'>
          <div className='text-center'>
            <p className='text-Error-400 mb-2 text-sm font-medium'>
              Failed to load top {selectedTab === 'movie' ? 'movies' : 'TV shows'}
            </p>
            <p className='text-Grey-500 text-xs'>Please try again later</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className='scrollbar-hide relative overflow-x-auto'>
          <div className='flex gap-4 pb-4' style={{ width: 'max-content' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className='group relative flex w-[300px] items-baseline gap-3'>
                <div className='outline-heading -mr-5'>
                  <span className='letter-shadow'>{i + 1}</span>
                </div>
                <div className='bg-Grey-700 h-[320px] w-[220px] animate-pulse rounded-xl' />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Slider>
          {topItems.map((media, index) => (
            <Slider.Slide
              key={media.id}
              className={`flex-shrink-0 ${index < 9 ? 'sm:w-[300px]! w-[250px]!' : 'w-[275px]! sm:w-[340px]!'}`}
            >
              <motion.div
                className='group relative flex items-baseline'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`outline-heading -mr-2 sm:-mr-5 transition-all duration-300 group-hover:z-10 group-hover:-translate-2.5 group-hover:scale-105 ${hoveredItem === index ? 'filled' : ''}`}
                >
                  {index < 9 ? (
                    <span className='letter-shadow'>{index + 1}</span>
                  ) : (
                    <>
                      <span className='letter-shadow -ml-1'>1</span>
                      <span className='letter-shadow -ml-2 sm:-ml-7'>0</span>
                    </>
                  )}
                </div>

                {/* MediaCard (larger size) */}
                <div className='w-[250px]'>
                  <MediaCard media={media} />
                </div>
              </motion.div>
            </Slider.Slide>
          ))}
        </Slider>
      )}
    </div>
  );
}

function Title({ type }: { type?: MediaType }) {
  return (
    <div className='flex items-center gap-3 sm:gap-5'>
      <h2 className='outline-heading'>
        <span className='letter-shadow -ml-2 sm:-ml-4'>T</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>O</span>
        <span className='letter-shadow -ml-2 sm:-ml-4'>P</span>
        <span className='letter-shadow -ml-1'>1</span>
        <span className='letter-shadow -ml-3 sm:-ml-6'>0</span>
      </h2>
      <h3 className='flex flex-col gap-1 text-sm font-bold tracking-[2px] text-white uppercase sm:text-lg sm:tracking-[4px]'>
        <span>{type === 'movie' ? 'Movies' : 'TV Shows'}</span>
        <span>Today</span>
      </h3>
    </div>
  );
}
