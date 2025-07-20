import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import CelebritiesCardsList from '@/components/celebrity/CelebritiesCardsList';
import { queryKeys } from '@/lib/react-query';
import { getPopularPeople, getTrendingPeople } from '@/lib/api/TMDB';
import { cn } from '@/utils';
import { containerVariants, itemVariants } from '@/lib/animations';
import { usePageTitle } from '@/hooks/usePageTitle';

const CELEBRITY_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popular',
    description: "Trending personalities everyone's talking about",
    icon: TrendingUp,
  },
  {
    id: 'trending',
    label: 'Trending',
    description: 'Rising stars and trending celebrities',
    icon: Sparkles,
  },
];

export default function Celebrities() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('popular'));
  
  usePageTitle(`${category ? CELEBRITY_CATEGORIES.find((c) => c.id === category)?.label : ''} Celebrities`);

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
  };

  return (
    <motion.div className='space-y-8' variants={containerVariants} initial='hidden' animate='visible'>
      {/* Header */}
      <motion.div variants={itemVariants} className='space-y-6'>
        <div className='flex items-center gap-4'>
          <div className='from-Tertiary-400 to-Primary-400 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Users className='h-6 w-6 text-white drop-shadow-sm' />
          </div>
          <div>
            <h1 className='heading gradient'>Celebrities</h1>
            <p className='text-Grey-400 text-sm'>Discover talented actors, visionary directors, and creative minds</p>
          </div>
        </div>

        {/* Categories */}
        <div className='flex flex-wrap gap-3'>
          {CELEBRITY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  'group flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200',
                  isActive
                    ? 'from-Tertiary-500 to-Primary-500 border-white/20 bg-gradient-to-r text-white shadow-lg shadow-black/20'
                    : 'bg-Grey-800/50 text-Grey-300 border-Grey-700/50 hover:bg-Grey-700/50 hover:border-Grey-600/50 hover:text-white'
                )}
              >
                <Icon
                  className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive && 'drop-shadow-sm')}
                />
                <span className='text-sm font-medium'>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className='border-Grey-800/50 flex items-center justify-between border-b pb-4'>
          <div>
            <h2 className='text-lg font-semibold text-white'>
              {CELEBRITY_CATEGORIES.find((c) => c.id === category)?.label || 'Popular Celebrities'}
            </h2>
            <p className='text-Grey-400 mt-1 text-sm'>
              {CELEBRITY_CATEGORIES.find((c) => c.id === category)?.description ||
                'Discover talented celebrities from our vast collection'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CelebritiesCardsList
          queryKey={queryKeys.celebrities(category, page)}
          queryFn={async ({ pageParam = 1 }) => {
            const res = category === 'trending' ? await getTrendingPeople(pageParam) : await getPopularPeople(pageParam);
            return res as TMDBResponse<Person>;
          }}
          useInfiniteQuery={true}
        />
      </motion.div>
    </motion.div>
  );
}
