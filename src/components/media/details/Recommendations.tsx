import { getRecommendations } from '@/lib/api/TMDB';
import MediaCardsList from '@/components/media/MediaCardsList';

export default function Recommendations({ type, id }: { type: 'movie' | 'tv'; id: number }) {
  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>You Might Also Like</h2>
      <MediaCardsList
        queryKey={['recommendations', type, id]}
        queryFn={async () => await getRecommendations(type, id)}
        enabled={!!id}
        asSlider
      />
    </section>
  );
}
