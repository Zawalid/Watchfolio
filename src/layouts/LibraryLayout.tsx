import { Outlet } from 'react-router';
import { Grid, List } from 'lucide-react';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import { useQueryState } from 'nuqs';
import { useLibraryStore } from '@/stores/useLibraryStore';

export default function LibraryLayout() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [viewMode, setViewMode] = useQueryState('view', { defaultValue: 'list' });

  const { getCount } = useLibraryStore();

  return (
    <div className='flex h-full gap-10'>
      <Tabs
        className='flex-col bg-transparent'
        tabs={[
          { label: `All (${getCount('all')})`, value: 'all', link: '/library/all' },
          { label: `Watching (${getCount('watching')})`, value: 'watching', link: '/library/watching' },
          { label: `Plan to Watch (${getCount('will-watch')})`, value: 'will-watch', link: '/library/plan-to-watch' },
          { label: `Completed (${getCount('watched')})`, value: 'watched', link: '/library/completed' },
          { label: `On Hold (${getCount('on-hold')})`, value: 'on-hold', link: '/library/on-hold' },
          { label: `Dropped (${getCount('dropped')})`, value: 'dropped', link: '/library/dropped' },
          { label: `Favorites (${getCount('favorites')})`, value: 'favorites', link: '/library/favorites' },
        ]}
      />

      <div className='flex flex-1 flex-col gap-10'>
        <div className='flex items-center justify-between gap-5'>
          <form
            className='w-1/2'
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
            />
          </form>
          <div className='flex min-w-fit gap-2'>
            <Select
              placeholder='Sort by'
              selectedKeys={sortBy ? [sortBy] : []}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
              classNames={{
                trigger: 'bg-white/5 border-2 border-white/5 min-w-fit backdrop-blur-md hover:bg-white/10!',
                popoverContent: 'text-default-500 bg-white/5 backdrop-blur-md',
                base: 'w-40',
                selectorIcon: 'text-Grey-600',
              }}
            >
              <SelectItem key='recent'>Recently Added</SelectItem>
              <SelectItem key='title'>Title A-Z</SelectItem>
              <SelectItem key='rating'>My Rating</SelectItem>
              <SelectItem key='date'>Release Date</SelectItem>
            </Select>

            <div className='flex gap-2 *:border-white/5 *:backdrop-blur-md'>
              <Button
                isIconOnly
                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                className={viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5!'}
                onPress={() => setViewMode('grid')}
              >
                <Grid className='size-4' />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                className={viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5!'}
                onPress={() => setViewMode('list')}
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
    </div>
  );
}
