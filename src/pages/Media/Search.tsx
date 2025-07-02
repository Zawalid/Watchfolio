import { useIsFetching } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { search } from '@/lib/api/TMDB';
import MediaCardsList from '../../components/media/MediaCardsList';
import { queryKeys } from '@/lib/react-query';

export default function Search() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const isFetching = useIsFetching({ queryKey: ['search', query, page] }) > 0;
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if user came from onboarding
  const fromOnboarding = location.state?.fromOnboarding;
  const onboardingAction = location.state?.action;

  console.log(location.state);

  // Show welcome banner for onboarding users
  useEffect(() => {
    if (fromOnboarding && onboardingAction === 'Search Now') setShowWelcome(true);
  }, [fromOnboarding, onboardingAction, location.pathname, location.search]);

  return (
    <div className='flex h-full flex-col gap-12'>
      {/* Welcome Banner for Onboarding Users */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='border-Primary-500/20 from-Primary-500/10 to-Secondary-500/10 relative overflow-hidden rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'
          >
            <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50' />

            <div className='relative flex items-center gap-4'>
              <div className='bg-Grey-800 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10'>
                <Sparkles className='text-Primary-400 h-5 w-5' />
              </div>

              <div className='flex-1'>
                <h3 className='mb-1 text-base font-bold text-white'>Welcome to Search!</h3>
                <p className='text-Grey-300 text-sm leading-relaxed'>
                  Find movies and shows to add to your collection. Try searching for something you've recently watched.
                </p>
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                className='text-Grey-400 hover:text-Grey-300 rounded-lg p-1 transition-colors hover:bg-white/10'
                aria-label='Dismiss'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        className='flex w-3/5 gap-2 self-center'
        id='search-form'
        onSubmit={(e) => {
          e.preventDefault();
          const query = (e.target as HTMLFormElement).query.value.trim();
          if (query === '') return;
          setQuery(query);
          setPage(1);
        }}
      >
        <Input
          type='text'
          icon='search'
          parentClassname='flex-1'
          className='pt-7'
          name='query'
          defaultValue={query}
          label='Search For Movies Or Tv Shows'
          placeholder='eg. The Wire'
        >
          <button
            className={`icon text-Grey-100 absolute top-1/2 right-4 z-20 -translate-y-1/2 cursor-pointer ${!query ? 'hidden' : ''}`}
            type='reset'
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </Input>

        <Button
          className={`h-auto ${isFetching ? 'flex items-center gap-1' : ''}`}
          type='submit'
          color='primary'
          size='md'
          isLoading={isFetching}
        >
          {isFetching ? 'Searching...' : 'Search'}
        </Button>
      </form>
      {query ? (
        <MediaCardsList
          queryOptions={{
            queryKey: queryKeys.search(query, page),
            queryFn: async () => await search(query, page),
            enabled: !!query,
          }}
          errorMessage='Something went wrong while searching. Please try again later.'
        />
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <h2 className='text-Grey-50 text-2xl font-semibold'>Start Searching...</h2>
          <p className='text-Grey-300 leading-relaxed'>
            It looks like you haven&apos;t searched for anything yet. Start typing to find what you&apos;re looking for!
          </p>
        </div>
      )}
    </div>
  );
}
