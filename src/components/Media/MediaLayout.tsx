import { Outlet } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDisclosure } from '@heroui/modal';
import { parseAsString, useQueryState } from 'nuqs';
import { LucideIcon } from 'lucide-react';
import FiltersModal, { FilterOption } from '@/components/FiltersModal';
import { getShortcut } from '@/utils/keyboardShortcuts';
import SortBy from '@/components/SortBy';
import { cn } from '@/utils';

interface MediaCategory {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

interface MediaLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconGradient: string;
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
  iconGradient,
  categories,
  sortOptions,
  filterOptions,
  filterTitle,
  specialCategoryHandling,
}: MediaLayoutProps) {
  const filtersDisclosure = useDisclosure();
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
  useHotkeys(
    getShortcut('sortByPopularity')?.hotkey || '',
    () => {
      setSortBy('popularity');
      setSortDir('desc');
    },
    []
  );
  useHotkeys(
    getShortcut('sortByRating')?.hotkey || '',
    () => {
      setSortBy('vote_average');
      setSortDir('desc');
    },
    []
  );
  useHotkeys(
    getShortcut('sortByDate')?.hotkey || '',
    () => {
      setSortBy(title === 'Movies' ? 'release_date' : 'first_air_date');
      setSortDir('desc');
    },
    [title]
  );
  useHotkeys(
    getShortcut('sortByTitle')?.hotkey || '',
    () => {
      setSortBy(title === 'Movies' ? 'title' : 'name');
      setSortDir('asc');
    },
    [title]
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br', iconGradient)}>
            <MainIcon className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='heading gradient'>{title}</h1>
            <p className='text-Grey-400 text-sm'>{subtitle}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {!category && <SortBy options={sortOptions} defaultSort='popularity' />}
          <FiltersModal disclosure={filtersDisclosure} title={filterTitle} filterOptions={filterOptions} />
        </div>
      </div>

      <div className='flex flex-wrap gap-3'>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={cn(
                'group flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r ' + cat.gradient + ' border-white/20 text-white shadow-lg shadow-black/20'
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

      {/* Results Header */}
      <div className='border-Grey-800/50 flex items-center justify-between border-b pb-4'>
        <div>
          <h2 className='text-lg font-semibold text-white'>{getDisplayTitle()}</h2>
          <p className='text-Grey-400 mt-1 text-sm'>
            {category
              ? categories.find((c) => c.id === category)?.description
              : `Discover your next ${title.toLowerCase()} from our vast collection`}
          </p>
        </div>
        {category && (
          <button
            onClick={() => setCategory(null)}
            className='bg-Grey-800/50 hover:bg-Grey-700/50 text-Grey-400 border-Grey-700/50 hover:border-Grey-600/50 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all duration-200 hover:text-white'
          >
            <span>Show All</span>
            <span className='text-xs'>×</span>
          </button>
        )}
      </div>

      <Outlet />
    </div>
  );
}
