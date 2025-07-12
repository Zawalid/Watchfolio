import { useMemo } from 'react';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DiscoverParams } from '@/lib/api/TMDB';
import { GENRES } from '@/utils/constants/TMDB';
import { useDebounce } from './useDebounce';

export function useDiscoverParams(type?: MediaType) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy, setSortBy] = useQueryState('sort_by', parseAsString.withDefault('popularity'));
  const [sortDir, setSortDir] = useQueryState('sort_dir', parseAsString.withDefault('desc'));
  const [language, setLanguage] = useQueryState('language', parseAsString);
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedNetworks, setSelectedNetworks] = useQueryState('networks', parseAsArrayOf(parseAsString));
  const [minRating, setMinRating] = useQueryState('min_rating', parseAsInteger);
  const [maxRating, setMaxRating] = useQueryState('max_rating', parseAsInteger);
  const [minYear, setMinYear] = useQueryState('min_year', parseAsInteger);
  const [maxYear, setMaxYear] = useQueryState('max_year', parseAsInteger);

  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));

  const debouncedMinRating = useDebounce(minRating, 700);
  const debouncedMaxRating = useDebounce(maxRating, 700);
  const debouncedMinYear = useDebounce(minYear, 700);
  const debouncedMaxYear = useDebounce(maxYear, 700);

  const discoverParams = useMemo((): DiscoverParams => {
    const params: DiscoverParams = {
      page,
      sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'],
    };

    // Apply filters only if they have valid values
    if (selectedGenres?.length) {
      params.with_genres = selectedGenres.map((gen) => GENRES.find((g) => g.slug === gen)?.id).join(',');
    }

    if (selectedNetworks?.length) {
      params.with_networks = selectedNetworks.join(',');
    }

    if (language) {
      params.with_original_language = language;
    }

    if (debouncedMinRating !== null) {
      params['vote_average.gte'] = debouncedMinRating;
    }

    if (debouncedMaxRating !== null) {
      params['vote_average.lte'] = debouncedMaxRating;
    }

    if (debouncedMinYear !== null) {
      const dateKey = type === 'movie' ? 'release_date' : 'first_air_date';
      params[`${dateKey}.gte`] = `${debouncedMinYear}-01-01`;
    }

    if (debouncedMaxYear !== null) {
      const dateKey = type === 'movie' ? 'release_date' : 'first_air_date';
      params[`${dateKey}.lte`] = `${debouncedMaxYear}-12-31`;
    }

    return params;
  }, [
    page,
    sortBy,
    sortDir,
    language,
    debouncedMinRating,
    debouncedMaxRating,
    debouncedMinYear,
    debouncedMaxYear,
    selectedGenres,
    selectedNetworks,
    type,
  ]);

  const clearAllFilters = () => {
    setSelectedGenres(null);
    setSelectedNetworks(null);
    setMinRating(null);
    setMaxRating(null);
    setMinYear(null);
    setMaxYear(null);
  };

  return {
    discoverParams,
    page,
    setPage,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    language,
    setLanguage,
    minRating,
    setMinRating,
    maxRating,
    setMaxRating,
    minYear,
    setMinYear,
    maxYear,
    setMaxYear,
    selectedGenres,
    setSelectedGenres,
    selectedNetworks,
    setSelectedNetworks,
    selectedTypes,setSelectedTypes,
    clearAllFilters,
  };
}
