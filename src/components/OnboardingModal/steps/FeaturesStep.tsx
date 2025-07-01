import { motion } from 'framer-motion';
import { Search, BarChart3, Star, TrendingUp, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'AI-powered recommendations based on your viewing history and preferences',
    color: 'from-Primary-500 to-Secondary-500',
    mockup: (
      <div className="space-y-2">
        <div className="text-xs text-Primary-400 font-medium mb-2">Recommended for You</div>
        <div className="grid grid-cols-2 gap-2">
          {['The Bear', 'Wednesday', 'Dune', 'Oppenheimer'].map((title, i) => (
            <div key={i} className="rounded bg-white/10 p-2">
              <div className="w-full h-8 rounded bg-gradient-to-b from-Primary-500/30 to-Secondary-500/30 mb-1"></div>
              <div className="text-xs text-white truncate">{title}</div>
              <div className="text-xs text-Success-400">95% match</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Automatically sync your viewing progress across all devices and platforms',
    color: 'from-Secondary-500 to-Tertiary-500',
    mockup: (
      <div className="space-y-3">
        <div className="text-xs text-Secondary-400 font-medium">Your Progress</div>
        {[
          { title: 'Breaking Bad', progress: 85 },
          { title: 'The Office', progress: 60 },
          { title: 'Stranger Things', progress: 100 },
        ].map((show, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white">{show.title}</span>
              <span className="text-Grey-400">{show.progress}%</span>
            </div>
            <div className="w-full h-1 bg-Grey-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-Secondary-500 to-Tertiary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${show.progress}%` }}
                transition={{ delay: i * 0.2, duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Star,
    title: 'Personal Ratings',
    description: 'Rate and review content to build your personalized entertainment database',
    color: 'from-Warning-500 to-Tertiary-500',
    mockup: (
      <div className="space-y-3">
        <div className="text-xs text-Warning-400 font-medium">Your Ratings</div>
        <div className="text-center">
          <div className="text-2xl text-Warning-400 font-bold">4.8★</div>
          <div className="text-xs text-Grey-400">Average Rating</div>
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="text-center">
              <div className="w-3 h-6 bg-Warning-500/20 rounded-sm mb-1"></div>
              <div className="text-xs text-Grey-400">{star}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: TrendingUp,
    title: 'Trending & Popular',
    description: 'Stay current with what\'s trending worldwide and discover popular content',
    color: 'from-Success-500 to-Secondary-500',
    mockup: (
      <div className="space-y-2">
        <div className="text-xs text-Success-400 font-medium">Trending Now</div>
        <div className="space-y-2">
          {['House of Dragon', 'The Last of Us', 'Wednesday'].map((title, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-6 h-8 rounded bg-gradient-to-b from-Success-500/30 to-Secondary-500/30"></div>
              <div className="flex-1">
                <div className="text-xs text-white">{title}</div>
                <div className="text-xs text-Success-400">#{i + 1} Trending</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: 'Social Features',
    description: 'Connect with friends, share lists, and get recommendations from your network',
    color: 'from-Error-500 to-Primary-500',
    mockup: (
      <div className="space-y-3">
        <div className="text-xs text-Error-400 font-medium">Social Stats</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-Error-500/20 rounded p-2">
            <div className="text-sm font-bold text-Error-400">24</div>
            <div className="text-xs text-Grey-400">Friends</div>
          </div>
          <div className="bg-Primary-500/20 rounded p-2">
            <div className="text-sm font-bold text-Primary-400">12</div>
            <div className="text-xs text-Grey-400">Shared</div>
          </div>
          <div className="bg-Secondary-500/20 rounded p-2">
            <div className="text-sm font-bold text-Secondary-400">8</div>
            <div className="text-xs text-Grey-400">Lists</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant search, keyboard shortcuts, and optimized performance for speed',
    color: 'from-Warning-500 to-Error-500',
    mockup: (
      <div className="text-center space-y-3">
        <div className="text-xs text-Warning-400 font-medium">Performance</div>
        <div className="space-y-2">
          <div>
            <div className="text-2xl text-Warning-400 font-black">&lt;50ms</div>
            <div className="text-xs text-Grey-400">Search Response</div>
          </div>
          <div>
            <div className="text-lg text-Success-400 font-bold">24/7</div>
            <div className="text-xs text-Grey-400">Uptime</div>
          </div>
        </div>
      </div>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

export default function FeaturesStep() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-black text-white">
          Powerful Features for
          <span className="block bg-gradient-to-r from-Primary-400 to-Secondary-400 bg-clip-text text-transparent">
            Entertainment Lovers
          </span>
        </h2>
        <p className="text-lg text-Grey-400 max-w-2xl mx-auto leading-relaxed">
          Every feature is designed to enhance how you discover, track, and enjoy movies and TV shows
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              {/* Icon and title */}
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-Primary-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-Grey-400 leading-relaxed group-hover:text-Grey-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Interactive mockup */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 min-h-[120px]">
                {feature.mockup}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-sm text-Grey-400">
          And much more to discover as you explore Watchfolio!
        </p>
      </motion.div>
    </div>
  );
}
