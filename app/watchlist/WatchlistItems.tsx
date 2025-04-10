import Card from '@/components/Card';
import SearchForm from '@/components/SearchForm';
import { EmptyWatchList } from '@/components/Status';
import { getWatchlist } from '@/lib/db/watchlist';

function List({ items, query, type }: { items: WatchlistItem[]; query: string; type: 'all' | 'movies' | 'tv' }) {
  const list = items
    .map((item) => item.media)
    .filter((media) => media.title.toLowerCase().includes(query.toLowerCase()));

  if (!items.length) return <EmptyWatchList className='order-5' type={type} />;

  return (
    <div className='order-5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-start gap-5 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'>
      {list.map((media) => {
        const { poster_path, vote_average, genre_ids, title, tmdb_id: id, media_type, release_date } = media;
        const updatedMedia: Movie | TvShow = {
          id,
          title,
          name: title,
          poster_path,
          vote_average,
          genre_ids,
          media_type,
          release_date,
          first_air_date: release_date,
        };
        return <Card key={media.tmdb_id} media={updatedMedia} />;
      })}
    </div>
  );
}

const WatchlistItems = (type: 'all' | 'movies' | 'tv') => {
  return async function Page({ searchParams }: { searchParams?: Promise<{ query?: string }> }) {
    const query = (await searchParams)?.query || '';
    const watchlist = await getWatchlist();

    const items =
      type === 'all'
        ? watchlist?.items
        : watchlist?.items.filter((item) => item.media.media_type === (type === 'movies' ? 'movie' : 'tv'));

    return (
      <>
        <SearchForm
          label='Search Your Movies And Tv Shows'
          placeholder='eg. Breaking Bad'
          parentClassName='order-1 w-1/2'
          query={query}
        />
        <h2 className='order-4 text-2xl font-semibold text-Grey/400'>
          {type === 'all' ? 'All' : type === 'movies' ? 'Movies' : 'Tv Shows'}
          <span className='ml-1 text-base'>({items?.length})</span>
        </h2>
        <List items={items || []} query={query} type={type} />
      </>
    );
  };
};

export default WatchlistItems;
