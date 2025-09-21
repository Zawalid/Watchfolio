import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Cloud, Zap, Target } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Rate Everything',
    description:
      'Rate movies and shows from 1-10 stars with meaningful labels. Build your personal taste profile over time.',
    color: 'from-Warning-500 to-Tertiary-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Warning-400 mb-3 text-sm font-medium'>Your Latest Ratings</div>
        <div className='space-y-3'>
          {[
            { title: 'Dune: Part Two', rating: 9, label: 'Excellent' },
            { title: 'The Last of Us', rating: 8, label: 'Great' },
            { title: 'Wednesday', rating: 7, label: 'Very Good' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 + 0.5 }}
              className='flex items-center gap-3 rounded-lg bg-white/5 p-3'
            >
              <div className='from-Warning-500/40 to-Tertiary-500/40 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-b'>
                <Star className='text-Warning-400 h-5 w-5 fill-current' />
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium text-white'>{item.title}</div>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center'>
                    {[...Array(10)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-2.5 w-2.5 ${
                          starIndex < item.rating ? 'text-Warning-400 fill-current' : 'text-Grey-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-Grey-400 text-xs'>
                    {item.rating}/10 - {item.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Cloud,
    title: 'Instant Cloud Sync',
    description:
      'Your library syncs seamlessly across all devices. Add something on your phone, see it everywhere instantly.',
    color: 'from-Secondary-500 to-Primary-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Secondary-400 mb-3 text-sm font-medium'>Sync Status</div>
        <div className='space-y-3'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='flex items-center gap-3 rounded-lg bg-white/5 p-3'
          >
            <div className='from-Secondary-500/40 to-Primary-500/40 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b'>
              <Cloud className='text-Secondary-400 h-5 w-5' />
            </div>
            <div className='flex-1'>
              <div className='text-sm font-medium text-white'>All Devices Synced</div>
              <div className='text-Grey-400 text-xs'>Last sync: Just now</div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              className='bg-Success-500/20 text-Success-400 rounded-full px-2 py-1 text-xs'
            >
              ✓ Synced
            </motion.div>
          </motion.div>

          <div className='grid grid-cols-3 gap-2'>
            {['Phone', 'Laptop', 'Tablet'].map((device, i) => (
              <motion.div
                key={device}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className='bg-Secondary-500/10 border-Secondary-500/20 rounded-lg border p-2 text-center'
              >
                <div className='text-xs font-medium text-white'>{device}</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className='text-Success-400 text-xs'
                >
                  ✓ Online
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'Lightning Quick Add',
    description: 'Search and add movies or shows to your library in seconds. With keyboard shortcuts and smart search.',
    color: 'from-Primary-500 to-Warning-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Primary-400 mb-3 text-sm font-medium'>Quick Add</div>
        <div className='space-y-3'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='border-Primary-500/30 flex items-center gap-2 rounded-lg border bg-white/10 p-2'
          >
            <div className='text-Primary-400'>🔍</div>
            <motion.div
              className='text-sm text-white'
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <span className='opacity-60'>Search: </span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
                "Dune"
              </motion.span>
            </motion.div>
          </motion.div>

          <div className='space-y-2'>
            {[
              { title: 'Dune: Part Two', year: '2024', type: 'Movie' },
              { title: 'Dune', year: '2021', type: 'Movie' },
            ].map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className='hover:border-Primary-500/30 flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-white/5 p-2 hover:bg-white/10'
              >
                <div className='from-Primary-500/40 to-Warning-500/40 flex h-8 w-8 items-center justify-center rounded bg-gradient-to-b'>
                  <span className='text-xs font-bold text-white'>{result.year.slice(-2)}</span>
                </div>
                <div className='flex-1'>
                  <div className='text-xs font-medium text-white'>{result.title}</div>
                  <div className='text-Grey-400 text-xs'>
                    {result.type} • {result.year}
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className='text-Primary-400 text-xl'
                >
                  +
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Target,
    title: 'Smart Watchlist',
    description: 'Organize your "want to watch" list by status, priority, and mood. Never wonder what to watch next.',
    color: 'from-Tertiary-500 to-Secondary-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Tertiary-400 mb-3 text-sm font-medium'>Your Watchlist</div>
        <div className='space-y-3'>
          {[
            { title: 'The Bear', status: 'Plan to Watch', priority: 'High', mood: 'Comedy' },
            { title: 'House of the Dragon', status: 'Watching', priority: 'Medium', mood: 'Drama' },
            { title: 'Severance', status: 'On Hold', priority: 'Low', mood: 'Thriller' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 + 0.5 }}
              className='flex items-center gap-3 rounded-lg bg-white/5 p-3'
            >
              <div className='from-Tertiary-500/40 to-Secondary-500/40 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-b'>
                <Target className='text-Tertiary-400 h-5 w-5' />
              </div>
              <div className='flex-1'>
                <div className='text-sm font-medium text-white'>{item.title}</div>
                <div className='flex items-center gap-2'>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      item.status === 'Plan to Watch'
                        ? 'bg-Success-500/20 text-Success-400'
                        : item.status === 'Watching'
                          ? 'bg-Primary-500/20 text-Primary-400'
                          : 'bg-Warning-500/20 text-Warning-400'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className='text-Grey-400 text-xs'>
                    {item.priority} • {item.mood}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function FeaturesStep() {
  const [currentFeature, setCurrentFeature] = useState(0);

  // Auto-advance through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentFeatureData = features[currentFeature];

  return (
    <div className='mobile:space-y-8 mx-auto max-w-4xl space-y-6'>
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        className='mobile:space-y-4 space-y-3 text-center'
      >
        <h2 className='mobile:text-2xl text-xl leading-tight font-black text-white sm:text-3xl'>
          Your Entertainment Library,
          <span className='gradient-text'>Perfectly Organized</span>
        </h2>
        <p className='text-Grey-300 mobile:text-lg mx-auto max-w-2xl text-base leading-relaxed'>
          Rate, sync, and organize everything you watch—never lose track again
        </p>
      </motion.div>

      {/* Feature indicators */}
      <div className='flex justify-center gap-2'>
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentFeature ? 'bg-Primary-400 w-8' : 'bg-Grey-600 hover:bg-Grey-500'
            }`}
          />
        ))}
      </div>

      {/* Main feature display */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='mobile:gap-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-2'
        >
          {/* Feature content */}
          <div className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${currentFeatureData.color} p-4 shadow-xl`}>
                <currentFeatureData.icon className='h-full w-full text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white'>{currentFeatureData.title}</h3>
                <div className='mt-1 flex items-center gap-2'>
                  <span className='text-Primary-400 text-xs font-medium'>
                    {currentFeature + 1} of {features.length}
                  </span>
                </div>
              </div>
            </div>

            <p className='text-Grey-300 text-lg leading-relaxed'>{currentFeatureData.description}</p>

            {/* Feature highlights */}
            <div className='space-y-3'>
              {currentFeature === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='space-y-2'
                >
                  {[
                    'Rate from 1-10 with meaningful labels',
                    'Track what you loved vs what you hated',
                    'Build your personal taste profile over time',
                  ].map((highlight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className='text-Grey-400 flex items-center gap-2 text-sm'
                    >
                      <div className='bg-Warning-400 h-1.5 w-1.5 rounded-full' />
                      {highlight}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentFeature === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='space-y-2'
                >
                  {[
                    'Instant sync across all your devices',
                    'Never lose your library data',
                    'Works seamlessly in the background',
                  ].map((highlight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className='text-Grey-400 flex items-center gap-2 text-sm'
                    >
                      <div className='bg-Secondary-400 h-1.5 w-1.5 rounded-full' />
                      {highlight}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentFeature === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='space-y-2'
                >
                  {[
                    'Find and add content in seconds',
                    'Smart search with instant results',
                    'Keyboard shortcuts for power users',
                  ].map((highlight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className='text-Grey-400 flex items-center gap-2 text-sm'
                    >
                      <div className='bg-Primary-400 h-1.5 w-1.5 rounded-full' />
                      {highlight}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentFeature === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className='space-y-2'
                >
                  {[
                    'Organize by status, priority, and mood',
                    'Never wonder what to watch next',
                    'Smart suggestions based on your preferences',
                  ].map((highlight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className='text-Grey-400 flex items-center gap-2 text-sm'
                    >
                      <div className='bg-Tertiary-400 h-1.5 w-1.5 rounded-full' />
                      {highlight}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Interactive mockup */}
          <div className='relative'>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='relative'
            >
              {currentFeatureData.mockup}
            </motion.div>

            {/* Decorative gradient overlay */}
            <div className='from-Primary-500/10 to-Secondary-500/10 absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br via-transparent' />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom summary */}
      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.8 }}
        className='mobile:pt-8 pt-6 text-center'
      >
        <p className='text-Grey-400 mobile:text-sm text-xs'>
          Simple tools, powerful organization. Your entertainment, perfectly tracked.
        </p>
      </motion.div>
    </div>
  );
}
