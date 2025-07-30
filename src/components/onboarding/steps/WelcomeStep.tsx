import { motion } from 'framer-motion';
import { Sparkles, Star, TrendingUp, Heart } from 'lucide-react';

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

export default function WelcomeStep() {
  return (
    <div className='mx-auto max-w-3xl space-y-12 text-center'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='relative space-y-6'>
        <motion.div
          variants={itemVariants}
          className='border-Success-500/30 bg-Success-500/10 text-Success-300 relative mb-8 inline-flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm backdrop-blur-xl'
        >
          <div className='from-Success-500/10 to-Primary-500/10 absolute inset-0 bg-gradient-to-r opacity-50' />
          <Sparkles className='relative z-10 h-4 w-4' />
          <span className='relative z-10 font-medium'>Account Created Successfully!</span>
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent'
          />
        </motion.div>

        <motion.div variants={itemVariants} className='space-y-4'>
          <h1 className='text-2xl leading-tight font-black text-white sm:text-3xl'>
            Welcome to
            <span className='gradient-text'> Watchfolio</span>
          </h1>

          <motion.p variants={itemVariants} className='text-Grey-300 mx-auto max-w-2xl text-lg leading-relaxed'>
            Your personal entertainment universe is ready! Let's personalize your experience by learning about your
            taste and preferences.
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.4 }}
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
            transition={{ delay: 0.6 + index * 0.1 }}
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

      <motion.div
        variants={itemVariants}
        initial='hidden'
        animate='visible'
        transition={{ delay: 0.8 }}
        className='from-Primary-500/5 via-Secondary-500/5 to-Tertiary-500/5 rounded-3xl border border-white/20 bg-gradient-to-br p-8 backdrop-blur-xl'
      >
        <div className='space-y-8'>
          <div className='text-center'>
            <div className='from-Primary-500/20 to-Secondary-500/20 border-Primary-500/30 mb-4 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2'>
              <div className='from-Primary-400 to-Secondary-400 h-2 w-2 animate-pulse rounded-full bg-gradient-to-r' />
              <span className='text-Primary-300 text-sm font-medium'>Let's get you started</span>
            </div>
            <h3 className='mb-3 text-xl font-bold text-white'>What's next?</h3>
            <p className='text-Grey-300 mx-auto max-w-md text-base leading-relaxed'>
              We'll help you set up your preferences to get personalized recommendations just for you.
            </p>
          </div>

          <div className='flex items-center justify-center gap-8'>
            {[
              { step: 1, title: 'Welcome', status: 'current', icon: '🎉' },
              { step: 2, title: 'Taste Setup', status: 'upcoming', icon: '🎯' },
              { step: 3, title: 'Get Started', status: 'upcoming', icon: '🚀' },
            ].map((item, index) => (
              <div key={index} className='flex items-center gap-4'>
                <div className='flex flex-col items-center gap-3'>
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
                      item.status === 'current'
                        ? 'border-Primary-400 from-Primary-500/30 to-Secondary-500/30 shadow-Primary-500/25 bg-gradient-to-br text-white shadow-lg'
                        : 'border-Grey-600/50 bg-Grey-800/30 text-Grey-400'
                    }`}
                  >
                    <span className='text-lg'>{item.icon}</span>
                    {item.status === 'current' && (
                      <motion.div
                        className='from-Primary-500/20 to-Secondary-500/20 absolute -inset-2 rounded-2xl bg-gradient-to-r'
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className='text-center'>
                    <div
                      className={`text-sm font-semibold ${
                        item.status === 'current' ? 'text-Primary-300' : 'text-Grey-400'
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className={`text-xs ${item.status === 'current' ? 'text-Primary-400' : 'text-Grey-500'}`}>
                      Step {item.step}
                    </div>
                  </div>
                </div>

                {index < 2 && (
                  <div className='from-Grey-600/30 via-Grey-500/50 to-Grey-600/30 flex h-0.5 w-12 bg-gradient-to-r' />
                )}
              </div>
            ))}
          </div>

          <div className='text-center'>
            <div className='from-Primary-500/15 to-Secondary-500/15 border-Primary-500/25 inline-flex items-center gap-3 rounded-2xl border bg-gradient-to-r px-6 py-3'>
              <div className='flex items-center gap-2'>
                <div className='from-Primary-400 to-Secondary-400 h-3 w-3 animate-pulse rounded-full bg-gradient-to-r' />
                <span className='text-Primary-200 text-sm font-medium'>You're on step 1 of 3</span>
              </div>
              <div className='bg-Grey-600 h-4 w-px' />
              <span className='text-Grey-400 text-sm'>Almost there!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
