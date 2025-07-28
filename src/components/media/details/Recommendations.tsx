import { getRecommendations } from '@/lib/api/TMDB';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';

export default function Recommendations({ type, id }: { type: 'movie' | 'tv'; id: number }) {
  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>You Might Also Like</h2>
      <MediaAndCelebritiesCardsList
        queryKey={['recommendations', type, id]}
        queryFn={async () => await getRecommendations(type, id)}
        enabled={!!id}
        asSlider
      />
    </section>
  );
}
