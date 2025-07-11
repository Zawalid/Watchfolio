import { useEffect, useMemo, useRef, useState } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { motion } from 'framer-motion';
import { Layers, Crown, Zap, Target, Heart, Skull, Laugh, Users, Grid3x3 } from 'lucide-react';

import { MOVIE_COLLECTIONS } from '@/utils/constants/TMDB';
import CollectionCard from '@/components/collection/CollectionCard';
import { cn, slugify } from '@/utils';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useNavigate } from 'react-router';
import { useListNavigator } from '@/hooks/useListNavigator';

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
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFocusIndex(-1);
  }, [category]);

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

  const handleCategorySelect = (categoryId: string) => {
    const isActive = category === categoryId;
    setCategory(isActive ? null : categoryId);
  };

  useListNavigator({
    containerRef: cardsContainerRef,
    itemSelector: '[role="article"]',
    itemCount: displayedCollections.length,
    currentIndex: focusIndex,
    onNavigate: setFocusIndex,
    onSelect: (index) => {
      if (index >= 0 && displayedCollections[index]) {
        const collection = displayedCollections[index];
        navigate(`/collections/${collection.id}-${slugify(collection.name)}`);
      }
    },
    orientation: 'grid',
  });

  return (
    <motion.div className='space-y-8' variants={containerVariants} initial='hidden' animate='visible'>
      {/* Header */}
      <motion.div variants={itemVariants} className='space-y-6'>
        <div className='flex items-center gap-4'>
          <div className='from-Primary-400 to-Secondary-400 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Layers className='h-6 w-6 text-white drop-shadow-sm' />
          </div>
          <div>
            <h1 className='heading gradient'>Movie Collections</h1>
            <p className='text-Grey-400 text-sm'>Discover epic movie franchises and series</p>
          </div>
        </div>

        {/* Categories */}
        <div className='flex flex-wrap gap-3'>
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
                    ? 'from-Primary-500 to-Secondary-500 border-white/20 bg-gradient-to-r text-white shadow-lg shadow-black/20'
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
        </div>

        <div className='border-Grey-800/50 flex items-center justify-between border-b pb-4'>
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
                {displayedCollections.length} collection{displayedCollections.length !== 1 ? 's' : ''}
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
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6' ref={cardsContainerRef}>
          {displayedCollections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} tabIndex={focusIndex === index ? 0 : -1} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
