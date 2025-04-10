export const revalidate = 3600;

import CardsList from '@/components/CardsList';
import SearchForm from '@/components/SearchForm';
import { search } from '@/lib/api';

export const metadata = {
  title: 'Search | Watchfolio',
  description: 'Search for movies and tv shows',
};

export default async function Page(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = (searchParams?.query || '').trim();
  const page = Number(searchParams?.page) || 1;

  const data = await search(query, page);

  return (
    <div className='flex h-full flex-col gap-12'>
      <SearchForm
        label='Search For Movies Or Tv Shows'
        placeholder='eg. The Wire'
        parentClassName='w-1/2 self-center'
        query={query}
      />
      {query ? (
        <CardsList data={data} query={query} page={page} />
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <h2 className='text-2xl font-semibold text-Grey/50'>Start Searching...</h2>
          <p className='leading-relaxed text-Grey/300'>
            It looks like you haven&apos;t searched for anything yet. Start typing to find what you&apos;re looking for!
          </p>
        </div>
      )}
    </div>
  );
}
