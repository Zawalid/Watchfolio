import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock,
  Cloud,
  Film,
  Heart,
  Eye,
  Bookmark,
  Award,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
  Play,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Link } from 'react-router';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInFromLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInFromRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

const features = [
  {
    icon: Star,
    title: 'Track Your Journey',
    description:
      "Rate and review everything you watch with our intuitive 1-10 system. Build your personal taste profile that gets smarter over time, helping you discover content you'll actually love.",
    highlights: [
      'Rate from 1-10 with meaningful labels',
      'Track what you loved vs what you hated',
      'Build your personal taste profile over time',
    ],
    color: 'from-Warning-500 to-Tertiary-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4'>
        <div className='text-Warning-400 mb-3 text-xs font-medium sm:text-sm'>Your Latest Ratings</div>
        <div className='space-y-2 sm:space-y-3'>
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
              className='flex items-center gap-2 rounded-lg bg-white/5 p-2 sm:gap-3 sm:p-3'
            >
              <div className='from-Warning-500/40 to-Tertiary-500/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b sm:h-12 sm:w-12'>
                <Star className='text-Warning-400 h-4 w-4 fill-current sm:h-5 sm:w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='truncate text-xs font-medium text-white sm:text-sm'>{item.title}</div>
                <div className='flex items-center gap-1 sm:gap-2'>
                  <div className='flex items-center'>
                    {[...Array(10)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${
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
    title: 'Never Lose Your Library',
    description:
      'Your entire viewing universe syncs seamlessly across all devices. Start watching on your phone, continue on your laptop, and pick up exactly where you left off.',
    highlights: [
      'Instant sync across all your devices',
      'Never lose your library data',
      'Works seamlessly in the background',
    ],
    color: 'from-Secondary-500 to-Primary-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4'>
        <div className='text-Secondary-400 mb-3 text-xs font-medium sm:text-sm'>Sync Status</div>
        <div className='space-y-2 sm:space-y-3'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='flex items-center gap-2 rounded-lg bg-white/5 p-2 sm:gap-3 sm:p-3'
          >
            <div className='from-Secondary-500/40 to-Primary-500/40 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b sm:h-10 sm:w-10'>
              <Cloud className='text-Secondary-400 h-4 w-4 sm:h-5 sm:w-5' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='text-xs font-medium text-white sm:text-sm'>All Devices Synced</div>
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

          <div className='grid grid-cols-3 gap-1 sm:gap-2'>
            {['Phone', 'Laptop', 'Tablet'].map((device, i) => (
              <motion.div
                key={device}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className='bg-Secondary-500/10 border-Secondary-500/20 rounded-lg border p-1.5 text-center sm:p-2'
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
    title: 'Find & Add in Seconds',
    description:
      'Our lightning-fast search finds any movie or show instantly. Add to your library with one click, and use keyboard shortcuts for power users who want to move at speed.',
    highlights: [
      'Find and add content in seconds',
      'Smart search with instant results',
      'Keyboard shortcuts for power users',
    ],
    color: 'from-Primary-500 to-Warning-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4'>
        <div className='text-Primary-400 mb-3 text-xs font-medium sm:text-sm'>Quick Add</div>
        <div className='space-y-2 sm:space-y-3'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='border-Primary-500/30 flex items-center gap-2 rounded-lg border bg-white/10 p-2'
          >
            <Search className='text-Primary-400 h-3 w-3 sm:h-4 sm:w-4' />
            <motion.div className='text-xs text-white sm:text-sm' initial={{ width: 0 }} animate={{ width: 'auto' }}>
              <span className='opacity-60'>Search:</span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                {' '}
                "Dune"
              </motion.span>
            </motion.div>
          </motion.div>

          <div className='space-y-1 sm:space-y-2'>
            {[
              { title: 'Dune: Part Two', year: '2024' },
              { title: 'Dune', year: '2021' },
            ].map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className='hover:border-Primary-500/30 flex cursor-pointer items-center justify-between rounded-lg border border-transparent bg-white/5 p-2 hover:bg-white/10'
              >
                <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
                  <div className='from-Primary-500/40 to-Warning-500/40 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-to-b text-xs font-bold text-white sm:h-8 sm:w-8'>
                    {result.year.slice(-2)}
                  </div>
                  <div className='min-w-0'>
                    <div className='truncate text-xs font-medium text-white'>{result.title}</div>
                    <div className='text-Grey-400 text-xs'>Movie • {result.year}</div>
                  </div>
                </div>
                <div className='text-Primary-400 text-lg sm:text-xl'>+</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Target,
    title: 'Organize Your Watchlist',
    description:
      'Transform your "want to watch" list into a smart, organized system. Categorize by mood, priority, and status so you always know exactly what to watch next.',
    highlights: [
      'Organize by status, priority, and mood',
      'Never wonder what to watch next',
      'Smart suggestions based on your preferences',
    ],
    color: 'from-Tertiary-500 to-Secondary-500',
    mockup: (
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4'>
        <div className='text-Tertiary-400 mb-3 text-xs font-medium sm:text-sm'>Your Watchlist</div>
        <div className='space-y-2 sm:space-y-3'>
          {[
            { title: 'The Bear', status: 'Plan to Watch', priority: 'High' },
            { title: 'House of the Dragon', status: 'Watching', priority: 'Medium' },
            { title: 'Severance', status: 'On Hold', priority: 'Low' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 + 0.5 }}
              className='flex items-center gap-2 rounded-lg bg-white/5 p-2 sm:gap-3 sm:p-3'
            >
              <div className='from-Tertiary-500/40 to-Secondary-500/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b sm:h-12 sm:w-12'>
                <Target className='text-Tertiary-400 h-4 w-4 sm:h-5 sm:w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='truncate text-xs font-medium text-white sm:text-sm'>{item.title}</div>
                <div className='flex flex-wrap items-center gap-1 sm:gap-2'>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs sm:px-2 ${
                      item.status === 'Plan to Watch'
                        ? 'bg-Success-500/20 text-Success-400'
                        : item.status === 'Watching'
                          ? 'bg-Primary-500/20 text-Primary-400'
                          : 'bg-Warning-500/20 text-Warning-400'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className='text-Grey-400 text-xs'>• {item.priority} Priority</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function LandingPage() {
  const { openAuthModal } = useAuthStore();

  return (
    <div className='relative overflow-hidden'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible'>
        <section className='flex min-h-screen items-center justify-center px-4 sm:px-6'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div variants={itemVariants} className='space-y-4 sm:space-y-6'>
              <motion.div
                variants={itemVariants}
                className='border-Primary-500/30 bg-Primary-500/10 text-Primary-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm'
              >
                <Sparkles className='h-3 w-3 sm:h-4 sm:w-4' />
                <span>Welcome to Watchfolio</span>
                <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
              </motion.div>

              <motion.div variants={itemVariants} className='space-y-3 sm:space-y-4'>
                <h1 className='heading flex flex-wrap justify-center gap-2 text-3xl sm:gap-3 sm:text-4xl md:text-5xl lg:text-6xl'>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    Your
                  </motion.span>
                  <motion.span
                    className='gradient inline!'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Watchlist
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    Universe
                  </motion.span>
                </h1>

                <motion.p
                  variants={itemVariants}
                  className='text-Grey-400 mx-auto max-w-xl text-sm leading-relaxed sm:text-base lg:text-lg'
                >
                  Track what you watch. Discover what's next.
                  <br />
                  <span className='text-Grey-300'>Build your personal viewing journey.</span>
                </motion.p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row'
              >
                <Button
                  onPress={() => openAuthModal('signup')}
                  size='md'
                  color='primary'
                  className='button-primary! w-full px-6! sm:w-auto'
                  endContent={<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />}
                >
                  Start Your Journey
                </Button>
                <Button
                  as={Link}
                  to='/home'
                  size='md'
                  className='button-secondary! w-full bg-transparent! px-6! sm:w-auto'
                  startContent={<Play className='h-4 w-4' />}
                >
                  Browse Trending
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className='relative mt-12 sm:mt-16'>
              <div className='relative mx-auto max-w-4xl'>
                <motion.div
                  variants={cardVariants}
                  className='bg-blur overflow-hidden rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl sm:rounded-2xl'
                >
                  <div className='xs:p-6 p-3 sm:p-6'>
                    <div className='xs:gap-6 grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-5'>
                      <div className='xs:space-y-4 space-y-3 sm:space-y-4 lg:col-span-3'>
                        <div className='xs:gap-3 flex items-center gap-2 sm:gap-3'>
                          <div className='from-Primary-500 to-Secondary-500 xs:h-8 xs:w-8 xs:rounded-lg flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br sm:h-8 sm:w-8'>
                            <TrendingUp className='xs:h-4 xs:w-4 h-3 w-3 text-white sm:h-4 sm:w-4' />
                          </div>
                          <span className='xs:text-base text-xs font-semibold text-white sm:text-sm'>
                            Trending This Week
                          </span>
                          <div className='bg-Success-500/20 text-Success-400 xs:px-2.5 xs:py-1 flex-shrink-0 rounded-full px-1.5 py-0.5 text-xs sm:px-2 sm:py-1'>
                            Live
                          </div>
                        </div>

                        <div className='xs:grid xs:grid-cols-1 xs:gap-4 xs:space-y-0 space-y-2 sm:grid-cols-2 sm:gap-3'>
                          {[
                            {
                              title: 'Dune: Part Two',
                              rating: '8.9',
                              year: '2024',
                              genre: 'Sci-Fi',
                              status: 'Watching',
                            },
                            { title: 'Oppenheimer', rating: '8.5', year: '2023', genre: 'Drama', status: 'Completed' },
                          ].map((movie, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 + i * 0.1 }}
                              className='group xs:rounded-lg xs:p-4 cursor-pointer rounded-md border border-white/10 bg-white/5 p-2.5 transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:rounded-xl sm:p-3'
                            >
                              <div className='xs:gap-4 flex gap-2.5 sm:gap-3'>
                                <div className='from-Primary-500/30 to-Secondary-500/30 xs:h-14 xs:w-12 flex h-10 w-8 flex-shrink-0 items-center justify-center rounded bg-gradient-to-b sm:h-12 sm:w-8'>
                                  <Film className='text-Primary-400 xs:h-5 xs:w-5 h-3.5 w-3.5 sm:h-4 sm:w-4' />
                                </div>
                                <div className='xs:space-y-2 min-w-0 flex-1 space-y-0.5 sm:space-y-2'>
                                  <h3 className='group-hover:text-Primary-300 xs:text-base truncate text-xs font-semibold text-white transition-colors sm:text-sm'>
                                    {movie.title}
                                  </h3>
                                  <div className='flex items-center justify-between'>
                                    <div className='text-Grey-400 xs:gap-2 xs:text-sm flex items-center gap-1 text-xs sm:gap-2'>
                                      <div className='xs:gap-1 flex items-center gap-0.5 sm:gap-1'>
                                        <Star className='text-Warning-400 xs:h-3.5 xs:w-3.5 h-2.5 w-2.5 fill-current sm:h-2.5 sm:w-2.5' />
                                        <span>{movie.rating}</span>
                                      </div>
                                      <span>•</span>
                                      <span>{movie.year}</span>
                                      <span className='mobile:inline hidden'>•</span>
                                      <span className='mobile:inline hidden'>{movie.genre}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className='xs:mt-0 xs:space-y-4 mt-4 space-y-3 sm:space-y-4 lg:col-span-2'>
                        <div className='xs:gap-3 flex items-center gap-2 sm:gap-3'>
                          <div className='from-Success-500 to-Secondary-500 xs:h-8 xs:w-8 xs:rounded-lg flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br sm:h-8 sm:w-8'>
                            <BarChart3 className='xs:h-4 xs:w-4 h-3 w-3 text-white sm:h-4 sm:w-4' />
                          </div>
                          <span className='xs:text-base text-xs font-semibold text-white sm:text-sm'>Your Library</span>
                        </div>

                        <div className='xs:space-y-3 space-y-1.5 sm:space-y-2'>
                          {[
                            { icon: Eye, label: 'Watching', count: '12', color: 'text-Secondary-400', trend: '+2' },
                            {
                              icon: Bookmark,
                              label: 'Watchlist',
                              count: '47',
                              color: 'text-Tertiary-400',
                              trend: '+5',
                            },
                            { icon: Star, label: 'Favorites', count: '23', color: 'text-Warning-400', trend: '+1' },
                            { icon: Award, label: 'Completed', count: '156', color: 'text-Success-400', trend: '+8' },
                          ].map((stat, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2 + i * 0.1 }}
                              className='xs:rounded-lg xs:p-4 flex items-center justify-between rounded-md border border-white/10 bg-white/5 p-2 transition-all duration-300 hover:bg-white/10 sm:p-3'
                            >
                              <div className='xs:gap-4 flex items-center gap-2 sm:gap-3'>
                                <div
                                  className={`${stat.color} xs:h-10 xs:w-10 xs:rounded-lg flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/10 sm:h-8 sm:w-8`}
                                >
                                  <stat.icon className='xs:h-5 xs:w-5 h-3 w-3 sm:h-4 sm:w-4' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <div className='text-Grey-300 xs:text-base text-xs font-medium sm:text-sm'>
                                    {stat.label}
                                  </div>
                                  <div className='text-Grey-400 xs:text-sm text-xs'>{stat.trend} this week</div>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='xs:text-xl text-sm font-bold text-white sm:text-lg'>{stat.count}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  className='border-Primary-500/20 bg-Primary-500/10 xs:-top-3 xs:-left-3 xs:h-16 xs:w-24 xs:rounded-xl xs:p-3 mobile:block absolute -top-1 -left-1 hidden h-12 w-18 rounded border p-1.5 backdrop-blur-sm sm:-top-3 sm:-left-3 sm:h-16 sm:w-24 sm:rounded-xl sm:p-3'
                >
                  <div className='xs:gap-2 flex items-center gap-0.5 sm:gap-2'>
                    <Heart className='text-Error-400 xs:h-3 xs:w-3 h-2.5 w-2.5 sm:h-3 sm:w-3' />
                    <span className='text-xs font-medium text-white'>Liked</span>
                  </div>
                  <div className='xs:text-lg text-xs font-bold text-white sm:text-lg'>89</div>
                  <div className='text-Success-400 text-xs'>+12%</div>
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  className='border-Secondary-500/20 bg-Secondary-500/10 xs:-top-3 xs:-right-3 xs:h-16 xs:w-24 xs:rounded-xl xs:p-3 mobile:block absolute -top-1 -right-1 hidden h-12 w-18 rounded border p-1.5 backdrop-blur-sm sm:-top-3 sm:-right-3 sm:h-16 sm:w-24 sm:rounded-xl sm:p-3'
                >
                  <div className='xs:gap-2 flex items-center gap-0.5 sm:gap-2'>
                    <Clock className='text-Secondary-400 xs:h-3 xs:w-3 h-2.5 w-2.5 sm:h-3 sm:w-3' />
                    <span className='text-xs font-medium text-white'>Hours</span>
                  </div>
                  <div className='xs:text-lg text-xs font-bold text-white sm:text-lg'>234</div>
                  <div className='text-Success-400 text-xs'>+8%</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>

      <motion.section
        className='px-4 py-12 sm:px-6 sm:py-16'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className='mx-auto max-w-5xl'>
          <motion.div variants={itemVariants} className='mb-8 space-y-2 text-center sm:mb-12 sm:space-y-3'>
            <h2 className='heading text-2xl sm:text-3xl lg:text-4xl'>
              Trusted by
              <span className='gradient'>Entertainment Enthusiasts</span>
            </h2>
            <p className='text-Grey-400 mx-auto max-w-xl text-sm sm:text-base'>
              Join thousands of users who have transformed how they track and discover entertainment
            </p>
          </motion.div>

          <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8'>
            {[
              { icon: Users, value: '10,000+', label: 'Active Users', color: 'from-Primary-500 to-Secondary-500' },
              { icon: Star, value: '500K+', label: 'Shows Rated', color: 'from-Warning-500 to-Tertiary-500' },
              { icon: Clock, value: '2M+', label: 'Hours Tracked', color: 'from-Success-500 to-Secondary-500' },
              {
                icon: TrendingUp,
                value: '50K+',
                label: 'Watchlists Created',
                color: 'from-Tertiary-500 to-Warning-500',
              },
            ].map((stat) => (
              <motion.div key={stat.label} variants={scaleInVariants} className='group text-center'>
                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 sm:rounded-2xl'>
                  <div
                    className={`h-6 w-6 rounded-lg bg-gradient-to-br sm:h-10 sm:w-10 sm:rounded-xl ${stat.color} p-1 shadow-lg sm:p-2`}
                  >
                    <stat.icon className='h-full w-full text-white' />
                  </div>
                </div>
                <div className='space-y-0.5 sm:space-y-1'>
                  <div className='text-lg font-bold text-white sm:text-2xl'>{stat.value}</div>
                  <div className='text-Grey-400 text-xs sm:text-sm'>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className='overflow-x-hidden px-4 py-16 sm:px-6 sm:py-20'>
        <div className='mx-auto max-w-6xl'>
          <motion.div
            className='mb-12 space-y-3 text-center sm:mb-16 sm:space-y-4'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
          >
            <h2 className='heading text-2xl sm:text-3xl lg:text-4xl'>
              Everything You Need to
              <span className='gradient'>Master Your Viewing</span>
            </h2>
            <p className='text-Grey-400 mx-auto max-w-2xl text-sm leading-relaxed sm:text-base lg:text-lg'>
              Powerful tools designed for movie and TV enthusiasts. Track, organize, and discover your next favorite
              show with precision and ease.
            </p>
          </motion.div>

          <div className='space-y-16 pt-8 sm:space-y-20 sm:pt-12 lg:space-y-24'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.2 }}
                className={`flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                <motion.div
                  variants={index % 2 !== 0 ? slideInFromRightVariants : slideInFromLeftVariants}
                  className='flex-1 space-y-4 sm:space-y-6 lg:space-y-8'
                >
                  <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6'>
                    <div
                      className={`h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br sm:h-20 sm:w-20 sm:rounded-2xl ${feature.color} p-4 shadow-xl sm:p-5`}
                    >
                      <feature.icon className='h-full w-full text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-white sm:text-2xl lg:text-3xl'>{feature.title}</h3>
                      <div className='from-Primary-500 to-Secondary-500 mt-2 h-1 w-16 rounded-full bg-gradient-to-r sm:w-20' />
                    </div>
                  </div>
                  <p className='text-Grey-300 text-base leading-relaxed sm:text-lg lg:text-xl'>{feature.description}</p>
                  <div className='space-y-3 sm:space-y-4'>
                    {feature.highlights.map((highlight, i) => (
                      <motion.div key={i} className='flex items-start gap-3 sm:gap-4'>
                        <div className='bg-Success-500/20 text-Success-400 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6'>
                          <Check className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
                        </div>
                        <span className='text-Grey-300 text-sm sm:text-base lg:text-lg'>{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  variants={index % 2 !== 0 ? slideInFromLeftVariants : slideInFromRightVariants}
                  className='relative w-full flex-1'
                >
                  <div
                    className={`from-Primary-500/10 to-Secondary-500/10 absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br via-transparent opacity-50 blur-xl sm:-inset-6 sm:rounded-3xl`}
                  />
                  {feature.mockup}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-4 pt-12 sm:px-6 sm:py-20'>
        <div className='mx-auto max-w-4xl'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.5 }}
            variants={scaleInVariants}
            className='relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center backdrop-blur-xl sm:rounded-3xl sm:p-12'
          >
            <div className='from-Primary-500/20 to-Secondary-500/20 absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-3xl' />
            <div className='from-Tertiary-500/20 to-Success-500/20 absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-3xl' />

            <motion.div variants={containerVariants} className='relative space-y-6 sm:space-y-8'>
              <motion.div variants={itemVariants} className='space-y-3 sm:space-y-4'>
                <div className='border-Success-500/30 bg-Success-500/10 text-Success-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm'>
                  <Sparkles className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span>Ready to transform your viewing experience</span>
                </div>
                <h3 className='heading text-2xl sm:text-3xl lg:text-4xl'>Ready to build your universe?</h3>
                <p className='text-Grey-300 mx-auto max-w-2xl text-sm leading-relaxed sm:text-base lg:text-xl'>
                  Join thousands of users who have transformed how they track and discover content. Start your journey
                  today and never lose track of what you love.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'
              >
                <Button
                  size='lg'
                  className='button-primary! w-full px-8 text-base font-semibold! sm:w-auto sm:px-10! sm:text-lg!'
                  endContent={
                    <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5' />
                  }
                  onPress={() => openAuthModal('signup')}
                >
                  Start Your Journey Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
