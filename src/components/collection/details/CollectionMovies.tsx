import MediaCard from '@/components/media/MediaCard';
import SortBy from '@/components/SortBy';
import { useQueryState, parseAsString } from 'nuqs';
import { useMemo } from 'react';

interface CollectionMoviesProps {
  movies: Movie[];
}

const sortMovies = (items: Movie[], sortBy: string, sortDir: string): Movie[] => {
  return [...items].sort((a, b) => {
    let comparison = 0;
    const aDate = a.release_date;
    const bDate = b.release_date;

    switch (sortBy) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;
      case 'rating':
        comparison = (a.vote_average || 0) - (b.vote_average || 0);
        break;
      case 'date':
      default:
        comparison = new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime();
        break;
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });
};

export default function CollectionMovies({ movies }: CollectionMoviesProps) {
  const [sortBy] = useQueryState('sort_by', parseAsString.withDefault('date'));
  const [sortDir] = useQueryState('sort_dir', parseAsString.withDefault('asc'));

  const sortedMovies = useMemo(() => {
    return sortMovies(movies, sortBy, sortDir as 'asc' | 'desc');
  }, [movies, sortBy, sortDir]);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between [&>div]:w-fit'>
      <div>
          <h2 className='text-lg font-semibold text-white'>
            Movies in this Collection
          </h2>
          <p className='text-Grey-400 mt-1 text-sm'>
            Discover your next favorite from this collection
          </p>
        </div>
        <SortBy
          options={[
            { key: 'date', label: 'Release Date' },
            { key: 'rating', label: 'Rating' },
            { key: 'title', label: 'Title' },
          ]}
          defaultSort='date'
          defaultDir='asc'
        />
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5'>
        {sortedMovies.map((movie) => (
          <MediaCard key={movie.id} media={movie} />
        ))}
      </div>
    </div>
  );
}
