import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, X as XIcon, Trash2 } from 'lucide-react';
import { queryKeys } from '@/lib/react-query';
import { getSuggestions } from '@/lib/api/TMDB';
import { Input } from '@/components/ui/Input';
import { useNavigation } from '@/contexts/NavigationContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useQueryState } from 'nuqs';

const HISTORY_KEY = 'search-history';
const HISTORY_LIMIT = 12;
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;
const CACHE_TIME = 1000 * 60 * 5;

export default function SearchInput() {
  const [query, setQuery] = useQueryState('query');
  const [inputValue, setInputValue] = useState(query || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [history, setHistory] = useLocalStorageState<string[]>(HISTORY_KEY, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { registerNavigator, unregisterNavigator } = useNavigation();

  const debouncedInputValue = useDebounce(inputValue, DEBOUNCE_DELAY);

  const queryOptions = useMemo(
    () => ({
      queryKey: queryKeys.suggestions(debouncedInputValue),
      queryFn: async () => {
        if (!debouncedInputValue.trim() || debouncedInputValue.length < MIN_QUERY_LENGTH) return [];
        try {
          return await getSuggestions(debouncedInputValue, 10);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          return [];
        }
      },
      enabled: debouncedInputValue.trim().length >= MIN_QUERY_LENGTH,
      staleTime: CACHE_TIME,
      refetchOnWindowFocus: false,
    }),
    [debouncedInputValue]
  );

  const { data: suggestions = [], isLoading } = useQuery(queryOptions);

  // Optimized search handler with history management
  const handleSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase());
        return [trimmedQuery, ...filtered].slice(0, HISTORY_LIMIT);
      });
      setInputValue(trimmedQuery);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      setQuery(trimmedQuery);
    },
    [setHistory, setQuery]
  );

  useEffect(() => {
    if (showSuggestions) {
      registerNavigator('search-suggestions');
    } else {
      unregisterNavigator('search-suggestions');
    }
    return () => unregisterNavigator('search-suggestions');
  }, [registerNavigator, showSuggestions, unregisterNavigator]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions) return;
      const showingHistory = !inputValue && history.length > 0;
      const totalOptions = showingHistory ? history.length : suggestions.length;
      const isNavigationKey = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key);
      if (isNavigationKey) {
        e.preventDefault();
        e.stopPropagation();
      }
      switch (e.key) {
        case 'ArrowDown':
          setSelectedSuggestionIndex((prev) => (prev < totalOptions - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1));
          break;
        case 'Enter':
          if (selectedSuggestionIndex >= 0) {
            const selectedItem = showingHistory
              ? history[selectedSuggestionIndex]
              : suggestions[selectedSuggestionIndex];
            setInputValue(selectedItem);
            handleSearch(selectedItem);
          } else if (inputValue.trim()) {
            handleSearch(inputValue);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestions, suggestions, selectedSuggestionIndex, inputValue, handleSearch, history]
  );

  const handleClearInput = useCallback(() => {
    setInputValue('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideSuggestions = suggestionsRef.current && !suggestionsRef.current.contains(target);
      const isOutsideInput = inputRef.current && !inputRef.current.contains(target);
      if (isOutsideSuggestions && isOutsideInput) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShowSuggestions = useCallback(() => {
    const shouldShowSuggestions =
      !isLoading &&
      ((suggestions.length > 0 && debouncedInputValue.trim().length >= MIN_QUERY_LENGTH) ||
        (!inputValue && history.length > 0));
    if (shouldShowSuggestions) {
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    }
  }, [isLoading, suggestions.length, debouncedInputValue, inputValue, history.length]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setSelectedSuggestionIndex(-1);
      setTimeout(handleShowSuggestions, 0);
    },
    [handleShowSuggestions]
  );

  const showingHistory = !inputValue && history.length > 0;
  const shouldShowDropdown =
    showSuggestions &&
    (showingHistory || (suggestions.length > 0 && debouncedInputValue.trim().length >= MIN_QUERY_LENGTH));

  return (
    <div className='relative flex-1' ref={suggestionsRef}>
      <Input
        ref={inputRef}
        type='text'
        icon='search'
        parentClassname='flex-1'
        className='h-14 text-base'
        name='query'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleShowSuggestions}
        label='Search For Movies, TV Shows & Celebrities'
        placeholder='eg. Breaking Bad, Leonardo DiCaprio, The Matrix...'
        autoComplete='off'
      >
        {inputValue && (
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
      <AnimatePresence>
        {shouldShowDropdown && (
          <SuggestionsDropdown
            showingHistory={showingHistory}
            history={history}
            suggestions={suggestions}
            selectedIndex={selectedSuggestionIndex}
            onSuggestionClick={(suggestion: string) => {
              setInputValue(suggestion);
              handleSearch(suggestion);
            }}
            onClearHistory={() => setHistory([])}
            onRemoveHistoryItem={(item: string) => {
              setHistory((prev) => prev.filter((h) => h.toLowerCase() !== item.toLowerCase()));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Memoized suggestions dropdown component
const SuggestionsDropdown = React.memo(
  ({
    showingHistory,
    history,
    suggestions,
    selectedIndex,
    onSuggestionClick,
    onClearHistory,
    onRemoveHistoryItem,
  }: {
    showingHistory: boolean;
    history: string[];
    suggestions: string[];
    selectedIndex: number;
    onSuggestionClick: (suggestion: string) => void;
    onClearHistory: () => void;
    onRemoveHistoryItem: (item: string) => void;
  }) => {
    const handleRemoveClick = useCallback(
      (e: React.MouseEvent, item: string) => {
        e.stopPropagation();
        onRemoveHistoryItem(item);
      },
      [onRemoveHistoryItem]
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className='bg-Grey-900/95 absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 shadow-2xl backdrop-blur-lg'
      >
        {/* History Section */}
        {showingHistory && (
          <div>
            <div className='text-Grey-400 flex items-center justify-between px-4 pt-3 pb-1 text-xs font-semibold uppercase'>
              <span>Recent Searches</span>
              <button
                className='hover:text-Error-400 flex items-center gap-1 text-xs font-normal transition-colors'
                onClick={onClearHistory}
                type='button'
              >
                <Trash2 className='h-3 w-3' /> Clear All
              </button>
            </div>
            {history.map((item, index) => (
              <motion.button
                key={`history-${item}-${index}`}
                type='button'
                className={`group flex w-full items-center justify-between px-4 py-2.5 text-left text-base transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  index === selectedIndex
                    ? 'bg-Primary-500/20 text-Primary-300 border-Primary-500 border-l-2'
                    : 'text-Grey-200 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => onSuggestionClick(item)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='flex items-center gap-3'>
                  <SearchIcon className='h-4 w-4 opacity-60' />
                  <span className='flex-1 truncate'>{item}</span>
                </div>
                <button
                  className='text-Grey-500 hover:text-Error-400 ml-2 rounded p-1 transition-colors'
                  onClick={(e) => handleRemoveClick(e, item)}
                  type='button'
                  tabIndex={-1}
                  aria-label={`Remove "${item}" from history`}
                >
                  <XIcon className='h-4 w-4' />
                </button>
              </motion.button>
            ))}
          </div>
        )}

        {/* Suggestions Section */}
        {!showingHistory && suggestions.length > 0 && (
          <div>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={`suggestion-${suggestion}-${index}`}
                type='button'
                className={`w-full px-4 py-3 text-left text-base transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                  index === selectedIndex
                    ? 'bg-Primary-500/20 text-Primary-300 border-Primary-500 border-l-2'
                    : 'text-Grey-200 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => onSuggestionClick(suggestion)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='flex items-center gap-3'>
                  <SearchIcon className='h-4 w-4 opacity-60' />
                  <span className='flex-1 truncate'>{suggestion}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    );
  }
);
