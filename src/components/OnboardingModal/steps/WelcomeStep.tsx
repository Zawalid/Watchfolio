import { motion } from 'framer-motion';
import { Sparkles, Play, Film } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  },
};

export default function WelcomeStep() {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Welcome badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-Primary-500/30 bg-Primary-500/10 backdrop-blur-sm text-sm text-Primary-300 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>Welcome to Watchfolio</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-black text-white leading-tight"
        >
          Your Entertainment
          <span className="block bg-gradient-to-r from-Primary-400 to-Secondary-400 bg-clip-text text-transparent">
            Universe Awaits
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg text-Grey-400 leading-relaxed max-w-lg mx-auto"
        >
          Discover, track, and organize your movies and TV shows like never before. 
          Let's get you started on your entertainment journey.
        </motion.p>
      </motion.div>

      {/* Illustrated mockup */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="relative mx-auto max-w-md">
          {/* Main app preview */}
          <div className="rounded-2xl border border-white/10 bg-blur backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-Primary-500/10 to-Secondary-500/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-Primary-500 to-Secondary-500 flex items-center justify-center">
                    <Film className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold">Watchfolio</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-Error-500"></div>
                  <div className="w-2 h-2 rounded-full bg-Warning-500"></div>
                  <div className="w-2 h-2 rounded-full bg-Success-500"></div>
                </div>
              </div>
              
              {/* Mock content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 rounded bg-gradient-to-b from-Primary-500/30 to-Secondary-500/30"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-24 h-2 bg-white/20 rounded"></div>
                    <div className="w-16 h-1.5 bg-white/10 rounded"></div>
                  </div>
                  <div className="w-6 h-6 rounded bg-Success-500/20 flex items-center justify-center">
                    <Play className="w-3 h-3 text-Success-400" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 rounded bg-gradient-to-b from-Secondary-500/30 to-Tertiary-500/30"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-20 h-2 bg-white/20 rounded"></div>
                    <div className="w-12 h-1.5 bg-white/10 rounded"></div>
                  </div>
                  <div className="w-6 h-6 rounded bg-Primary-500/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-Primary-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-4 w-16 h-12 rounded-lg border border-Primary-500/20 bg-Primary-500/10 backdrop-blur-sm p-2"
          >
            <div className="text-xs text-Primary-400 font-medium">★ 9.2</div>
            <div className="text-xs text-white">Trending</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -right-4 w-16 h-12 rounded-lg border border-Secondary-500/20 bg-Secondary-500/10 backdrop-blur-sm p-2"
          >
            <div className="text-xs text-Secondary-400 font-medium">47</div>
            <div className="text-xs text-white">Watchlist</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features preview */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4 text-center"
      >
        {[
          { icon: '🎬', title: 'Discover', desc: 'Find your next obsession' },
          { icon: '📊', title: 'Track', desc: 'Never lose progress' },
          { icon: '⭐', title: 'Rate', desc: 'Build your taste profile' },
        ].map((feature, index) => (
          <div key={index} className="space-y-2">
            <div className="text-2xl">{feature.icon}</div>
            <div className="text-sm font-semibold text-white">{feature.title}</div>
            <div className="text-xs text-Grey-400">{feature.desc}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
