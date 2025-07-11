import { Star, Film, Tv, Mic, Users, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

// eslint-disable-next-line react-refresh/only-export-components
export const CELEBRITY_CATEGORIES = [
  {
    id: 'known-for',
    label: 'Known For',
    description: 'Most popular and acclaimed works',
    icon: Star,
  },
  {
    id: 'movies',
    label: 'Movies',
    description: 'Film appearances and roles',
    icon: Film,
  },
  {
    id: 'tv',
    label: 'TV Shows',
    description: 'Television series and appearances',
    icon: Tv,
  },
  {
    id: 'voice',
    label: 'Voice',
    description: 'Animation and voice acting work',
    icon: Mic,
  },
  {
    id: 'guest',
    label: 'Guest',
    description: 'Guest appearances and special features',
    icon: Users,
  },
  {
    id: 'production',
    label: 'Production',
    description: 'Writing, directing, and producing work',
    icon: Clapperboard,
  },
];

interface CelebrityCategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  credits: { 'known-for': number; movies: number; tv: number; voice: number; guest: number; production: number };
  availableCategories?: string[];
}

export default function CelebrityCategories({
  selectedCategory,
  onCategorySelect,
  credits,
  availableCategories,
}: CelebrityCategoriesProps) {
  const visibleCategories = availableCategories
    ? CELEBRITY_CATEGORIES.filter((cat) => availableCategories.includes(cat.id))
    : CELEBRITY_CATEGORIES;

  return (
    <motion.div
      className='flex flex-wrap gap-3'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {visibleCategories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={cn(
              'group flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200',
              isActive
                ? 'from-Secondary-500 to-Secondary-600 border-white/20 bg-gradient-to-r text-white shadow-lg shadow-black/20'
                : 'bg-Grey-800/50 text-Grey-300 border-Grey-700/50 hover:bg-Grey-700/50 hover:border-Grey-600/50 hover:text-white'
            )}
          >
            <Icon className={cn('h-4 w-4 transition-transform group-hover:scale-110', isActive && 'drop-shadow-sm')} />
            <span className='text-sm font-medium'>
              {cat.label} ({credits[cat.id as keyof typeof credits]})
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
