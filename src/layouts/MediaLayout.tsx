import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import { parseAsString, useQueryState } from 'nuqs';
import { LucideIcon } from 'lucide-react';
import FiltersModal, { FilterOption } from '@/components/modals/FiltersModal';
import { useShortcuts } from '@/hooks/useShortcut';
import SortBy from '@/components/SortBy';
import { cn } from '@/utils';
import PageLayout from './PageLayout';
import { itemVariants } from '@/lib/animations';

interface MediaCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface MediaLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  categories: MediaCategory[];
  sortOptions: Array<{ key: string; label: string }>;
  filterOptions: FilterOption[];
  filterTitle: string;
  specialCategoryHandling?: {
    categoryId: string;
    displayName: string;
  };
}

export default function MediaLayout({
  title,
  subtitle,
  icon: MainIcon,
  categories,
  sortOptions,
  filterOptions,
  filterTitle,
  specialCategoryHandling,
}: MediaLayoutProps) {
  const [category, setCategory] = useQueryState('category', parseAsString);
  const [, setSortBy] = useQueryState('sort_by', parseAsString.withDefault('popularity'));
  const [, setSortDir] = useQueryState('sort_dir', parseAsString.withDefault('desc'));

  const handleCategorySelect = (categoryId: string) => {
    const isActive = category === categoryId;
    setCategory(isActive ? null : categoryId);

    // Clear sorting when selecting a category (categories have their own sorting)
    if (!isActive) {
      setSortBy('popularity');
      setSortDir('desc');
    }
  };

  const getDisplayTitle = () => {
    if (!category) return `All ${title}`;

    if (specialCategoryHandling && category === specialCategoryHandling.categoryId) {
      return specialCategoryHandling.displayName;
    }

    const categoryData = categories.find((c) => c.id === category);
    return categoryData ? `${categoryData.label} ${title}` : `All ${title}`;
  };

  // Sorting hotkeys
  useShortcuts([
    {
      name: 'sortByPopularity',
      handler: () => {
        setSortBy('popularity');
        setSortDir('desc');
      },
    },
    {
      name: 'sortByRating',
      handler: () => {
        setSortBy('vote_average');
        setSortDir('desc');
      },
    },
    {
      name: 'sortByDate',
      handler: () => {
        setSortBy(title === 'Movies' ? 'release_date' : 'first_air_date');
        setSortDir('desc');
      },
    },
    {
      name: 'sortByTitle',
      handler: () => {
        setSortBy(title === 'Movies' ? 'title' : 'name');
        setSortDir('asc');
      },
    },
  ]);

  return (
    <PageLayout
      Icon={MainIcon}
      title={title}
      subtitle={subtitle}
      pageTitle={null}
      headerChildren={
        <div className='flex items-center gap-3'>
          {!category && <SortBy options={sortOptions} defaultSort='popularity' />}
          <FiltersModal title={filterTitle} filterOptions={filterOptions} />
        </div>
      }
      headerClassName={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        category && 'flex-row items-center justify-between'
      )}
    >
      {/* Categories - Responsive grid/flex */}
      <motion.div variants={itemVariants} className='mobile:flex grid grid-cols-2 flex-wrap gap-2 sm:gap-3'>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={cn(
                'group flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 sm:px-4 sm:py-2.5',
                isActive
                  ? 'from-Secondary-500 to-Secondary-600 border-white/20 bg-gradient-to-r text-white shadow-lg shadow-black/20'
                  : 'bg-Grey-800/50 text-Grey-300 border-Grey-700/50 hover:bg-Grey-700/50 hover:border-Grey-600/50 hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-3 w-3 transition-transform group-hover:scale-110 sm:h-4 sm:w-4',
                  isActive && 'drop-shadow-sm'
                )}
              />
              <span className='text-sm font-medium'>{cat.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Results Header */}
      <div className='xs:flex-row xs:items-center xs:justify-between flex flex-col gap-3 border-b border-white/5 pb-4'>
        <div className='min-w-0 flex-1'>
          <h2 className='truncate text-base font-semibold text-white sm:text-lg'>{getDisplayTitle()}</h2>
          <p className='text-Grey-400 mt-1 line-clamp-2 text-xs sm:line-clamp-1 sm:text-sm'>
            {category
              ? categories.find((c) => c.id === category)?.description
              : `Discover your next ${title.toLowerCase()} from our vast collection`}
          </p>
        </div>
        {category && (
          <button
            onClick={() => setCategory(null)}
            className='bg-Grey-800/50 hover:bg-Grey-700/50 text-Grey-400 border-Grey-700/50 hover:border-Grey-600/50 flex shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 hover:text-white sm:text-sm'
          >
            <span>Show All</span>
            <span className='text-xs'>×</span>
          </button>
        )}
      </div>

      <Outlet />
    </PageLayout>
  );
}
