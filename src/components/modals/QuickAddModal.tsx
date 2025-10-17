import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X as XIcon, Search as SearchIcon, Film, Tv, Calendar, Star, Heart } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { search } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigation } from '@/contexts/NavigationContext';
import { useMediaStatusModal } from '@/contexts/MediaStatusModalContext';
import { useLibraryItem } from '@/hooks/library/useLibraryQueries';
import { getTmdbImage } from '@/utils/media';
import { generateMediaId } from '@/utils/library';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { GENRES } from '@/utils/constants/TMDB';
import { cn } from '@/utils';
import { useQuickAddDisclosure } from '@/stores/useUIStore';

export default function QuickAddModal() {
  const disclosure = useQuickAddDisclosure();
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
    .slice(0, 10) as Media[];

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

  const handleSelectMedia = useCallback((media: Media, libraryItem?: LibraryMedia) => {
    openModal(media, libraryItem);
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
      size='3xl'
      classNames={{
        base: 'max-h-[700px]',
        body: 'p-0',
      }}
    >
      <div className='flex flex-col h-full min-h-[550px]'>
        {/* Header */}
        <div className='border-b border-white/10 px-6 py-5'>
          <div className='mb-4'>
            <h2 className='text-xl font-bold text-Primary-50'>Quick Add Media</h2>
            <p className='text-Grey-400 text-sm mt-1'>Search and add movies or TV shows to your library</p>
          </div>

          {/* Search Input */}
          <Input
            ref={inputRef}
            type='text'
            icon='search'
            className='h-14 text-base'
            name='quick-add-search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            label='Search for movies or TV shows'
            placeholder='e.g., Breaking Bad, The Matrix, Inception...'
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
        <div ref={resultsRef} className='flex-1 overflow-y-auto px-4 py-2'>
          {!query ? (
            <EmptyState />
          ) : isLoading ? (
            <LoadingState />
          ) : results.length > 0 ? (
            <div className='space-y-1'>
              {results.map((media: Media, index: number) => (
                <ResultItem
                  key={`${media.id}-${index}`}
                  media={media}
                  index={index}
                  isSelected={selectedIndex === index}
                  onSelect={handleSelectMedia}
                  getMediaIcon={getMediaIcon}
                  getMediaTitle={getMediaTitle}
                  getMediaYear={getMediaYear}
                />
              ))}
            </div>
          ) : (
            <NoResults query={query} />
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-white/10 px-6 py-3 bg-Grey-900/50'>
          <div className='flex items-center justify-center gap-4 text-xs text-Grey-400'>
            <div className='flex items-center gap-1.5'>
              <kbd className='kbd kbd-sm'>↑</kbd>
              <kbd className='kbd kbd-sm'>↓</kbd>
              <span>to navigate</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <kbd className='kbd kbd-sm'>Enter</kbd>
              <span>to select</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <kbd className='kbd kbd-sm'>Esc</kbd>
              <span>to close</span>
            </div>
          </div>
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
          className='h-24 rounded-lg bg-white/5 animate-pulse'
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

interface ResultItemProps {
  media: Media;
  index: number;
  isSelected: boolean;
  onSelect: (media: Media, libraryItem?: LibraryMedia) => void;
  getMediaIcon: (media: Media) => typeof Film | typeof Tv;
  getMediaTitle: (media: Media) => string;
  getMediaYear: (media: Media) => number | null;
}

function ResultItem({ media, index, isSelected, onSelect, getMediaIcon, getMediaTitle, getMediaYear }: ResultItemProps) {
  const mediaType = 'title' in media ? 'movie' : 'tv';
  const mediaId = generateMediaId({ ...media, media_type: mediaType });
  const { data: libraryItem } = useLibraryItem(mediaId);

  const Icon = getMediaIcon(media);
  const title = getMediaTitle(media);
  const year = getMediaYear(media);
  const rating = media.vote_average;

  // Check if item is in library
  const inLibrary = libraryItem && (libraryItem.status !== 'none' || libraryItem.userRating);

  // Get status configuration
  const status = LIBRARY_MEDIA_STATUS.find(
    (s) => s.value === libraryItem?.status || (libraryItem?.isFavorite && s.value === 'favorites')
  );

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => onSelect(media, libraryItem || undefined)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
        'hover:bg-white/5',
        isSelected && 'bg-Primary-500/20 ring-2 ring-Primary-500/50',
        inLibrary && 'border border-Secondary-500/20 bg-Secondary-500/5'
      )}
    >
      {/* Poster */}
      <img
        src={getTmdbImage(media, 'w200')}
        alt={title}
        className='w-14 h-20 rounded object-cover flex-shrink-0'
      />

      {/* Info */}
      <div className='flex-1 min-w-0 text-left'>
        <div className='flex items-center gap-2 mb-1'>
          <Icon className='h-3.5 w-3.5 text-Grey-400 flex-shrink-0' />
          <h3 className='text-sm font-semibold text-Grey-50 truncate'>
            {title}
          </h3>
        </div>
        <div className='flex items-center gap-3 text-xs text-Grey-400 mb-1.5'>
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
        {/* Genre Pills */}
        {media.genre_ids && media.genre_ids.length > 0 && (
          <div className='flex items-center gap-1.5 flex-wrap'>
            {media.genre_ids.slice(0, 2).map((genreId: number) => {
              const genre = GENRES.find((g: { id: number; label: string; slug: string }) => g.id === genreId);
              return genre ? (
                <span
                  key={genreId}
                  className='px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-Grey-300'
                >
                  {genre.label}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Library Status & Indicators */}
      <div className='flex items-center gap-2 flex-shrink-0'>
       
        {/* User Rating */}
        {libraryItem?.userRating && (
          <div className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-Primary-500/15 border border-Primary-400/30'>
            <Heart className='h-3 w-3 text-Primary-300 fill-current' />
            <span className='text-xs font-semibold text-Primary-200'>{libraryItem.userRating}</span>
          </div>
        )}

        {/* Status Badge */}
        {status && (
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm',
              status.className
            )}
          >
            <status.icon className='h-3 w-3' />
            <span>{status.label}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
