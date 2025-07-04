import { Outlet } from 'react-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDisclosure } from '@heroui/modal';
import { parseAsString, useQueryState } from 'nuqs';
import { Tabs } from '@/components/ui/Tabs';
import FiltersModal from '@/components/FiltersModal';
import { getShortcut } from '@/utils/keyboardShortcuts';
import SortBy from '@/components/SortBy';

export default function MoviesLayout() {
  const filtersDisclosure = useDisclosure();
  const [, setSortBy] = useQueryState('sort_by', parseAsString.withDefault('popularity'));
  const [, setSortDir] = useQueryState('sort_dir', parseAsString.withDefault('desc'));

  // Toggle filters with hotkey
  useHotkeys(
    getShortcut('toggleFilters')?.hotkey || '',
    () => (filtersDisclosure.isOpen ? filtersDisclosure.onClose() : filtersDisclosure.onOpen()),
    [filtersDisclosure.isOpen]
  );

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
      setSortBy('release_date');
      setSortDir('desc');
    },
    []
  );
  useHotkeys(
    getShortcut('sortByTitle')?.hotkey || '',
    () => {
      setSortBy('title');
      setSortDir('asc');
    },
    []
  );

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <Tabs
          tabs={[
            { label: 'Popular', value: 'popular', link: '/movies/popular' },
            { label: 'Top Rated', value: 'top-rated', link: '/movies/top-rated' },
            { label: 'Now Playing', value: 'now-playing', link: '/movies/now-playing' },
            { label: 'Upcoming', value: 'upcoming', link: '/movies/upcoming' },
          ]}
        />
        <div className='flex items-center gap-3'>
          <SortBy
            options={[
              { key: 'popularity', label: 'Popularity' },
              { key: 'vote_average', label: 'Rating' },
              { key: 'first_air_date', label: 'Air Date' },
              { key: 'name', label: 'Title' },
            ]}
            defaultSort='popularity'
          />
          <FiltersModal
            disclosure={filtersDisclosure}
            title='Movie Filters'
            filterOptions={['genres', 'networks', 'language', 'ratingRange', 'releaseYear']}
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
