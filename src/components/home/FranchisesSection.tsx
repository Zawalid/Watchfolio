import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles, LibraryBig, FolderHeart } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/react';
import { getCollection } from '@/lib/api/TMDB';
import { LazyImage } from '@/components/ui/LazyImage';
import { Slider } from '@/components/ui/Slider';
import { getTmdbImage } from '@/utils/media';
import { slugify } from '@/utils';
import { MOVIE_COLLECTIONS } from '@/utils/constants/TMDB';

const FEATURED_COLLECTIONS = [
  ...MOVIE_COLLECTIONS.blockbusters.slice(0, 6),
  ...MOVIE_COLLECTIONS.superheroes.slice(0, 4),
  ...MOVIE_COLLECTIONS.classics.slice(0, 4),
  ...MOVIE_COLLECTIONS.action.slice(0, 4),
].map((collection, index) => ({
  ...collection,
  category: index < 6 ? 'Blockbuster' : index < 10 ? 'Superhero' : index < 14 ? 'Classic' : 'Action'
}));

export default function FranchisesSection() {
  return (
    <div className='space-y-6'>
      <div className='xs:flex-row xs:items-center xs:justify-between flex flex-col gap-3'>
        <div className='flex items-center gap-4'>
          <div className='from-Success-500 to-Secondary-500 shadow-Primary-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <FolderHeart className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <h2 className='text-2xl font-bold text-white'>Popular Franchises</h2>
            <p className='text-Grey-400 mt-1 text-sm'>
              Discover the most popular movie franchises loved by fans worldwide.
            </p>
          </div>
        </div>

        <Button
          as={Link}
          to='/collections'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          Browse All
        </Button>
      </div>

      <Slider autoplay>
        {FEATURED_COLLECTIONS.map((collection, index) => (
          <Slider.Slide key={collection.id} className='group w-[280px]! sm:w-[350px]!'>
            <CollectionCard collection={collection} index={index} />
          </Slider.Slide>
        ))}
      </Slider>
    </div>
  );
}

interface CollectionCardProps {
  collection: {
    id: number;
    name: string;
    category: string;
  };
  index: number;
}

const formatName = (name: string) => {
  return name.replace(' Collection', '').trim();
};

function CollectionCard({ collection, index }: CollectionCardProps) {
  const { data: collectionData } = useQuery({
    queryKey: ['collection', collection.id],
    queryFn: () => getCollection(collection.id),
    staleTime: 1000 * 60 * 30,
  });


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className='group relative cursor-pointer aspect-video'
    >
      <Link to={`/collections/${collection.id}-${slugify(collection.name)}`} className='block h-full w-full'>
        <div className='relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/40'>
          <LazyImage
            src={getTmdbImage(collectionData, 'original')}
            alt={collection.name}
            className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20' />

          <div className='absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400 shadow-lg backdrop-blur-md'>
            <Sparkles className='size-3' />
            <span>{collection.category}</span>
          </div>

          <div className='absolute right-0 bottom-0 left-0 space-y-1.5 p-4'>
            <h3 className='leading-tight font-bold text-white text-lg'>{formatName(collection.name)}</h3>

            {collectionData && (
              <div className='flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-medium text-white/90 shadow-lg backdrop-blur-md'>
                <LibraryBig className='size-3' />
                <span className='text-xs'>{collectionData.parts?.length || 0} movies</span>
              </div>
            )}
          </div>

          <div className='border-Primary-500/0 group-hover:border-Primary-500/30 absolute inset-0 rounded-xl border transition-colors duration-300' />
        </div>
      </Link>
    </motion.div>
  );
}
