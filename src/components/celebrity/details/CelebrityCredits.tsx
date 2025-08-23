import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import BaseMediaCard from '@/components/media/BaseMediaCard';
import { CELEBRITY_CATEGORIES } from './CelebrityCategories';
import { getGenres } from '@/utils/media';
import { useLibraryStore } from '@/stores/useLibraryStore';
import SortBy from '@/components/SortBy';
import { generateMediaId } from '@/utils/library';

interface CelebrityCreditsProps {
  currentContent: Credit[];
  category: string | null;
  isDeceased: boolean;
}

export default function CelebrityCredits({ currentContent, category, isDeceased }: CelebrityCreditsProps) {
  const getItem = useLibraryStore((state) => state.getItem);

  const getDisplayTitle = () => {
    const categoryData = CELEBRITY_CATEGORIES.find((c) => c.id === category);
    return categoryData ? categoryData.label : 'Known For';
  };

  return (
    <>
      {/* Results Header */}
      <motion.div
        className='border-Grey-800/50 flex items-center justify-between border-b pb-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <h2 className='text-lg font-semibold text-white'>
            {isDeceased && category === 'recent' ? 'Final Works' : getDisplayTitle()}
          </h2>
          <p className='text-Grey-400 mt-1 text-sm'>
            {category === 'recent' && isDeceased
              ? 'Their final contributions to entertainment'
              : category
                ? CELEBRITY_CATEGORIES.find((c) => c.id === category)?.description
                : 'Most popular and acclaimed works'}
          </p>
        </div>
        <div>
          <SortBy
            options={[
              { key: 'popularity', label: 'Popularity' },
              { key: 'rating', label: 'Rating' },
              { key: 'date', label: 'Release Date' },
              { key: 'title', label: 'Title' },
            ]}
            defaultSort='popularity'
          />
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {currentContent.length > 0 ? (
          <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5'>
            {currentContent.map((item, index) => {
              console.log(generateMediaId(item));
              console.log(getItem(generateMediaId(item)));
              return (
                <BaseMediaCard
                  key={`${item.media_type}-${item.id}-${index}`}
                  id={item.id}
                  title={item.title || item.name || ''}
                  mediaType={item.media_type}
                  posterPath={item.poster_path}
                  releaseDate={item.release_date || item.first_air_date}
                  rating={item.vote_average}
                  genres={getGenres(item.genre_ids)}
                  media={item as Media}
                  item={getItem(generateMediaId(item))}
                  celebrityRoles={item.roles}
                  primaryRole={item.primaryRole}
                />
              );
            })}
          </div>
        ) : (
          <div className='bg-blur rounded-xl border border-white/10 p-12 text-center backdrop-blur-xl'>
            <div className='text-Grey-400 space-y-2'>
              <Film className='mx-auto h-8 w-8' />
              <p className='text-lg font-medium'>No content found</p>
              <p className='text-sm'>This celebrity doesn't have any {category || 'known'} works available.</p>
            </div>
          </div>
        )}
      </motion.section>
    </>
  );
}
