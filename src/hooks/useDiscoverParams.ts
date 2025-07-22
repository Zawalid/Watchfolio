import { useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DiscoverParams } from '@/lib/api/TMDB';
import { GENRES } from '@/utils/constants/TMDB';
import { useDebounce } from './useDebounce';
import { useFiltersParams } from './useFiltersParams';

export function useDiscoverParams(type?: MediaType) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy] = useQueryState('sort_by', parseAsString.withDefault('popularity'));
  const [sortDir] = useQueryState('sort_dir', parseAsString.withDefault('desc'));

  const { language, minRating, maxRating, minYear, maxYear, selectedGenres, selectedNetworks, selectedTypes, query } =
    useFiltersParams();

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
      params.with_genres = selectedGenres.map((gen) => GENRES.find((g) => g.slug === gen)?.id).join(','); // , = AND, | = OR
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

  return {
    discoverParams,
    page,
    sortBy,
    sortDir,
    language,
    minRating,
    maxRating,
    minYear,
    maxYear,
    selectedGenres,
    selectedNetworks,
    selectedTypes,
    query,
  };
}
