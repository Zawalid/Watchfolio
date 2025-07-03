import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { queryKeys } from '@/lib/react-query';
import { getSuggestions } from '@/lib/api/TMDB';
import { Input } from './ui/Input';
import { useNavigation } from '@/contexts/NavigationContext';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (query: string) => void;
}

export default function SearchInput({ searchQuery, setSearchQuery, onSearch }: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { registerNavigator, unregisterNavigator } = useNavigation();

  // Debounce the search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Use React Query to fetch and cache suggestions
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: queryKeys.suggestions(debouncedSearchQuery),
    queryFn: async () => {
      if (!debouncedSearchQuery.trim() || debouncedSearchQuery.length < 2) return [];
      try {
        return await getSuggestions(debouncedSearchQuery, 10);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
      }
    },
    enabled: debouncedSearchQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Clean up navigation registration on unmount
  useEffect(() => {
    if (!showSuggestions) unregisterNavigator('search-suggestions');
    return () => {
      unregisterNavigator('search-suggestions');
    };
  }, [showSuggestions, unregisterNavigator]);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions) return;

      // Prevent default behavior and stop propagation to block other navigators
      const navigationKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case 'ArrowDown':
          setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          if (selectedSuggestionIndex >= 0) {
            const selectedSuggestion = suggestions[selectedSuggestionIndex];
            onSearch(selectedSuggestion);
            setSearchQuery(selectedSuggestion);
            setShowSuggestions(false);
          } else if (searchQuery.trim()) {
            onSearch(searchQuery);
            setShowSuggestions(false);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedSuggestionIndex, searchQuery, onSearch, setSearchQuery]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSearch(suggestion);
      setSearchQuery(suggestion);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    },
    [onSearch, setSearchQuery]
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShowSuggestions = () => {
    if (!isLoading && suggestions.length > 0 && debouncedSearchQuery.trim().length >= 2) {
      setShowSuggestions(true);
      registerNavigator('search-suggestions');
    }
  }

  return (
    <div className='relative flex-1' ref={suggestionsRef}>
      <Input
        ref={inputRef}
        type='text'
        icon='search'
        parentClassname='flex-1'
        className='h-14 text-base'
        name='query'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSelectedSuggestionIndex(-1);
          handleShowSuggestions()
        }}
        onKeyDown={handleKeyDown}
        onFocus={handleShowSuggestions}
        label='Search For Movies Or Tv Shows'
        placeholder='eg. Breaking Bad, The Matrix, Avatar...'
        autoComplete='off'
      >
        {searchQuery && (
          <button
            className='text-Grey-400 hover:text-Grey-300 absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-lg p-1 transition-all duration-200 hover:bg-white/10'
            type='button'
            onClick={() => {
              setSearchQuery('');
              onSearch('');
              setShowSuggestions(false);
              setSelectedSuggestionIndex(-1);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-5 w-5'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        )}
      </Input>

      {/* Auto-completion Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className='bg-Grey-900/95 absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 shadow-2xl backdrop-blur-lg'
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={`${suggestion}-${index}`}
                type='button'
                className={`w-full px-4 py-3 text-left text-base transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  index === selectedSuggestionIndex
                    ? 'bg-Primary-500/20 text-Primary-300 border-Primary-500 border-l-2'
                    : 'text-Grey-200 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='flex items-center gap-3'>
                  <SearchIcon className='h-4 w-4 opacity-60' />
                  <span className='flex-1 truncate'>{suggestion}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
