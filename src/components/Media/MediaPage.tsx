import { parseAsInteger, parseAsString, parseAsArrayOf, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import MediaCardsList from '@/components/media/MediaCardsList';
import { discoverMovies, discoverTvShows, getMovies, getTvShows, type DiscoverParams } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';

type MediaType = 'movie' | 'tv';

interface MediaPageProps {
  type: MediaType;
  categories: Categories[];
}

export default function MediaPage({ type, categories }: MediaPageProps) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy] = useQueryState('sort_by', parseAsString.withDefault('popularity'));
  const [sortDir] = useQueryState('sort_dir', parseAsString.withDefault('desc'));
  const [language] = useQueryState('language', parseAsString);
  const [minRating] = useQueryState('min_rating', parseAsInteger);
  const [maxRating] = useQueryState('max_rating', parseAsInteger);
  const [minYear] = useQueryState('min_year', parseAsInteger);
  const [maxYear] = useQueryState('max_year', parseAsInteger);
  const [selectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedNetworks] = useQueryState('networks', parseAsArrayOf(parseAsString));
  const [category] = useQueryState('category', parseAsString);

  const isValidCategory = category && categories.includes(category as Categories);

  const discoverParams = useMemo((): DiscoverParams => {
    const params: DiscoverParams = {
      page,
      sort_by: `${sortBy}.${sortDir}` as DiscoverParams['sort_by'],
    };

    // Apply filters only if they have valid values
    if (selectedGenres?.length) {
      params.with_genres = selectedGenres.join(',');
    }

    if (selectedNetworks?.length) {
      params.with_networks = selectedNetworks.join(',');
    }

    if (language) {
      params.with_original_language = language;
    }

    if (minRating !== null) {
      params['vote_average.gte'] = minRating;
    }

    if (maxRating !== null) {
      params['vote_average.lte'] = maxRating;
    }

    if (minYear !== null) {
      const dateKey = type === 'movie' ? 'release_date' : 'first_air_date';
      params[`${dateKey}.gte`] = `${minYear}-01-01`;
    }

    if (maxYear !== null) {
      const dateKey = type === 'movie' ? 'release_date' : 'first_air_date';
      params[`${dateKey}.lte`] = `${maxYear}-12-31`;
    }

    return params;
  }, [page, sortBy, sortDir, language, minRating, maxRating, minYear, maxYear, selectedGenres, selectedNetworks, type]);

  // If there's a valid category, use the category endpoint
  if (isValidCategory) {
    const getFn = type === 'movie' ? getMovies : getTvShows;
    return (
      <MediaCardsList
        queryOptions={{
          queryKey: queryKeys.category(type, category as Categories, page),
          queryFn: async () => await getFn(category as Categories, page),
        }}
        errorMessage={`Something went wrong while fetching ${type === 'movie' ? 'movies' : 'TV shows'}. Please try again later.`}
      />
    );
  }

  // Use discover for general browsing or when filters are applied
  const discoverFn = type === 'movie' ? discoverMovies : discoverTvShows;
  return (
    <MediaCardsList
      queryOptions={{
        queryKey: queryKeys.discover(type, discoverParams),
        queryFn: async () => await discoverFn(discoverParams),
      }}
      errorMessage={`Something went wrong while fetching ${type === 'movie' ? 'movies' : 'TV shows'}. Please try again later.`}
    />
  );
}
