import { useLoaderData } from 'react-router';
import { parseAsInteger, parseAsString, parseAsArrayOf, useQueryState } from 'nuqs';
import MediaCardsList from '../../components/media/MediaCardsList';
import { discoverMovies, getDefaultSortForCategory, getFiltersForCategory, type DiscoverParams } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';

export default function Movies({ category }: { category: Categories }) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [sortBy] = useQueryState('sort_by', parseAsString);
  const [language] = useQueryState('language', parseAsString);
  const [minRating] = useQueryState('min_rating', parseAsInteger);
  const [maxRating] = useQueryState('max_rating', parseAsInteger);
  const [minYear] = useQueryState('min_year', parseAsInteger);
  const [maxYear] = useQueryState('max_year', parseAsInteger);
  const [minVotes] = useQueryState('min_votes', parseAsInteger);
  const [selectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedNetworks] = useQueryState('networks', parseAsArrayOf(parseAsString));

  const initialData = useLoaderData();

  // Build discover parameters
  const discoverParams: DiscoverParams = {
    page,
    sort_by: (sortBy as DiscoverParams['sort_by']) || getDefaultSortForCategory(category!),
    ...getFiltersForCategory(category!),
  };

  // Apply user filters
  if (selectedGenres?.length) {
    discoverParams.with_genres = selectedGenres.join(',');
  }

  if (selectedNetworks?.length) {
    discoverParams.with_companies = selectedNetworks.join(',');
  }

  if (language) {
    discoverParams.with_original_language = language;
  }

  if (minRating !== null) {
    discoverParams['vote_average.gte'] = minRating;
  }

  if (maxRating !== null) {
    discoverParams['vote_average.lte'] = maxRating;
  }

  if (minYear !== null) {
    discoverParams['primary_release_date.gte'] = `${minYear}-01-01`;
  }

  if (maxYear !== null) {
    discoverParams['primary_release_date.lte'] = `${maxYear}-12-31`;
  }

  if (minVotes !== null) {
    discoverParams['vote_count.gte'] = minVotes;
  }

  return (
    <MediaCardsList
      queryOptions={{
        queryKey: queryKeys.discover('movie', category!, discoverParams),
        queryFn: async () => await discoverMovies(discoverParams),
        enabled: !!category,
        placeholderData: (previousData) => previousData || initialData,
      }}
      errorMessage='Something went wrong while fetching movies. Please try again later.'
    />
  );
}
