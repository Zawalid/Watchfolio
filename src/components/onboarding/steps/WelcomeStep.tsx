import { motion } from 'framer-motion';
import { Sparkles, Play, Film, Star, TrendingUp, Clock, Heart, Plus } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const floatingVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: 'backOut' },
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

export default function WelcomeStep() {
  return (
    <div className='mx-auto max-w-3xl space-y-12 text-center'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='relative space-y-6'>
        <motion.div
          variants={itemVariants}
          className='border-Primary-500/30 bg-Primary-500/10 text-Primary-300 relative mb-8 inline-flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm backdrop-blur-xl'
        >
          <div className='from-Primary-500/10 to-Secondary-500/10 absolute inset-0 bg-gradient-to-r opacity-50' />
          <Sparkles className='relative z-10 h-4 w-4' />
          <span className='relative z-10 font-medium'>Welcome to Watchfolio</span>
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent'
          />
        </motion.div>

        <motion.div variants={itemVariants} className='space-y-4'>
          <h1 className='text-2xl leading-tight font-black text-white sm:text-3xl'>
            Your Entertainment,
            <span className='gradient-text'>Organized</span>
          </h1>

          <motion.p variants={itemVariants} className='text-Grey-300 mx-auto max-w-2xl text-lg leading-relaxed'>
            Keep track of what you're watching, what you've watched, and what's next on your list. Your personal
            entertainment library, perfectly organized.
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.4 }}
        className='relative'
      >
        <div className='relative mx-auto max-w-lg'>
          <div className='bg-blur relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl'>
            <div className='from-Primary-500/10 to-Secondary-500/10 border-b border-white/5 bg-gradient-to-r p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='from-Primary-500 to-Secondary-500 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br'>
                    <Film className='h-4 w-4 text-white' />
                  </div>
                  <span className='font-semibold text-white'>Watchfolio</span>
                </div>
                <div className='flex gap-1'>
                  <div className='bg-Error-500 h-2 w-2 rounded-full'></div>
                  <div className='bg-Warning-500 h-2 w-2 rounded-full'></div>
                  <div className='bg-Success-500 h-2 w-2 rounded-full'></div>
                </div>
              </div>

              <div className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2'>
                <div className='bg-Primary-500/30 h-4 w-4 rounded' />
                <div className='h-2 w-32 rounded bg-white/20' />
              </div>
            </div>

            <div className='space-y-4 p-4'>
              <div className='space-y-2'>
                <div className='mb-3 flex items-center gap-2'>
                  <Play className='text-Success-400 h-4 w-4' />
                  <span className='text-Success-400 text-xs font-medium'>Continue Watching</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className='flex items-center gap-3 rounded-lg bg-white/5 p-2'
                >
                  <div className='from-Secondary-500/30 to-Tertiary-500/30 h-16 w-12 rounded bg-gradient-to-b' />
                  <div className='flex-1 space-y-1'>
                    <div className='text-xs font-medium text-white'>The Bear - S3E5</div>
                    <div className='bg-Grey-700 h-1 w-full overflow-hidden rounded-full'>
                      <motion.div
                        className='from-Success-500 to-Secondary-500 h-full rounded-full bg-gradient-to-r'
                        initial={{ width: 0 }}
                        animate={{ width: '68%' }}
                        transition={{ delay: 1.2, duration: 1 }}
                      />
                    </div>
                    <div className='text-Grey-400 text-xs'>23 min remaining</div>
                  </div>
                  <div className='bg-Success-500/20 flex h-6 w-6 items-center justify-center rounded-full'>
                    <Play className='text-Success-400 h-3 w-3' />
                  </div>
                </motion.div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Heart className='text-Error-400 h-4 w-4' />
                  <span className='text-Error-400 text-xs font-medium'>Your Watchlist</span>
                </div>

                <div className='grid grid-cols-3 gap-2'>
                  {[
                    { title: 'Dune: Part Two', color: 'from-Warning-500/40 to-Error-500/40' },
                    { title: 'House of Dragon', color: 'from-Success-500/40 to-Secondary-500/40' },
                    { title: 'The Last of Us', color: 'from-Primary-500/40 to-Tertiary-500/40' },
                  ].map((movie, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + i * 0.1 }}
                      className='space-y-1'
                    >
                      <div className={`h-12 w-full rounded bg-gradient-to-b ${movie.color} relative overflow-hidden`}>
                        <div className='absolute inset-0 bg-black/20' />
                        <div className='bg-Error-500/80 absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full'>
                          <Plus className='h-2 w-2 text-white' />
                        </div>
                      </div>
                      <div className='truncate px-1 text-xs text-white'>{movie.title}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div variants={floatingVariants} initial='hidden' animate='visible' transition={{ delay: 0.8 }}>
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className='from-Primary-500/20 to-Secondary-500/20 border-Primary-500/30 absolute -top-6 -left-6 min-w-max rounded-xl border bg-gradient-to-br p-3 backdrop-blur-xl'
            >
              <div className='flex items-center gap-2'>
                <Star className='text-Warning-400 h-4 w-4 fill-current' />
                <div>
                  <div className='text-Warning-400 text-xs font-bold'>Rated</div>
                  <div className='text-xs text-white'>24 shows</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={floatingVariants} initial='hidden' animate='visible' transition={{ delay: 1.0 }}>
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className='from-Success-500/20 to-Secondary-500/20 border-Success-500/30 absolute -right-6 -bottom-6 min-w-max rounded-xl border bg-gradient-to-br p-3 backdrop-blur-xl'
            >
              <div className='flex items-center gap-2'>
                <TrendingUp className='text-Success-400 h-4 w-4' />
                <div>
                  <div className='text-Success-400 text-xs font-bold'>Tracking</div>
                  <div className='text-xs text-white'>12 series</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={floatingVariants} initial='hidden' animate='visible' transition={{ delay: 1.2 }}>
            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className='from-Tertiary-500/20 to-Warning-500/20 border-Tertiary-500/30 absolute top-1/2 -right-8 rounded-xl border bg-gradient-to-br p-2 backdrop-blur-xl'
            >
              <div className='text-center'>
                <Clock className='text-Tertiary-400 mx-auto mb-1 h-4 w-4' />
                <div className='text-Tertiary-400 text-xs font-bold'>23h</div>
                <div className='text-xs text-white'>Watched</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.8 }}
        className='grid grid-cols-1 gap-8 pt-8 text-center sm:grid-cols-3'
      >
        {[
          {
            icon: TrendingUp,
            title: 'Track Progress',
            desc: 'Never lose your place',
            color: 'text-Success-400',
          },
          {
            icon: Heart,
            title: 'Build Watchlists',
            desc: 'Save for later viewing',
            color: 'text-Error-400',
          },
          {
            icon: Star,
            title: 'Rate & Review',
            desc: 'Remember what you loved',
            color: 'text-Warning-400',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className='space-y-3'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
          >
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5'>
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <div>
              <div className='text-sm font-semibold text-white'>{feature.title}</div>
              <div className='text-Grey-400 text-xs'>{feature.desc}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
