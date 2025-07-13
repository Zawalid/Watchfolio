import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useIsFetching } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search as SearchIcon, Film, Star, Heart, Tv, Users } from 'lucide-react';
import { WelcomeBanner } from '@/components/ui/WelcomeBanner';
import { search, searchMovie, searchPerson, searchTvShows } from '@/lib/api/TMDB';
import MediaCardsList from '@/components/media/MediaCardsList';
import CelebritiesCardsList from '@/components/celebrity/CelebritiesCardsList';
import { queryKeys } from '@/lib/react-query';
import SearchInput from '@/components/SearchInput';
import { AnimatedRing } from '@/components/ui/AnimatedRing';
import { cn } from '@/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

const SEARCH_TABS = [
  {
    id: 'all',
    label: 'All',
    icon: SearchIcon,
    description: 'Movies, TV shows & celebrities',
  },
  {
    id: 'movie',
    label: 'Movies',
    icon: Film,
    description: 'Films and cinema',
  },
  {
    id: 'tv',
    label: 'TV Shows',
    icon: Tv,
    description: 'Series and episodes',
  },
  {
    id: 'person',
    label: 'Celebrities',
    icon: Users,
    description: 'Actors, directors & crew',
  },
];

export default function Search() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [contentType, setContentType] = useQueryState('type', parseAsString.withDefault('all'));
  const isFetching = useIsFetching({ queryKey: ['search', query, page, contentType] }) > 0;
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  
  usePageTitle(`Search results for ${query}`);

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

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string) => {
      setContentType(tabId);
      setPage(1); // Reset to first page when changing tabs
    },
    [setContentType, setPage]
  );

  // Get query function based on content type
  const getQueryFunction = useCallback(() => {
    switch (contentType) {
      case 'movie':
        return () => searchMovie(query, page);
      case 'tv':
        return () => searchTvShows(query, page);
      case 'person':
        return () => searchPerson(query, page);
      default:
        return () => search(query, page);
    }
  }, [contentType, query, page]);

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
          description='Discover your next favorite movie, TV show, or talented celebrity. Search our extensive database and add content to your personal collection.'
          icon={<Sparkles className='text-Primary-400 h-6 w-6' />}
          variant='default'
          onDismiss={() => setShowWelcome(false)}
          show={showWelcome}
        />
      </AnimatePresence>

      <div className='mx-auto flex w-full max-w-2xl flex-col gap-5'>
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
            className='button-primary h-14'
            startContent={<SearchIcon className='h-5 w-5' />}
            type='submit'
            size='lg'
            isLoading={isFetching}
          >
            {isFetching ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {/* Search Tabs - only show when there's a query */}
        {query && (
          <motion.div
            className='border-Grey-800/50 flex items-center gap-2 self-center border-b pb-4'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {SEARCH_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = contentType === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-Primary-500/20 text-Primary-300 border-Primary-500/50 border'
                      : 'text-Grey-400 hover:text-Grey-200 hover:bg-Grey-800/40'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      {query ? (
        <div>
          {contentType === 'person' ? (
            <CelebritiesCardsList
              queryOptions={{
                queryKey: queryKeys.search(contentType, query, page),
                queryFn: getQueryFunction() as () => Promise<TMDBResponse<Person>>,
                enabled: !!query,
              }}
            />
          ) : (
            <MediaCardsList
              queryOptions={{
                queryKey: queryKeys.search(contentType, query, page),
                queryFn: getQueryFunction() as () => Promise<TMDBResponse<Media>>,
                enabled: !!query,
              }}
            />
          )}
        </div>
      ) : (
        <NoSearchQuery handleSearch={handleSearch} />
      )}
    </div>
  );
}

function NoSearchQuery({ handleSearch }: { handleSearch: (searchTerm: string) => void }) {
  return (
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
        <h2 className='heading'>
          What's Your Next
          <span className='gradient'>Favorite?</span>
        </h2>
        <p className='text-Grey-300 text-base leading-relaxed'>
          Search through thousands of movies, TV shows, and celebrities to discover your next favorite and build your
          personal collection.
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
          {['Breaking Bad', 'The Matrix', 'Leonardo DiCaprio', 'Stranger Things', 'Greta Gerwig', 'Avatar'].map(
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
  );
}
