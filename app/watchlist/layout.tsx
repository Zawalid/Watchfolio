import Tabs from '@/components/ui/Tabs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-full flex-col gap-8'>
      <h1 className='order-0 text-4xl font-semibold text-Grey/50'>Your Watch List</h1>
      <Tabs
        tabs={[
          { label: 'All', value: 'all', link: '/watchlist' },
          { label: 'Movies', value: 'movies', link: '/watchlist/movies' },
          { label: 'Tv Shows', value: 'tv', link: '/watchlist/tv' },
        ]}
        TABS_INDICATORS={{
          all: { left: 8, width: 79 },
          movies: { left: 107, width: 102 },
          tv: { left: 229, width: 96 },
        }}
        preserveSearchParams={true}
        className='order-3'
      />
      {children}
    </div>
  );
}

/* 

 <p className="text-Grey/300 leading-relaxed">
   List of movies and Tv Shows, I, <span className="text-Primary/300">Walid Zakan</span> have
   watched till date.
   <br />
   Explore what I have watched and also feel free to make a suggestion. 😉
 </p>

 <Link href="/" className="w-fit font-medium text-Primary/200">
            Walid Zakan
          </Link>
*/
