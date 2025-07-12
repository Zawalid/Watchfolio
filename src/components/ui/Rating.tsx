import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/utils';
import { getRating } from '@/utils/media';

export function Rating({ rating, className }: { rating?: number; className?: string }) {
  const getBgColor = (rating: number) => {
    if (rating >= 8) return 'bg-Success-500/20 border-Success-500/50 text-Success-400 ring-Success-500/30';
    if (rating >= 7) return 'bg-Success-500/20 border-Success-500/50 text-Success-400 ring-Success-500/30';
    if (rating >= 6) return 'bg-Warning-500/20 border-Warning-500/50 text-Warning-400 ring-Warning-500/30';
    if (rating >= 5) return 'bg-Warning-500/20 border-Warning-500/50 text-Warning-400 ring-Warning-500/30';
    return 'bg-Error-500/20 border-Error-500/50 text-Error-400 ring-Error-500/30';
  };

  return (
    <motion.div
      className={cn(
        'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md',
        getBgColor(rating || 0),
        className
      )}
    >
      <Star className='size-4' />
      <span>{getRating(rating || 0)}</span>
    </motion.div>
  );
}
