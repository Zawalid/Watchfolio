import { motion } from 'framer-motion';
import {  Star, ArrowRight, Crown,  Film, Tv } from 'lucide-react';
import { Button } from '@heroui/button';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { discoverMovies, discoverTvShows } from '@/lib/api/TMDB';
import { LazyImage } from '@/components/ui/LazyImage';

async function getCriticsChoice() {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const [topMovies, topTvShows] = await Promise.all([
    discoverMovies({
      'primary_release_date.gte': `${lastYear}-01-01`,
      'primary_release_date.lte': `${currentYear}-12-31`,
      'vote_average.gte': 7.5,
      'vote_count.gte': 500,
      sort_by: 'vote_average.desc',
      page: 1,
    }),
    discoverTvShows({
      'first_air_date.gte': `${lastYear}-01-01`,
      'first_air_date.lte': `${currentYear}-12-31`,
      'vote_average.gte': 7.5,
      'vote_count.gte': 300,
      sort_by: 'vote_average.desc',
      page: 1,
    }),
  ]);

  // Combine and get top 3
  const allContent = [...topMovies.results, ...topTvShows.results]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      award: ["Critics' Choice Winner", 'Excellence Award', 'Outstanding Achievement'][index],
      category: 'Critics Choice Awards 2024',
      type: 'title' in item ? 'movie' : 'tv',
    }));

  return allContent;
}

export default function CriticsChoiceSection() {
  const { data: criticsChoice, isLoading } = useQuery({
    queryKey: ['critics-choice'],
    queryFn: getCriticsChoice,
    staleTime: 1000 * 60 * 60 * 12,
  });

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='from-Warning-500 to-Error-500 shadow-Warning-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
              <Crown className='h-6 w-6 text-white drop-shadow-sm' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-white'>Critics' Choice</h2>
              <p className='text-Grey-400 mt-1 text-sm'>Loading highly rated content...</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='aspect-video animate-pulse rounded-xl border border-white/10 bg-white/5' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Warning-500 to-Error-500 shadow-Warning-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Crown className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold text-white'>Critics' Choice</h2>
              <div className='border-Warning-500/30 bg-Warning-500/10 text-Warning-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm'>
                <Star className='h-3 w-3 fill-current' />
                <span>Acclaimed</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 text-sm'>Highest rated movies and shows from critics</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/movies?category=top-rated'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      {/* Awards Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {criticsChoice?.map((item, index) => {
          const title = item.type === 'movie' ? (item as Movie).title : (item as TvShow).name;
          const releaseYear = item.type === 'movie' ? (item as Movie).release_date : (item as TvShow).first_air_date;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className='bg-blur group relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/20'
            >
              <Link to={`/${item.type}/${item.id}`} className='block'>
                <div className='relative aspect-video overflow-hidden'>
                  <LazyImage
                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                    alt={title}
                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />

                  {/* Top left badges - BaseMediaCard style */}
                  <div className='absolute top-3 left-3 flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md'>
                      {item.type === 'movie' ? <Film className='h-3 w-3' /> : <Tv className='h-3 w-3' />}
                      <span className='capitalize'>{item.type}</span>
                    </div>

                    {/* Critics' Choice Badge */}
                    <div className='border-Warning-500/30 bg-Warning-500/10 text-Warning-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md'>
                      <Crown className='h-3 w-3' />
                      <span>Winner</span>
                    </div>
                  </div>

                  {/* Rating Badge - Top Right */}
                  <div className='absolute top-3 right-3'>
                    <div className='flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-1 backdrop-blur-md'>
                      <Star className='fill-Warning-400 text-Warning-400 h-3 w-3' />
                      <span className='text-xs font-medium text-white'>{item.vote_average.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='absolute right-0 bottom-0 left-0 p-4'>
                    <div className='text-Warning-300 mb-1 text-xs font-medium'>{item.category}</div>
                    <h3 className='mb-1 text-lg font-bold text-white'>{title}</h3>
                    <p className='text-Warning-400 text-sm font-medium'>{item.award}</p>
                    <p className='text-Grey-400 text-xs'>{releaseYear ? new Date(releaseYear).getFullYear() : 'N/A'}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
