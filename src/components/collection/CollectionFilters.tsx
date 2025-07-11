import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Crown, 
  Heart, 
  Skull, 
  Laugh, 
  Users,
  Grid3x3
} from 'lucide-react';
import { cn } from '@/utils';

type CollectionCategory = 'blockbusters' | 'superheroes' | 'action' | 'classics' | 'family' | 'horror' | 'comedy' | 'teen';

interface CollectionFiltersProps {
  categories: CollectionCategory[];
  selectedCategory: CollectionCategory | 'all';
  onCategoryChange: (category: CollectionCategory | 'all') => void;
}

// Category configuration with icons and descriptions
const categoryConfig: Record<CollectionCategory | 'all', {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  gradient: string;
}> = {
  all: {
    label: 'All Collections',
    icon: Grid3x3,
    description: 'View all movie collections',
    gradient: 'from-Grey-500 to-Grey-600',
  },
  blockbusters: {
    label: 'Blockbusters',
    icon: Crown,
    description: 'Epic franchise collections',
    gradient: 'from-Primary-500 to-Primary-600',
  },
  superheroes: {
    label: 'Superheroes',
    icon: Zap,
    description: 'Marvel, DC and more',
    gradient: 'from-Secondary-500 to-Secondary-600',
  },
  action: {
    label: 'Action',
    icon: Target,
    description: 'High-octane adventures',
    gradient: 'from-Error-500 to-Error-600',
  },
  classics: {
    label: 'Classics',
    icon: Crown,
    description: 'Legendary cinema',
    gradient: 'from-Warning-500 to-Warning-600',
  },
  family: {
    label: 'Family',
    icon: Heart,
    description: 'Fun for all ages',
    gradient: 'from-Success-500 to-Success-600',
  },
  horror: {
    label: 'Horror',
    icon: Skull,
    description: 'Spine-chilling series',
    gradient: 'from-Error-600 to-Error-700',
  },
  comedy: {
    label: 'Comedy',
    icon: Laugh,
    description: 'Laugh-out-loud collections',
    gradient: 'from-Tertiary-500 to-Tertiary-600',
  },
  teen: {
    label: 'Teen',
    icon: Users,
    description: 'Young adult favorites',
    gradient: 'from-Secondary-400 to-Secondary-500',
  },
};

export function CollectionFilters({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CollectionFiltersProps) {
  const allCategories: (CollectionCategory | 'all')[] = ['all', ...categories];

  return (
    <div className="space-y-4">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3">
        {allCategories.map((category) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const isActive = selectedCategory === category;

          return (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'group flex items-center gap-2.5 rounded-xl border px-4 py-3 transition-all duration-200 min-w-fit',
                isActive
                  ? `bg-gradient-to-r ${config.gradient} border-white/20 text-white shadow-lg shadow-black/20`
                  : 'bg-Grey-800/50 text-Grey-300 border-Grey-700/50 hover:bg-Grey-700/50 hover:border-Grey-600/50 hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform group-hover:scale-110',
                  isActive && 'drop-shadow-sm'
                )}
              />
              <div className="text-left">
                <span className="text-sm font-medium block">{config.label}</span>
                {isActive && (
                  <span className="text-xs opacity-90 block">{config.description}</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Category Description */}
      {selectedCategory !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 p-4 rounded-lg bg-Grey-800/30 border border-Grey-700/50"
        >
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryConfig[selectedCategory].gradient} flex items-center justify-center`}>
            {(() => {
              const Icon = categoryConfig[selectedCategory].icon;
              return <Icon className="w-4 h-4 text-white" />;
            })()}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">
              {categoryConfig[selectedCategory].label} Collections
            </h3>
            <p className="text-Grey-400 text-xs">
              {categoryConfig[selectedCategory].description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
