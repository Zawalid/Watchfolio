import { getSimilar } from '@/lib/api/TMDB';
import MediaCardsList from '@/components/media/MediaCardsList';

export default function Similar({ type, id }: { type: 'movie' | 'tv'; id: number }) {
  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>More Like This</h2>
      <MediaCardsList
        queryOptions={{
          queryKey: ['similar', type, id],
          queryFn: async () => await getSimilar(type, id),
          enabled: !!id,
        }}
        asSlider
      />
    </section>
  );
}
