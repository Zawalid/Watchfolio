import { useIsFetching } from '@tanstack/react-query';
import { Button } from '@heroui/button';
import { parseAsInteger, useQueryState } from 'nuqs';
import Input from '@/components/ui/Input';
import { search } from '@/lib/api/TMDB';
import CardsList from '@/components/CardsList';
import { queryKeys } from '@/lib/react-query';

export default function Search() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const isFetching = useIsFetching({ queryKey: ['search', query, page] }) > 0;

  return (
    <div className='flex h-full flex-col gap-12'>
      <form
        className='flex gap-2 w-3/5 self-center'
        id='search-form'
        onSubmit={(e) => {
          e.preventDefault();
          const query = (e.target as HTMLFormElement).query.value.trim();
          if (query === '') return;
          setQuery(query);
          setPage(1);
        }}
      >
        <Input
          type='text'
          icon='search'
          parentClassname='flex-1'
          name='query'
          defaultValue={query}
          label='Search For Movies Or Tv Shows'
          placeholder='eg. The Wire'
        >
          <button
            className={`icon text-Grey-100 absolute top-1/2 right-4 z-20 -translate-y-1/2 cursor-pointer ${!query ? 'hidden' : ''}`}
            type='reset'
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </Input>

        <Button
          className={`h-auto ${isFetching ? 'flex items-center gap-1' : ''}`}
          type='submit'
          color='primary'
          size='md'
          isLoading={isFetching}
        >
          {isFetching ? 'Searching...' : 'Search'}
        </Button>
      </form>
      {query ? (
        <CardsList
          queryOptions={{
            queryKey: queryKeys.search(query, page),
            queryFn: async () => await search(query, page),
            enabled: !!query,
          }}
          errorMessage='Something went wrong while searching. Please try again later.'
        />
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <h2 className='text-Grey-50 text-2xl font-semibold'>Start Searching...</h2>
          <p className='text-Grey-300 leading-relaxed'>
            It looks like you haven&apos;t searched for anything yet. Start typing to find what you&apos;re looking for!
          </p>
        </div>
      )}
    </div>
  );
}
