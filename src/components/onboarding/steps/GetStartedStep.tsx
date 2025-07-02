import { motion } from 'framer-motion';
import { Sparkles, Play, Search, BookOpen, Star } from 'lucide-react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useNavigate } from 'react-router';

const quickStarts = [
  {
    icon: Search,
    title: 'Add Your First Movie or Show',
    description: "Search and add something you've recently watched",
    action: 'Search Now',
    route: '/search',
  },
  {
    icon: Star,
    title: 'Rate Your Favorites',
    description: 'Rate content to build your personal taste profile',
    action: 'Start Rating',
    route: '/library',
  },
  {
    icon: BookOpen,
    title: 'Explore Your Library',
    description: "View and organize everything you've added",
    action: 'View Library',
    route: '/library',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
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
  const { completeOnboarding } = useOnboardingStore();
  const navigate = useNavigate();

  const handleActionClick = (start: (typeof quickStarts)[0]) => {
    completeOnboarding();
    navigate(start.route, { state: { fromOnboarding: true, action: start.action } });
  };

  return (
    <div className='mx-auto max-w-3xl space-y-12 text-center'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='relative space-y-6'>
        <motion.div
          variants={itemVariants}
          className='border-Success-500/30 bg-Success-500/10 text-Success-300 relative mb-8 inline-flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm backdrop-blur-xl'
        >
          <div className='from-Success-500/10 to-Primary-500/10 absolute inset-0 bg-gradient-to-r opacity-50' />
          <Sparkles className='relative z-10 h-4 w-4' />
          <span className='relative z-10 font-medium'>You're All Set!</span>
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent'
          />
        </motion.div>

        <motion.div variants={itemVariants} className='space-y-4'>
          <h1 className='text-2xl leading-tight font-black text-white sm:text-3xl'>
            Ready to Start
            <span className='gradient-text'>Your Journey?</span>
          </h1>
          <p className='text-Grey-400 mx-auto max-w-2xl text-lg leading-relaxed'>
            Jump right in and start building your personal entertainment collection.
          </p>
        </motion.div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.3 }}
        className='space-y-6'
      >
        <motion.div variants={itemVariants} className='space-y-2 text-center'>
          <h2 className='text-lg font-bold text-white'>What's Next?</h2>
          <p className='text-Grey-400 text-sm'>Choose your starting point</p>
        </motion.div>

        <motion.div variants={itemVariants} className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {quickStarts.map((start, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className='group rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10'
              onClick={() => handleActionClick(start)}
            >
              <div className='space-y-3'>
                <div className='bg-Grey-800 mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 transition-colors group-hover:border-white/20'>
                  <start.icon className='text-Primary-400 h-5 w-5' />
                </div>
                <div className='space-y-1'>
                  <h3 className='group-hover:text-Primary-300 text-sm font-semibold text-white transition-colors'>
                    {start.title}
                  </h3>
                  <p className='text-Grey-400 group-hover:text-Grey-300 text-xs leading-relaxed transition-colors'>
                    {start.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Final Action */}
      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.6 }}
        className='space-y-4'
      >
        <div className='text-Grey-400 flex items-center justify-center gap-3 text-sm'>
          <Play className='text-Primary-400 h-4 w-4' />
          <span>Start tracking your entertainment today</span>
        </div>
      </motion.div>
    </div>
  );
}
