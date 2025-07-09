import { motion } from 'framer-motion';
import { Gem, Eye, Heart, Users, TrendingDown } from 'lucide-react';
import { Button } from '@heroui/button';
import { Link } from 'react-router';

const hiddenGems = [
  {
    id: 1,
    title: "The Handmaiden",
    year: 2016,
    rating: 8.1,
    genre: ["Thriller", "Romance"],
    description: "A psychological thriller masterpiece from South Korea that deserves more recognition.",
    reasons: ["Stunning cinematography", "Complex narrative", "Underrated globally"],
    poster: "/images/placeholder.png",
    mediaType: "movie",
    director: "Park Chan-wook",
    runtime: "145 min"
  },
  {
    id: 2,
    title: "Dark",
    year: 2017,
    rating: 8.8,
    genre: ["Sci-Fi", "Mystery"],
    description: "German sci-fi series that rivals the best of Netflix but remains overlooked.",
    reasons: ["Mind-bending plot", "Excellent German production", "Perfect conclusion"],
    poster: "/images/placeholder.png",
    mediaType: "tv",
    creator: "Baran bo Odar",
    seasons: "3 seasons"
  },
  {
    id: 3,
    title: "Hunt for the Wilderpeople",
    year: 2016,
    rating: 7.8,
    genre: ["Comedy", "Adventure"],
    description: "Heartwarming New Zealand adventure that's pure joy to watch.",
    reasons: ["Feel-good story", "Beautiful scenery", "Taika Waititi magic"],
    poster: "/images/placeholder.png",
    mediaType: "movie",
    director: "Taika Waititi",
    runtime: "101 min"
  },
  {
    id: 4,
    title: "Mindhunter",
    year: 2017,
    rating: 8.6,
    genre: ["Crime", "Drama"],
    description: "Cancelled too soon, this psychological crime series was Netflix's best kept secret.",
    reasons: ["Psychological depth", "Historical accuracy", "Incredible performances"],
    poster: "/images/placeholder.png",
    mediaType: "tv",
    creator: "Joe Penhall",
    seasons: "2 seasons"
  }
];

const reasons = [
  { icon: <Eye className="w-4 h-4" />, label: "Overlooked", color: "bg-blue-500/20 text-blue-300" },
  { icon: <Heart className="w-4 h-4" />, label: "Critics' Choice", color: "bg-red-500/20 text-red-300" },
  { icon: <Users className="w-4 h-4" />, label: "Cult Following", color: "bg-purple-500/20 text-purple-300" },
  { icon: <TrendingDown className="w-4 h-4" />, label: "Underrated", color: "bg-orange-500/20 text-orange-300" }
];

interface GemCardProps {
  gem: typeof hiddenGems[0];
  index: number;
}

const GemCard = ({ gem, index }: GemCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      delay: index * 0.1, 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }}
    className="group"
  >
    <div className="bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 transition-all duration-500 h-full group-hover:scale-105 rounded-xl">
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="w-20 h-28 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <Gem className="w-8 h-8 text-emerald-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-white text-lg leading-tight">
                {gem.title}
              </h3>
              <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full">
                <Eye className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">{gem.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/70 text-sm">{gem.year}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/70 text-sm">
                {gem.mediaType === 'tv' ? gem.seasons : gem.runtime}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {gem.genre.slice(0, 2).map((g, idx) => (
                <div 
                  key={idx}
                  className="bg-white/10 text-white/80 text-xs h-5 px-2 py-1 rounded-full"
                >
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {gem.description}
        </p>

        <div className="space-y-2 mb-4">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wide">
            Why it's a gem:
          </p>
          <div className="flex flex-wrap gap-1">
            {gem.reasons.slice(0, 2).map((reason, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-1 bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-lg text-xs"
              >
                <Gem className="w-3 h-3" />
                {reason}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-white/50 text-xs">
            {gem.mediaType === 'tv' ? `Created by ${gem.creator}` : `Directed by ${gem.director}`}
          </div>
          
          <Button
            as={Link}
            to={`/${gem.mediaType}/${gem.id}`}
            size="sm"
            variant="ghost"
            className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300"
          >
            Discover
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HiddenGemsSection() {
  return (
    <div className="w-full px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Hidden Gems
            </h2>
            <p className="text-white/70 text-sm md:text-base">
              Discover overlooked masterpieces that deserve your attention
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {reasons.map((reason, idx) => (
            <div 
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${reason.color} backdrop-blur-sm`}
            >
              {reason.icon}
              <span className="text-xs font-medium">{reason.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hiddenGems.map((gem, index) => (
          <GemCard key={gem.id} gem={gem} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 text-center"
      >
        <Button
          variant="ghost"
          className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
        >
          Explore More Hidden Gems
        </Button>
      </motion.div>
    </div>
  );
}
