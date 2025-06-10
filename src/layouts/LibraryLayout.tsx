import { Outlet } from 'react-router';
import { GalleryVerticalEnd, Grid, List, Star, HelpCircle } from 'lucide-react';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import { useQueryState } from 'nuqs';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { USER_MEDIA_STATUS } from '@/utils/constants';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';

export default function LibraryLayout() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [viewMode, setViewMode] = useQueryState('view', { defaultValue: 'grid' });
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getCount } = useLibraryStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(!showKeyboardShortcuts);
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'g': {
          if (e.shiftKey) break;
          // Wait for second key
          const timeout = setTimeout(() => {
            document.removeEventListener('keydown', handleSecondKey);
          }, 1000);

          const handleSecondKey = (secondE: KeyboardEvent) => {
            clearTimeout(timeout);
            document.removeEventListener('keydown', handleSecondKey);

            if (secondE.key === 'g') {
              secondE.preventDefault();
              setViewMode('grid');
            } else if (secondE.key === 'l') {
              secondE.preventDefault();
              setViewMode('list');
            }
          };

          document.addEventListener('keydown', handleSecondKey);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showKeyboardShortcuts, setViewMode]);

  return (
    <div className='flex h-full flex-col gap-6 lg:flex-row lg:gap-10'>
      <Tabs
        className='flex-col bg-transparent lg:flex-col'
        tabClassName='px-3 lg:px-4 text-sm lg:text-base'
        tabs={[
          {
            label: `All (${getCount('all')})`,
            icon: <GalleryVerticalEnd className='size-4' />,
            includes: true,
            value: 'all',
            link: '/library/all',
          },
          ...USER_MEDIA_STATUS.map((status) => {
            const IconComponent = status.icon;
            return {
              label: `${status.label} (${getCount(status.value)})`,
              icon: <IconComponent className='size-4' />,
              value: status.value,
              link: `/library/${status.value}`,
            };
          }),
          {
            label: `Favorites (${getCount('favorites')})`,
            icon: <Star className='size-4' />,
            value: 'favorites',
            link: '/library/favorites',
          },
        ]}
      />

      <div className='flex flex-1 flex-col gap-6 lg:gap-10'>
        <div className='bg-background/80 sticky top-0 z-10 flex flex-col gap-4 border-b border-white/5 pb-4 backdrop-blur-md lg:mb-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:pb-6'>
          <form
            className='w-full lg:w-1/2'
            onSubmit={(e) => {
              e.preventDefault();
              const query = (e.target as HTMLFormElement).query.value.trim();
              if (query === '') return;
              setQuery(query);
            }}
          >
            <Input
              type='text'
              icon='search'
              parentClassname='w-full flex-1'
              name='search'
              defaultValue={query}
              label='Search Your Library'
              placeholder='Search by title...'
              ref={searchInputRef}
            />
          </form>
          <div className='flex w-full gap-2 lg:w-auto lg:min-w-fit'>
            <Select
              placeholder='Sort by'
              selectedKeys={sortBy ? [sortBy] : []}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
              classNames={{
                trigger: 'bg-white/5 border-2 border-white/5 min-w-fit backdrop-blur-md hover:bg-white/10!',
                popoverContent: 'text-default-500 bg-blur backdrop-blur-md',
                base: 'w-full lg:w-40',
                selectorIcon: 'text-Grey-600',
                listbox: '[&:>li]-data-[hover=true]:bg-blur!',
              }}
            >
              <SelectItem key='recent'>Recently Added</SelectItem>
              <SelectItem key='title'>Title A-Z</SelectItem>
              <SelectItem key='rating'>My Rating</SelectItem>
              <SelectItem key='date'>Release Date</SelectItem>
            </Select>

            <div className='*-data-[hover=true]:bg-blur flex gap-2 *:border-white/5 *:backdrop-blur-md'>
              <Button
                isIconOnly
                variant='ghost'
                className='text-Grey-400 hover:text-Primary-400 h-10 w-10 transition-all duration-200 hover:bg-white/5'
                onPress={() => setShowKeyboardShortcuts(true)}
                aria-label='Show keyboard shortcuts'
              >
                <HelpCircle className='size-4' />
              </Button>

              <Button
                isIconOnly
                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                className={`${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5!'} hidden sm:flex`}
                onPress={() => setViewMode('grid')}
                aria-label='Grid view'
              >
                <Grid className='size-4' />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                className={viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5!'}
                onPress={() => setViewMode('list')}
                aria-label='List view'
              >
                <List className='size-4' />
              </Button>
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
    </div>
  );
}
