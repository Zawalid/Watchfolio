import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Search, Plus, Star, TrendingUp, Film, Tv } from 'lucide-react';

const quickActions = [
  {
    icon: Search,
    title: 'Discover Content',
    description: 'Browse trending movies and TV shows',
    action: 'Browse Trending',
    color: 'from-Primary-500 to-Secondary-500',
    href: '/movies/trending'
  },
  {
    icon: Plus,
    title: 'Build Your Watchlist',
    description: 'Add movies and shows you want to watch',
    action: 'Add to Watchlist',
    color: 'from-Secondary-500 to-Tertiary-500',
    href: '/movies/popular'
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description: 'Start rating content to get better recommendations',
    action: 'Start Rating',
    color: 'from-Tertiary-500 to-Warning-500',
    href: '/movies/top-rated'
  },
  {
    icon: TrendingUp,
    title: 'Explore Popular',
    description: 'See what everyone is talking about',
    action: 'View Popular',
    color: 'from-Success-500 to-Secondary-500',
    href: '/tv/popular'
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function GetStartedStep() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-Success-500/30 bg-Success-500/10 backdrop-blur-sm text-sm text-Success-300 mb-4">
          <span className="text-lg">🎉</span>
          <span>You're All Set!</span>
        </div>

        <h2 className="text-3xl font-black text-white">
          Ready to Start
          <span className="block bg-gradient-to-r from-Success-400 to-Secondary-400 bg-clip-text text-transparent">
            Your Journey?
          </span>
        </h2>
        <p className="text-lg text-Grey-400 max-w-2xl mx-auto leading-relaxed">
          Here are some great ways to begin building your entertainment universe in Watchfolio.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} p-3 shadow-lg flex-shrink-0`}>
                  <action.icon className="w-full h-full text-white" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-Primary-300 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-Grey-400 leading-relaxed group-hover:text-Grey-300 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>
              </div>

              <Button
                color="primary"
                variant="bordered"
                className="w-full border-white/20 text-white hover:bg-Primary-500/10 hover:border-Primary-500/50"
                onPress={() => {
                  // In a real app, you'd navigate to the href
                  console.log(`Navigate to ${action.href}`);
                }}
              >
                {action.action}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-lg">💡</span>
          Pro Tips
        </h3>
        
        <div className="space-y-3 text-sm text-Grey-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-Primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-Primary-400 text-xs font-bold">1</span>
            </div>
            <p>Start by rating a few movies or shows you've already watched to improve recommendations</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-Secondary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-Secondary-400 text-xs font-bold">2</span>
            </div>
            <p>Use the search feature to quickly find specific content or discover new releases</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-Success-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-Success-400 text-xs font-bold">3</span>
            </div>
            <p>Check out the trending section to see what's popular right now</p>
          </div>
        </div>
      </motion.div>

      {/* Final encouragement */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4 text-2xl">
          <Film className="text-Primary-400" />
          <span>🍿</span>
          <Tv className="text-Secondary-400" />
        </div>
        
        <p className="text-Grey-400">
          Welcome to your personalized entertainment universe!
        </p>
      </motion.div>
    </div>
  );
}
