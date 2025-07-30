import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import LibraryCardsList from './LibraryCardsList';
import { MediaCardSkeleton } from '@/components/media/MediaCardsListSkeleton';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

interface LibraryInfiniteCardsListProps {
  items: LibraryMedia[];
  allItems?: LibraryMedia[];
  status: LibraryFilterStatus;
  isOwnProfile: boolean;
  chunkSize?: number;
}

export default function LibraryInfiniteCardsList({
  items,
  allItems,
  status,
  isOwnProfile,
  chunkSize = 20,
}: LibraryInfiniteCardsListProps) {
  const [visibleCount, setVisibleCount] = useState(chunkSize);
  const { ref, inView } = useInView({ rootMargin: '200px' });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const statusLabel = LIBRARY_MEDIA_STATUS.find((s) => s.value === status)?.label || 'Library';

  useEffect(() => {
    setVisibleCount(chunkSize); 
  }, [items, status, chunkSize]);

  useEffect(() => {
    if (inView && visibleCount < items.length) {
      setIsLoadingMore(true);
      const timeout = setTimeout(() => {
        setVisibleCount((v) => Math.min(v + chunkSize, items.length));
        setIsLoadingMore(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [inView, visibleCount, items.length, chunkSize]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  return (
    <>
      <LibraryCardsList items={visibleItems} allItems={allItems} status={status} isOwnProfile={isOwnProfile}>
        {isLoadingMore && Array.from({ length: 10 }).map((_, index) => <MediaCardSkeleton key={index} />)}
      </LibraryCardsList>
      {items.length && (
        <div ref={ref} className='flex justify-center py-6'>
          {allItems?.length === visibleItems.length && allItems?.length >= 20 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex justify-center py-3'>
              <div className='text-Grey-400 text-sm'>
                You've reached the end of your {statusLabel.toLowerCase()} items
              </div>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}
