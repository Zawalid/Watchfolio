import { motion } from 'framer-motion';
import { Award, Trophy, Star, ArrowRight } from 'lucide-react';
import { Button } from '@heroui/button';
import { Link } from 'react-router';

const featuredAwards = [
  {
    title: 'Oppenheimer',
    year: 2023,
    rating: 8.3,
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    id: 872585,
    award: 'Best Picture Winner',
    category: 'Academy Awards 2024',
  },
  {
    title: 'The Bear',
    year: 2023,
    rating: 8.7,
    poster: 'https://image.tmdb.org/t/p/w500/zPyM6tzcQuSqKxqhFo1Jqe0XbTw.jpg',
    id: 136315,
    award: 'Best Comedy Series',
    category: 'Emmy Awards 2024',
  },
  {
    title: 'Poor Things',
    year: 2023,
    rating: 7.8,
    poster: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    id: 792307,
    award: 'Best Actress Winner',
    category: 'Academy Awards 2024',
  },
];

export default function AwardsSpotlight() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Warning-500 to-Error-500 shadow-Warning-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Trophy className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold text-white'>Awards Spotlight</h2>
              <div className='border-Warning-500/30 bg-Warning-500/10 text-Warning-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm'>
                <Award className='h-3 w-3' />
                <span>Winners</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 text-sm'>Celebrating the best in entertainment</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/awards'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          All Awards
        </Button>
      </div>

      {/* Awards Grid */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {featuredAwards.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className='bg-blur group relative overflow-hidden rounded-xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/20'
          >
            <Link to={`/${movie.id > 500000 ? 'movie' : 'tv'}/${movie.id}`} className='block'>
              <div className='relative aspect-[16/9] overflow-hidden'>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />

                {/* Award Badge */}
                <div className='absolute top-3 left-3'>
                  <div className='bg-Warning-500/90 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-black backdrop-blur-sm'>
                    <Trophy className='h-3 w-3' />
                    <span>Winner</span>
                  </div>
                </div>

                {/* Rating */}
                <div className='absolute top-3 right-3'>
                  <div className='bg-blur flex items-center gap-1 rounded-full border border-white/20 px-2 py-1 backdrop-blur-xl'>
                    <Star className='fill-Warning-400 text-Warning-400 h-3 w-3' />
                    <span className='text-xs font-medium text-white'>{movie.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className='absolute right-0 bottom-0 left-0 p-4'>
                  <div className='text-Warning-300 mb-1 text-xs font-medium'>{movie.category}</div>
                  <h3 className='mb-1 text-lg font-bold text-white'>{movie.title}</h3>
                  <p className='text-Warning-400 text-sm font-medium'>{movie.award}</p>
                  <p className='text-Grey-400 text-xs'>{movie.year}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
