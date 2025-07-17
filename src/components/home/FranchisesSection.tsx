import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles, LibraryBig, FolderHeart } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@heroui/react';
import { getCollection } from '@/lib/api/TMDB';
import { LazyImage } from '@/components/ui/LazyImage';

const FEATURED_COLLECTIONS = [
  { id: 10, name: 'Star Wars Collection', category: 'Epic Saga' },
  { id: 263, name: 'The Dark Knight Collection', category: 'Superhero' },
  { id: 645, name: 'James Bond Collection', category: 'Action' },
  { id: 230, name: 'The Godfather Collection', category: 'Classic' },
  { id: 119, name: 'The Lord of the Rings Collection', category: 'Fantasy' },
  { id: 264, name: 'Back to the Future Collection', category: 'Adventure' },
  { id: 86311, name: 'The Avengers Collection', category: 'Superhero' },
  { id: 1241, name: 'Harry Potter Collection', category: 'Fantasy' },
];

export default function FranchisesSection() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
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

      <div className='grid grid-cols-12 gap-3 sm:gap-4'>
        <div className='col-span-12 lg:col-span-5'>
          <CollectionCard collection={FEATURED_COLLECTIONS[0]} index={0} variant='hero' />
        </div>

        <div className='col-span-12 grid grid-cols-12 gap-3 sm:gap-4 lg:col-span-7'>
          <div className='col-span-6'>
            <CollectionCard collection={FEATURED_COLLECTIONS[1]} index={1} variant='medium' />
          </div>

          <div className='col-span-6'>
            <CollectionCard collection={FEATURED_COLLECTIONS[2]} index={2} variant='medium' />
          </div>

          <div className='col-span-4'>
            <CollectionCard collection={FEATURED_COLLECTIONS[3]} index={3} variant='small' />
          </div>

          <div className='col-span-4'>
            <CollectionCard collection={FEATURED_COLLECTIONS[4]} index={4} variant='small' />
          </div>

          <div className='col-span-4'>
            <CollectionCard collection={FEATURED_COLLECTIONS[5]} index={5} variant='small' />
          </div>
        </div>
        <div className='col-span-12 grid max-h-80 grid-cols-2 gap-3 sm:gap-4'>
          <CollectionCard collection={FEATURED_COLLECTIONS[6]} index={6} variant='wide' />
          <CollectionCard collection={FEATURED_COLLECTIONS[7]} index={7} variant='wide' />
        </div>
      </div>
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
  variant: 'hero' | 'medium' | 'small' | 'wide';
}

const formatName = (name: string) => {
  return name.replace(' Collection', '').trim();
};

const getCardDimensions = (variant: CollectionCardProps['variant']) => {
  switch (variant) {
    case 'hero':
      return 'aspect-[4/5] sm:aspect-[3/4]';
    case 'medium':
      return 'aspect-[4/5]';
    case 'small':
      return 'aspect-square';
    case 'wide':
      return 'aspect-[16/5]';
    default:
      return 'aspect-[4/5]';
  }
};

const getTextSizing = (variant: CollectionCardProps['variant']) => {
  switch (variant) {
    case 'hero':
      return {
        title: 'text-xl sm:text-2xl',
        category: 'text-sm',
        count: 'text-sm',
      };
    case 'medium':
      return {
        title: 'text-lg',
        category: 'text-xs',
        count: 'text-xs',
      };
    case 'small':
      return {
        title: 'text-base',
        category: 'text-xs',
        count: 'text-xs',
      };
    case 'wide':
      return {
        title: 'text-base',
        category: 'text-xs',
        count: 'text-xs',
      };
    default:
      return {
        title: 'text-lg',
        category: 'text-xs',
        count: 'text-xs',
      };
  }
};

function CollectionCard({ collection, index, variant }: CollectionCardProps) {
  const { data: collectionData } = useQuery({
    queryKey: ['collection', collection.id],
    queryFn: () => getCollection(collection.id),
    staleTime: 1000 * 60 * 30,
  });

  const textSizing = getTextSizing(variant);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative cursor-pointer ${getCardDimensions(variant)}`}
    >
      <Link to={`/collection/${collection.id}`} className='block h-full w-full'>
        <div className='relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/40'>
          <LazyImage
            src={
              collectionData?.backdrop_path || collectionData?.poster_path
                ? `https://image.tmdb.org/t/p/${variant === 'medium' ? 'w500' : 'original'}${collectionData.backdrop_path || collectionData.poster_path}`
                : '/images/placeholder.png'
            }
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
            <h3 className={`leading-tight font-bold text-white ${textSizing.title}`}>{formatName(collection.name)}</h3>

            {collectionData && (
              <div className='flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-medium text-white/90 shadow-lg backdrop-blur-md'>
                <LibraryBig className='size-3' />
                <span className={textSizing.count}>{collectionData.parts?.length || 0} movies</span>
              </div>
            )}
          </div>

          <div className='border-Primary-500/0 group-hover:border-Primary-500/30 absolute inset-0 rounded-xl border transition-colors duration-300' />
        </div>
      </Link>
    </motion.div>
  );
}
