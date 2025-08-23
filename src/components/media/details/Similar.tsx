import { getSimilar } from '@/lib/api/TMDB';
import MediaAndCelebritiesCardsList from '@/components/Media&CelebritiesCardsList';

export default function Similar({ type, id }: { type: MediaType; id: number }) {
  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>More Like This</h2>
      <MediaAndCelebritiesCardsList
        queryKey={['similar', type, id]}
        queryFn={async () => await getSimilar(type, id)}
        enabled={!!id}
        asSlider
      />
    </section>
  );
}
