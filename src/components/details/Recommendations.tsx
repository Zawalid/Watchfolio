import { getRecommendations } from '@/lib/api/TMDB';
import MediaCardsList from '../media/MediaCardsList';

export default function Recommendations({ type, id }: { type: 'movie' | 'tv'; id: number }) {
  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>You Might Also Like</h2>
      <MediaCardsList
        queryOptions={{
          queryKey: ['recommendations', type, id],
          queryFn: async () => await getRecommendations(type, id),
          enabled: !!id,
        }}
        asSlider
        errorMessage='Something went wrong while fetching recommendations. Please try again later.'
      />
    </section>
  );
}
