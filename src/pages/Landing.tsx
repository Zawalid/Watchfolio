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
              <div className='from-Warning-500/40 to-Tertiary-500/40 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b'>
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
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Secondary-400 mb-3 text-sm font-medium'>Sync Status</div>
        <div className='space-y-3'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='flex items-center gap-3 rounded-lg bg-white/5 p-3'
          >
            <div className='from-Secondary-500/40 to-Primary-500/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b'>
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
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Primary-400 mb-3 text-sm font-medium'>Quick Add</div>
        <div className='space-y-3'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='border-Primary-500/30 flex items-center gap-2 rounded-lg border bg-white/10 p-2'
          >
            <Search className='text-Primary-400 h-4 w-4' />
            <motion.div className='text-sm text-white' initial={{ width: 0 }} animate={{ width: 'auto' }}>
              <span className='opacity-60'>Search:</span>
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
                {' '}
                "Dune"
              </motion.span>
            </motion.div>
          </motion.div>

          <div className='space-y-2'>
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
                <div className='flex items-center gap-3'>
                  <div className='from-Primary-500/40 to-Warning-500/40 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gradient-to-b text-xs font-bold text-white'>
                    {result.year.slice(-2)}
                  </div>
                  <div>
                    <div className='text-xs font-medium text-white'>{result.title}</div>
                    <div className='text-Grey-400 text-xs'>Movie • {result.year}</div>
                  </div>
                </div>
                <div className='text-Primary-400 text-xl'>+</div>
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
      <div className='space-y-4 rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='text-Tertiary-400 mb-3 text-sm font-medium'>Your Watchlist</div>
        <div className='space-y-3'>
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
              className='flex items-center gap-3 rounded-lg bg-white/5 p-3'
            >
              <div className='from-Tertiary-500/40 to-Secondary-500/40 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b'>
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
        <section className='flex min-h-screen items-center justify-center px-6'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div variants={itemVariants} className='space-y-6'>
              {/* Announcement Banner */}
              <motion.div
                variants={itemVariants}
                className='border-Primary-500/30 bg-Primary-500/10 text-Primary-300 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm'
              >
                <Sparkles className='h-4 w-4' />
                <span>Welcome to Watchfolio</span>
                <ChevronRight className='h-4 w-4' />
              </motion.div>

              {/* Main Headline */}
              <motion.div variants={itemVariants} className='space-y-4'>
                <h1 className='heading space-x-3'>
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
                  className='text-Grey-400 mx-auto max-w-xl text-base leading-relaxed sm:text-lg'
                >
                  Track what you watch. Discover what's next.
                  <br />
                  <span className='text-Grey-300'>Build your personal viewing journey.</span>
                </motion.p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className='flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row'
              >
                <Button
                  onPress={() => openAuthModal('signup')}
                  size='md'
                  color='primary'
                  className='button-primary! px-6!'
                  endContent={<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />}
                >
                  Start Your Journey
                </Button>
                <Button
                  as={Link}
                  to='/home'
                  size='md'
                  className='button-secondary! bg-transparent! px-6!'
                  startContent={<Play className='h-4 w-4' />}
                >
                  Browse Trending
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating preview cards */}
            <motion.div variants={itemVariants} className='relative mt-16'>
              <div className='relative mx-auto max-w-4xl'>
                <motion.div
                  variants={cardVariants}
                  className='bg-blur overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl'
                >
                  <div className='p-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
                      {/* Left side - Movie showcase */}
                      <div className='space-y-4 lg:col-span-3'>
                        <div className='flex items-center gap-3'>
                          <div className='from-Primary-500 to-Secondary-500 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br'>
                            <TrendingUp className='h-4 w-4 text-white' />
                          </div>
                          <span className='text-sm font-semibold text-white'>Trending This Week</span>
                          <div className='bg-Success-500/20 text-Success-400 rounded-full px-2 py-1 text-xs'>Live</div>
                        </div>

                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
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
                              className='group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10'
                            >
                              <div className='flex gap-3'>
                                <div className='from-Primary-500/30 to-Secondary-500/30 flex h-12 w-8 items-center justify-center rounded bg-gradient-to-b'>
                                  <Film className='text-Primary-400 h-4 w-4' />
                                </div>
                                <div className='flex-1 space-y-2'>
                                  <h3 className='group-hover:text-Primary-300 text-sm font-semibold text-white transition-colors'>
                                    {movie.title}
                                  </h3>
                                  <div className='flex items-center justify-between'>
                                    <div className='text-Grey-400 flex items-center gap-2 text-xs'>
                                      <div className='flex items-center gap-1'>
                                        <Star className='text-Warning-400 h-2.5 w-2.5 fill-current' />
                                        <span>{movie.rating}</span>
                                      </div>
                                      <span>•</span>
                                      <span>{movie.year}</span>
                                      <span>•</span>
                                      <span>{movie.genre}</span>
                                    </div>
                                   
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className='space-y-4 lg:col-span-2'>
                        <div className='flex items-center gap-3'>
                          <div className='from-Success-500 to-Secondary-500 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br'>
                            <BarChart3 className='h-4 w-4 text-white' />
                          </div>
                          <span className='text-sm font-semibold text-white'>Your Library</span>
                        </div>

                        <div className='space-y-2'>
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
                              className='flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10'
                            >
                              <div className='flex items-center gap-3'>
                                <div
                                  className={`${stat.color} flex h-8 w-8 items-center justify-center rounded-lg bg-white/10`}
                                >
                                  <stat.icon className='h-4 w-4' />
                                </div>
                                <div>
                                  <div className='text-Grey-300 text-sm font-medium'>{stat.label}</div>
                                  <div className='text-Grey-400 text-xs'>{stat.trend} this week</div>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-lg font-bold text-white'>{stat.count}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced floating accent cards */}
                <motion.div
                  variants={floatingVariants}
                  className='border-Primary-500/20 bg-Primary-500/10 absolute -top-3 -left-3 hidden h-16 w-24 rounded-xl border p-3 backdrop-blur-sm lg:block'
                >
                  <div className='flex items-center gap-2'>
                    <Heart className='text-Error-400 h-3 w-3' />
                    <span className='text-xs font-medium text-white'>Liked</span>
                  </div>
                  <div className='text-lg font-bold text-white'>89</div>
                  <div className='text-Success-400 text-xs'>+12%</div>
                </motion.div>

                <motion.div
                  variants={floatingVariants}
                  className='border-Secondary-500/20 bg-Secondary-500/10 absolute -top-3 -right-3 hidden h-16 w-24 rounded-xl border p-3 backdrop-blur-sm lg:block'
                >
                  <div className='flex items-center gap-2'>
                    <Clock className='text-Secondary-400 h-3 w-3' />
                    <span className='text-xs font-medium text-white'>Hours</span>
                  </div>
                  <div className='text-lg font-bold text-white'>234</div>
                  <div className='text-Success-400 text-xs'>+8%</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className='px-6 py-16'>
          <div className='mx-auto max-w-5xl'>
            <motion.div variants={itemVariants} className='mb-12 space-y-3 text-center'>
              <h2 className='heading lg:text-4xl'>
                Trusted by
                <span className='gradient'>Entertainment Enthusiasts</span>
              </h2>
              <p className='text-Grey-400 mx-auto max-w-xl text-base'>
                Join thousands of users who have transformed how they track and discover entertainment
              </p>
            </motion.div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {[
                {
                  icon: Users,
                  value: '10,000+',
                  label: 'Active Users',
                  color: 'from-Primary-500 to-Secondary-500',
                  delay: 0,
                },
                {
                  icon: Star,
                  value: '500K+',
                  label: 'Shows Rated',
                  color: 'from-Warning-500 to-Tertiary-500',
                  delay: 0.1,
                },
                {
                  icon: Clock,
                  value: '2M+',
                  label: 'Hours Tracked',
                  color: 'from-Success-500 to-Secondary-500',
                  delay: 0.2,
                },
                {
                  icon: TrendingUp,
                  value: '50K+',
                  label: 'Watchlists Created',
                  color: 'from-Tertiary-500 to-Warning-500',
                  delay: 0.3,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  className='group text-center'
                >
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm'>
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} p-2 shadow-lg`}>
                      <stat.icon className='h-full w-full text-white' />
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-2xl font-bold text-white'>{stat.value}</div>
                    <div className='text-Grey-400 text-sm'>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className='px-6 py-20'>
          <div className='mx-auto max-w-6xl'>
            <motion.div variants={itemVariants} className='mb-16 space-y-4 text-center'>
              <h2 className='heading lg:text-4xl'>
                Everything You Need to
                <span className='gradient'>Master Your Viewing</span>
              </h2>
              <p className='text-Grey-400 mx-auto max-w-2xl text-lg leading-relaxed'>
                Powerful tools designed for movie and TV enthusiasts. Track, organize, and discover your next favorite
                show with precision and ease.
              </p>
            </motion.div>

            <div className='space-y-24 pt-12'>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className={`flex flex-col items-center gap-16 lg:flex-row ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className='flex-1 space-y-8'>
                    <div className='flex items-center gap-6'>
                      <div
                        className={`h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br ${feature.color} p-5 shadow-xl`}
                      >
                        <feature.icon className='h-full w-full text-white' />
                      </div>
                      <div>
                        <h3 className='text-3xl font-bold text-white'>{feature.title}</h3>
                        <div className='from-Primary-500 to-Secondary-500 mt-2 h-1 w-20 rounded-full bg-gradient-to-r' />
                      </div>
                    </div>
                    <p className='text-Grey-300 text-xl leading-relaxed'>{feature.description}</p>
                    <div className='space-y-4'>
                      {feature.highlights.map((highlight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className='flex items-center gap-4'
                        >
                          <div className='bg-Success-500/20 text-Success-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                            <Check className='h-3 w-3' />
                          </div>
                          <span className='text-Grey-300 text-lg'>{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='relative flex-1'
                  >
                    <div
                      className={`from-Primary-500/10 to-Secondary-500/10 absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br via-transparent opacity-50 blur-xl`}
                    />
                    {feature.mockup}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className='px-6 py-20'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              variants={itemVariants}
              className='relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 text-center backdrop-blur-xl'
            >
              <div className='from-Primary-500/20 to-Secondary-500/20 absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-3xl' />
              <div className='from-Tertiary-500/20 to-Success-500/20 absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-3xl' />

              <div className='relative space-y-8'>
                <motion.div variants={itemVariants} className='space-y-4'>
                  <div className='border-Success-500/30 bg-Success-500/10 text-Success-300 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm'>
                    <Sparkles className='h-4 w-4' />
                    <span>Ready to transform your viewing experience</span>
                  </div>
                  <h3 className='heading text-4xl'>Ready to build your universe?</h3>
                  <p className='text-Grey-300 mx-auto max-w-2xl text-xl leading-relaxed'>
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
                    className='button-primary! px-10! text-lg! font-semibold!'
                    endContent={<ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />}
                    onPress={() => openAuthModal('signup')}
                  >
                    Start Your Journey Now
                  </Button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className='text-Grey-400 flex items-center justify-center gap-8 pt-4 text-sm'
                >
                  <div className='flex items-center gap-2'>
                    <div className='flex -space-x-2'>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className='border-Grey-800 from-Primary-500 to-Secondary-500 h-6 w-6 rounded-full border-2 bg-gradient-to-br'
                        />
                      ))}
                    </div>
                    <span>Join 10,000+ users</span>
                  </div>
                  <div className='bg-Grey-600 h-4 w-px' />
                  <div className='flex items-center gap-1'>
                    <Star className='text-Warning-400 h-3 w-3 fill-current' />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className='bg-Grey-600 h-4 w-px' />
                  <div className='flex items-center gap-1'>
                    <Clock className='text-Success-400 h-3 w-3' />
                    <span>Free forever</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
