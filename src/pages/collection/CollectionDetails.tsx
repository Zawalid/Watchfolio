import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Film } from 'lucide-react';
import CollectionDetailsSkeleton from '@/components/collection/details/CollectionDetailsSkeleton';
import CollectionMovies from '@/components/collection/details/CollectionMovies';
import { getCollection } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { containerVariants, itemVariants } from '@/lib/animations';
import { LazyImage } from '@/components/ui/LazyImage';
import { formatDate } from '@/utils';
import { Rating } from '@/components/ui/Rating';
import { Status } from '@/components/ui/Status';

export default function CollectionDetails() {
  const { slug } = useParams();
  const collectionId = parseInt(slug!);

  const {
    data: collection,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.collection(collectionId),
    queryFn: () => getCollection(collectionId),
    enabled: !!collectionId,
  });

  if (isLoading) return <CollectionDetailsSkeleton />;
  if (isError) return <Status.Error message='There was an error loading the collection details. Please try again.' />;
  if (!collection)
    return (
      <Status.NotFound
        title='Collection Not Found'
        message='The collection you are looking for does not exist. Please try again with a different collection.'
      />
    );

  const { name, overview, backdrop_path, parts } = collection;
  const formattedName = name.replace(' Collection', '').trim();

  const totalMovies = parts.length;
  const averageRating = parts.reduce((acc, movie) => acc + movie.vote_average, 0) / totalMovies;

  return (
    <motion.div className='space-y-8' variants={containerVariants} initial='hidden' animate='visible'>
      <motion.section variants={itemVariants}>
        <div className='relative flex min-h-[450px] flex-col justify-end overflow-hidden rounded-xl p-8 text-white shadow-2xl [&_:first-child]:inset-0 [&>div]:absolute'>
          <LazyImage
            src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
            alt={formattedName}
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent' />
          <div className='relative z-10 space-y-4'>
            <h1 className='heading gradient'>{formattedName}</h1>
            {overview && <p className='text-Grey-200 max-w-3xl text-base drop-shadow-md'>{overview}</p>}
            <div className='flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm'>
                <Film className='size-4' />
                <span>{totalMovies} Movies</span>
              </div>
              <Rating rating={averageRating} />
              <div className='border-Primary-400/30 bg-Primary-500/20 text-Primary-300 flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm font-medium backdrop-blur-md'>
                <Calendar className='size-4' />
                {formatDate(parts[0].release_date)}- {formatDate(parts[parts.length - 1].release_date)}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <motion.section variants={itemVariants}>
        <CollectionMovies movies={collection.parts} />
      </motion.section>
    </motion.div>
  );
}
