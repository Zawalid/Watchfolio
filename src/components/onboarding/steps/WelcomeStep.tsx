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
    <div className='mobile:space-y-12 mx-auto max-w-3xl space-y-8 text-center'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='mobile:space-y-6 relative space-y-4'
      >
        <motion.div
          variants={itemVariants}
          className='border-Success-500/30 bg-Success-500/10 text-Success-300 mobile:mb-8 mobile:px-6 mobile:py-3 mobile:text-sm relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-xs backdrop-blur-xl'
        >
          <div className='from-Success-500/10 to-Primary-500/10 absolute inset-0 bg-gradient-to-r opacity-50' />
          <Sparkles className='mobile:h-4 mobile:w-4 relative z-10 h-3 w-3' />
          <span className='relative z-10 font-medium'>Account Created Successfully!</span>
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent'
          />
        </motion.div>

        <motion.div variants={itemVariants} className='mobile:space-y-4 space-y-3'>
          <h1 className='xs:text-2xl mobile:text-3xl text-xl leading-tight font-black text-white'>
            Welcome to
            <span className='gradient inline'> Watchfolio</span>
          </h1>

          <motion.p
            variants={itemVariants}
            className='text-Grey-300 xs:text-base mobile:text-lg mx-auto max-w-2xl text-sm leading-relaxed'
          >
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
        className='xs:grid-cols-3 mobile:gap-8 grid grid-cols-1 gap-6 pt-6 text-center'
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
            <div className='mobile:h-12 mobile:w-12 mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5'>
              <feature.icon className={`h-4 w-4 ${feature.color} mobile:h-5 mobile:w-5`} />
            </div>
            <div>
              <div className='mobile:text-sm text-xs font-semibold text-white'>{feature.title}</div>
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
        className='from-Primary-500/5 via-Secondary-500/5 to-Tertiary-500/5 mobile:rounded-3xl mobile:p-8 rounded-2xl border border-white/20 bg-gradient-to-br p-4 backdrop-blur-xl'
      >
        <div className='mobile:space-y-8 space-y-6'>
          <div className='text-center'>
            <div className='from-Primary-500/20 to-Secondary-500/20 border-Primary-500/30 mobile:mb-4 mobile:px-4 mobile:py-2 mb-3 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-3 py-1.5'>
              <div className='from-Primary-400 to-Secondary-400 mobile:h-2 mobile:w-2 h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-r' />
              <span className='text-Primary-300 mobile:text-sm text-xs font-medium'>Let's get you started</span>
            </div>
            <h3 className='mobile:mb-3 mobile:text-xl mb-2 text-lg font-bold text-white'>What's next?</h3>
            <p className='text-Grey-300 mobile:text-base mx-auto max-w-md text-sm leading-relaxed'>
              We'll help you set up your preferences to get personalized recommendations just for you.
            </p>
          </div>

          <div className='mobile:flex-row flex flex-col items-center justify-center gap-x-6 mobile:gap-x-8 gap-y-3'>
            {[
              { step: 1, title: 'Welcome', status: 'current', icon: '🎉' },
              { step: 2, title: 'Taste Setup', status: 'upcoming', icon: '🎯' },
              { step: 3, title: 'Get Started', status: 'upcoming', icon: '🚀' },
            ].map((item, index) => (
              <div key={index} className='mobile:flex-row flex flex-col items-center mobile:gap-6 gap-3'>
                <div className='mobile:gap-3 flex flex-col items-center gap-2'>
                  <div
                    className={`mobile:h-14 mobile:w-14 mobile:rounded-2xl relative flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-500 ${
                      item.status === 'current'
                        ? 'border-Primary-400 from-Primary-500/30 to-Secondary-500/30 shadow-Primary-500/25 bg-gradient-to-br text-white shadow-lg'
                        : 'border-Grey-600/50 bg-Grey-800/30 text-Grey-400'
                    }`}
                  >
                    <span className='mobile:text-lg text-base'>{item.icon}</span>
                    {item.status === 'current' && (
                      <motion.div
                        className='from-Primary-500/20 to-Secondary-500/20 mobile:rounded-2xl absolute -inset-2 rounded-xl bg-gradient-to-r'
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className='text-center'>
                    <div
                      className={`mobile:text-sm text-xs font-semibold ${
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
                  <div className='from-Grey-600/30 via-Grey-500/50 to-Grey-600/30 mobile:h-0.5 mobile:w-8 flex w-0.5 h-8 bg-gradient-to-r' />
                )}
              </div>
            ))}
          </div>

          <div className='text-center'>
            <div className='from-Primary-500/15 to-Secondary-500/15 border-Primary-500/25 mobile:gap-3 mobile:rounded-2xl mobile:px-6 mobile:py-3 inline-flex items-center gap-2 rounded-xl border bg-gradient-to-r px-4 py-2'>
              <div className='mobile:gap-2 flex items-center gap-1.5'>
                <div className='from-Primary-400 to-Secondary-400 mobile:h-3 mobile:w-3 h-2.5 w-2.5 animate-pulse rounded-full bg-gradient-to-r' />
                <span className='text-Primary-200 mobile:text-sm text-xs font-medium'>You're on step 1 of 3</span>
              </div>
              <div className='bg-Grey-600 mobile:h-4 h-3 w-px' />
              <span className='text-Grey-400 mobile:text-sm text-xs'>Almost there!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
