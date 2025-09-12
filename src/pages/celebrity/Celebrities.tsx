import { parseAsString, useQueryState } from 'nuqs';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Sparkles } from 'lucide-react';
import { queryKeys } from '@/lib/react-query';
import { getPopularPeople, getTrendingPeople } from '@/lib/api/TMDB';
import { cn } from '@/utils';
import { itemVariants } from '@/lib/animations';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';
import PageLayout from '@/layouts/PageLayout';

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
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('popular'));

  return (
    <PageLayout
      Icon={Users}
      title='Celebrities'
      subtitle='Discover talented actors, visionary directors, and creative minds'
      pageTitle={`${category ? CELEBRITY_CATEGORIES.find((c) => c.id === category)?.label : ''} Celebrities`}
    >
      <motion.div variants={itemVariants} className='space-y-6'>
        <div className='flex flex-wrap gap-3'>
          {CELEBRITY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'group flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200',
                  isActive
                    ? 'from-Secondary-500 to-Secondary-600 border-white/20 bg-gradient-to-r text-white shadow-lg shadow-black/20'
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
        <MediaAndCelebritiesCardsList
          contentType='person'
          queryKey={queryKeys.celebrities(category)}
          queryFn={async ({ pageParam = 1 }) => {
            const res =
              category === 'trending' ? await getTrendingPeople(pageParam) : await getPopularPeople(pageParam);
            return res as TMDBResponse<Person>;
          }}
          useInfiniteQuery={true}
        />
      </motion.div>
    </PageLayout>
  );
}
