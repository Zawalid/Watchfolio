import { useEffect, useMemo } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { motion } from 'framer-motion';
import { Layers, Crown, Zap, Target, Heart, Skull, Laugh, Users, Grid3x3 } from 'lucide-react';
import { MOVIE_COLLECTIONS } from '@/utils/constants/TMDB';
import CollectionCard from '@/components/collection/CollectionCard';
import { cn, slugify } from '@/utils';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useNavigate } from 'react-router';
import { useListNavigator } from '@/hooks/useListNavigator';
import PageLayout from '@/layouts/PageLayout';

type CollectionCategory = keyof typeof MOVIE_COLLECTIONS;

const COLLECTION_CATEGORIES = [
  {
    id: 'blockbusters' as CollectionCategory,
    label: 'Blockbusters',
    description: 'Epic franchise collections',
    icon: Crown,
  },
  {
    id: 'superheroes' as CollectionCategory,
    label: 'Superheroes',
    description: 'Marvel, DC and more',
    icon: Zap,
  },
  {
    id: 'action' as CollectionCategory,
    label: 'Action',
    description: 'High-octane adventures',
    icon: Target,
  },
  {
    id: 'classics' as CollectionCategory,
    label: 'Classics',
    description: 'Legendary cinema',
    icon: Crown,
  },
  {
    id: 'family' as CollectionCategory,
    label: 'Family',
    description: 'Fun for all ages',
    icon: Heart,
  },
  {
    id: 'horror' as CollectionCategory,
    label: 'Horror',
    description: 'Spine-chilling series',
    icon: Skull,
  },
  {
    id: 'comedy' as CollectionCategory,
    label: 'Comedy',
    description: 'Laugh-out-loud collections',
    icon: Laugh,
  },
  {
    id: 'teen' as CollectionCategory,
    label: 'Teen',
    description: 'Young adult favorites',
    icon: Users,
  },
];

interface CollectionWithDetails {
  id: number;
  name: string;
  category: CollectionCategory;
}

export default function Collections() {
  const [category, setCategory] = useQueryState('category', parseAsString);
  const navigate = useNavigate();

  // Flatten all collections with their categories
  const allCollections = useMemo((): CollectionWithDetails[] => {
    return Object.entries(MOVIE_COLLECTIONS).flatMap(([categoryKey, collections]) =>
      collections.map((collection) => ({
        ...collection,
        category: categoryKey as CollectionCategory,
      }))
    );
  }, []);

  // Filter collections based on selected category
  const displayedCollections = useMemo(() => {
    if (!category) return allCollections;
    return allCollections.filter((collection) => collection.category === category);
  }, [allCollections, category]);

  const { containerRef, currentIndex, setCurrentIndex } = useListNavigator({
    itemCount: displayedCollections.length,
    onSelect: (index) => {
      if (index >= 0 && displayedCollections[index]) {
        const collection = displayedCollections[index];
        navigate(`/collections/${collection.id}-${slugify(collection.name)}`);
      }
    },
  });

  useEffect(() => {
    setCurrentIndex(-1);
  }, [category, setCurrentIndex]);

  const handleCategorySelect = (categoryId: string) => {
    const isActive = category === categoryId;
    setCategory(isActive ? null : categoryId);
  };

  return (
    <PageLayout
      Icon={Layers}
      title='Movie Collections'
      subtitle='Discover epic movie franchises and series'
      pageTitle={`${category ? COLLECTION_CATEGORIES.find((c) => c.id === category)?.label : ''} Movie Collections`}
    >
      {/* Header */}
      <motion.div variants={containerVariants} className='space-y-6'>
        {/* Categories */}
        <motion.div variants={itemVariants} className='mobile:flex grid grid-cols-2 flex-wrap gap-3'>
          {COLLECTION_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  'group flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200',
                  isActive
                    ? 'from-Secondary-500 to-Secondary-600 border-white/20 bg-gradient-to-r text-white shadow-lg shadow-black/20'
                    : 'bg-Grey-800/50 text-Grey-300 border-Grey-700/50 hover:bg-Grey-700/50 hover:border-Grey-600/50 hover:text-white'
                )}
              >
                <Icon
                  className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive && 'drop-shadow-sm')}
                />
                <span className='text-sm font-medium'>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='border-Grey-800/50 mobile:items-center flex items-start justify-between border-b pb-4'
        >
          <div>
            <h2 className='text-lg font-semibold text-white'>
              {COLLECTION_CATEGORIES.find((c) => c.id === category)?.label || 'All Collections'}
            </h2>
            <p className='text-Grey-400 mt-1 text-sm'>
              {COLLECTION_CATEGORIES.find((c) => c.id === category)?.description ||
                'Browse all movie collections from our vast library'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs text-white/90 backdrop-blur-md'>
              <Grid3x3 className='h-4 w-4' />
              <span className='text-sm'>
                {displayedCollections.length}
                <span className='mobile:inline hidden'>collection{displayedCollections.length !== 1 ? 's' : ''}</span>
              </span>
            </div>
            {category && (
              <button
                onClick={() => setCategory(null)}
                className='bg-Grey-800/50 hover:bg-Grey-700/50 text-Grey-400 border-Grey-700/50 hover:border-Grey-600/50 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all duration-200 hover:text-white'
              >
                <span>Show All</span>
                <span className='text-xs'>×</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6' ref={containerRef}>
          {displayedCollections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} tabIndex={currentIndex === index ? 0 : -1} />
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
}
