import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useIsFetching } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { parseAsInteger, useQueryState } from 'nuqs';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search as SearchIcon, Film, Star, Heart,Tv } from 'lucide-react';
import { WelcomeBanner } from '@/components/ui/WelcomeBanner';
import { search } from '@/lib/api/TMDB';
import MediaCardsList from '@/components/media/MediaCardsList';
import { queryKeys } from '@/lib/react-query';
import SearchInput from '@/components/SearchInput';
import { AnimatedRing } from '@/components/ui/AnimatedRing';

export default function Search() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const isFetching = useIsFetching({ queryKey: ['search', query, page] }) > 0;
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  // Sync searchQuery with query state
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Handle search submission
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setQuery(searchTerm);
      setPage(1);
    },
    [setQuery, setPage]
  );

  // Check if user came from onboarding
  const fromOnboarding = location.state?.fromOnboarding;
  const onboardingAction = location.state?.action;

  useEffect(() => {
    if (fromOnboarding && onboardingAction === 'Search Now') setShowWelcome(true);
  }, [fromOnboarding, onboardingAction, location.pathname, location.search]);

  return (
    <div className='flex h-full flex-col gap-8'>
      <AnimatePresence>
        <WelcomeBanner
          title='Welcome to Search!'
          description='Discover your next favorite movie or show. Search our extensive database and add content to your personal collection.'
          icon={<Sparkles className='text-Primary-400 h-6 w-6' />}
          variant='default'
          onDismiss={() => setShowWelcome(false)}
          show={showWelcome}
        />
      </AnimatePresence>

      <div className='mx-auto w-full max-w-2xl'>
        <form
          className='flex gap-3'
          id='search-form'
          onSubmit={(e) => {
            e.preventDefault();
            const searchTerm = searchQuery.trim();
            if (searchTerm === '') return;
            handleSearch(searchTerm);
          }}
        >
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />

          <Button
            className='shadow-Primary-500/25 hover:shadow-Primary-500/40 h-14 px-8 font-semibold shadow-lg transition-all duration-300'
            type='submit'
            color='primary'
            size='lg'
            isLoading={isFetching}
          >
            {isFetching ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      
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
        <motion.div
          className='flex flex-1 flex-col items-center justify-center px-8 text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className='relative mb-8'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <AnimatedRing
              color='primary'
              size='md'
              ringCount={3}
              animationSpeed='normal'
              glowEffect={true}
              floatingIcons={[
                {
                  icon: <Film className='h-4 w-4' />,
                  position: 'top-right',
                  color: 'secondary',
                  delay: 0,
                },
                {
                  icon: <Tv className='h-4 w-4' />,
                  position: 'top-left',
                  color: 'tertiary',
                  delay: 0.5,
                },
                {
                  icon: <Star className='h-4 w-4' />,
                  position: 'bottom-left',
                  color: 'warning',
                  delay: 1,
                },
                {
                  icon: <Heart className='h-4 w-4' />,
                  position: 'bottom-right',
                  color: 'error',
                  delay: 1.5,
                },
              ]}
            >
              <SearchIcon className='text-Primary-400 h-8 w-8' />
            </AnimatedRing>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className='max-w-lg space-y-4'
          >
            <h2 className='gradient-heading'>
              What's Your Next
              <span className='gradient'>Favorite?</span>
            </h2>
            <p className='text-Grey-300 text-base leading-relaxed'>
              Search through thousands of movies and TV shows to discover your next favorite and build your personal
              collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className='mt-10 space-y-4'
          >
            <div className='flex items-center justify-center gap-2'>
              <div className='to-Grey-700/50 h-px max-w-[60px] flex-1 bg-gradient-to-r from-transparent'></div>
              <p className='text-Grey-300 text-sm font-medium tracking-wider uppercase'>Popular Searches</p>
              <div className='to-Grey-700/50 h-px max-w-[60px] flex-1 bg-gradient-to-l from-transparent'></div>
            </div>

            <div className='flex flex-wrap justify-center gap-2'>
              {['Breaking Bad', 'The Matrix', 'Stranger Things', 'Inception', 'The Office', 'Avatar'].map(
                (suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    className='selectable-button text-sm'
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8 + index * 0.1,
                      type: 'spring',
                      stiffness: 400,
                      damping: 15,
                    }}
                    onClick={() => {
                      handleSearch(suggestion);
                    }}
                  >
                    {suggestion}
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
