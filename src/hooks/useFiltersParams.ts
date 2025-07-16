import { useMemo } from 'react';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';

export function useFiltersParams() {
  const [language, setLanguage] = useQueryState('language', parseAsString);
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedNetworks, setSelectedNetworks] = useQueryState('networks', parseAsArrayOf(parseAsString));
  const [minRating, setMinRating] = useQueryState('min_rating', parseAsInteger);
  const [maxRating, setMaxRating] = useQueryState('max_rating', parseAsInteger);
  const [minYear, setMinYear] = useQueryState('min_year', parseAsInteger);
  const [maxYear, setMaxYear] = useQueryState('max_year', parseAsInteger);
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString));
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });

  const clearAllFilters = () => {
    setSelectedGenres(null);
    setSelectedNetworks(null);
    setMinRating(null);
    setMaxRating(null);
    setMinYear(null);
    setMaxYear(null);
    setSelectedTypes(null)
  };

  const [hasFilters, numberOfFilters] = useMemo(() => {
    const has = Boolean(
      selectedGenres?.length ||
        selectedNetworks?.length ||
        selectedTypes?.length ||
        language ||
        minRating ||
        maxRating ||
        minYear ||
        maxYear
    );
    const total =
      (selectedGenres?.length || 0) +
      (selectedNetworks?.length || 0) +
      (selectedTypes?.length || 0) +
      (language ? 1 : 0) +
      (minRating ? 1 : 0) +
      (maxRating ? 1 : 0) +
      (minYear ? 1 : 0) +
      (maxYear ? 1 : 0);

    return [has, total] as const;
  }, [
    language,
    maxRating,
    maxYear,
    minRating,
    minYear,
    selectedGenres?.length,
    selectedNetworks?.length,
    selectedTypes?.length,
  ]);

  return {
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
    selectedTypes,
    setSelectedTypes,
    hasFilters,
    numberOfFilters,
    clearAllFilters,
    query,
    setQuery,
  };
}
