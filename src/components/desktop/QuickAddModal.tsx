import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X as XIcon, Search as SearchIcon, Film, Tv, Calendar, Star } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { search } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigation } from '@/contexts/NavigationContext';
import { useMediaStatusModal } from '@/contexts/MediaStatusModalContext';
import { getTmdbImage } from '@/utils/media';
import { cn } from '@/utils';

interface QuickAddModalProps {
  disclosure: Disclosure;
}

export default function QuickAddModal({ disclosure }: QuickAddModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { registerNavigation, unregisterNavigation } = useNavigation();
  const { openModal } = useMediaStatusModal();

  const debouncedQuery = useDebounce(query, 200);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.search('all', debouncedQuery),
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { results: [], total_results: 0 };
      return search(debouncedQuery, 1);
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const results = (data?.results || [])
    .filter((item: Media | Person) => !('known_for' in item))
    .slice(0, 8) as Media[];

  useEffect(() => {
    if (disclosure.isOpen) {
      registerNavigation('quick-add-modal');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      unregisterNavigation('quick-add-modal');
      setQuery('');
      setSelectedIndex(0);
    }
    return () => unregisterNavigation('quick-add-modal');
  }, [disclosure.isOpen, registerNavigation, unregisterNavigation]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  const handleSelectMedia = useCallback((media: Media) => {
    openModal(media);
    disclosure.onClose();
  }, [openModal, disclosure]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      disclosure.onClose();
      return;
    }

    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectMedia(results[selectedIndex]);
      }
    }
  }, [results, selectedIndex, disclosure, handleSelectMedia]);

  const handleClearInput = useCallback(() => {
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  }, []);

  const getMediaIcon = (media: Media) => {
    const mediaType = 'title' in media ? 'movie' : 'tv';
    return mediaType === 'movie' ? Film : Tv;
  };

  const getMediaTitle = (media: Media) => {
    return 'title' in media ? media.title : media.name;
  };

  const getMediaYear = (media: Media) => {
    const date = 'release_date' in media ? media.release_date : media.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  return (
    <Modal
      disclosure={disclosure}
      size='2xl'
      classNames={{
        base: 'max-h-[600px]',
        body: 'p-0',
      }}
    >
      <div className='flex flex-col h-full'>
        {/* Search Input */}
        <div className='px-4 pt-4 pb-3'>
          <Input
            ref={inputRef}
            type='text'
            icon='search'
            className='h-14 text-base'
            name='quick-add-search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search movies or TV shows...'
            autoComplete='off'
          >
            {query && (
              <button
                className='text-Grey-400 hover:text-Grey-300 absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-lg p-1 transition-all duration-200 hover:bg-white/10'
                type='button'
                onClick={handleClearInput}
                aria-label='Clear search'
              >
                <XIcon className='h-5 w-5' />
              </button>
            )}
          </Input>
        </div>

        {/* Results */}
        <div ref={resultsRef} className='flex-1 overflow-y-auto px-2 pb-2'>
          {!query ? (
            <EmptyState />
          ) : isLoading ? (
            <LoadingState />
          ) : results.length > 0 ? (
            <div className='space-y-1'>
              {results.map((media: Media, index: number) => {
                const Icon = getMediaIcon(media);
                const title = getMediaTitle(media);
                const year = getMediaYear(media);
                const rating = media.vote_average;
                const isSelected = selectedIndex === index;

                return (
                  <motion.button
                    key={`${media.id}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => handleSelectMedia(media)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                      'hover:bg-white/5',
                      isSelected && 'bg-Primary-500/20 ring-2 ring-Primary-500/50'
                    )}
                  >
                    {/* Poster */}
                    <img
                      src={getTmdbImage(media, 'w200')}
                      alt={title}
                      className='w-12 h-16 rounded object-cover flex-shrink-0'
                    />

                    {/* Info */}
                    <div className='flex-1 min-w-0 text-left'>
                      <div className='flex items-center gap-2 mb-1'>
                        <Icon className='h-3.5 w-3.5 text-Grey-400 flex-shrink-0' />
                        <h3 className='text-sm font-semibold text-Grey-50 truncate'>
                          {title}
                        </h3>
                      </div>
                      <div className='flex items-center gap-3 text-xs text-Grey-400'>
                        {year && (
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            <span>{year}</span>
                          </div>
                        )}
                        {rating && rating > 0 && (
                          <div className='flex items-center gap-1'>
                            <Star className='h-3 w-3 text-Warning-400 fill-current' />
                            <span>{rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow hint */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='text-Primary-400 text-xs font-medium'
                      >
                        Press Enter
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <NoResults query={query} />
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-white/10 px-4 py-2'>
          <p className='text-Grey-500 text-xs text-center'>
            <kbd className='kbd kbd-sm'>↑</kbd> <kbd className='kbd kbd-sm'>↓</kbd> navigate •{' '}
            <kbd className='kbd kbd-sm'>Enter</kbd> select •{' '}
            <kbd className='kbd kbd-sm'>Esc</kbd> close
          </p>
        </div>
      </div>
    </Modal>
  );
}

function EmptyState() {
  return (
    <motion.div
      className='flex flex-col items-center justify-center py-12 text-center px-4'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='bg-Primary-500/10 rounded-full p-4 mb-4'>
        <SearchIcon className='text-Primary-400 h-8 w-8' />
      </div>
      <h3 className='text-base font-semibold text-Grey-200 mb-1'>
        Quick Add Media
      </h3>
      <p className='text-Grey-400 text-sm'>
        Type to search and quickly add to your library
      </p>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className='space-y-2 px-2'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='h-20 rounded-lg bg-white/5 animate-pulse'
        />
      ))}
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <motion.div
      className='flex flex-col items-center justify-center py-12 text-center px-4'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='bg-Grey-800/50 rounded-full p-4 mb-4'>
        <SearchIcon className='text-Grey-400 h-8 w-8' />
      </div>
      <h3 className='text-base font-semibold text-Grey-200 mb-1'>
        No results
      </h3>
      <p className='text-Grey-400 text-sm'>
        No matches for <span className='text-Primary-300'>"{query}"</span>
      </p>
    </motion.div>
  );
}
