import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { 
  Play, 
  Bookmark, 
  Star, 
  TrendingUp, 
  Search, 
  Zap,
  Film,
  Tv,
  ArrowRight,
  Eye,
  Heart,
  ChevronRight,
  Sparkles,
  Clock,
  Award,
  Users,
  BarChart3,
  Check
} from 'lucide-react';
import { useRef } from 'react';

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

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  

  return (
    <div ref={containerRef} className='relative overflow-hidden'>
     
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <section className='min-h-screen flex items-center justify-center px-6'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div variants={itemVariants} className='space-y-6'>
              {/* Announcement Banner */}
              <motion.div
                variants={itemVariants}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-Primary-500/30 bg-Primary-500/10 backdrop-blur-sm text-sm text-Primary-300'
              >
                <Sparkles className='w-4 h-4' />
                <span>Track, Discover, Remember</span>
                <ChevronRight className='w-4 h-4' />
              </motion.div>

              {/* Main Headline */}
              <motion.div variants={itemVariants} className='space-y-4'>
                <h1 className='text-3xl space-x-3 sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight'>
                  <motion.span 
                    className='text-white'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    Your
                  </motion.span>
                  <motion.span 
                    className='bg-gradient-to-r from-Primary-400 via-Secondary-400 to-Tertiary-400 bg-clip-text text-transparent'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Entertainment
                  </motion.span>
                  <motion.span 
                    className='text-white'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    Universe
                  </motion.span>
                </h1>
                
                <motion.p 
                  variants={itemVariants}
                  className='text-base sm:text-lg text-Grey-400 max-w-xl mx-auto leading-relaxed'
                >
                  Track what you watch. Discover what's next. 
                  <br />
                  <span className='text-Grey-300'>Build your personal entertainment journey.</span>
                </motion.p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className='flex flex-col sm:flex-row items-center justify-center gap-3 pt-2'>
                <Button
                  as={Link}
                  to='/movies/trending'
                  size='md'
                  color='primary'
                  className='px-6 py-2 font-semibold shadow-lg hover:shadow-Primary-500/25 transition-all duration-300 group'
                  endContent={<ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />}
                >
                  Start Exploring
                </Button>
                <Button
                  as={Link}
                  to='/tv/popular'
                  variant='bordered'
                  size='md'
                  className='px-6 py-2 border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300'
                  startContent={<Play className='w-4 h-4' />}
                >
                  Browse Trending
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating preview cards */}
            <motion.div 
              variants={itemVariants}
              className='mt-12 relative'
            >
              <div className='relative max-w-4xl mx-auto'>
                {/* Main preview window */}
                <motion.div
                  variants={cardVariants}
                  className='rounded-xl border border-white/10 bg-blur backdrop-blur-xl shadow-2xl overflow-hidden'
                >
                  <div className='p-4'>
                    <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
                      {/* Left side - Movie showcase */}
                      <div className='lg:col-span-3 space-y-3'>
                        <div className='flex items-center gap-2'>
                          <div className='w-6 h-6 rounded-lg bg-gradient-to-br from-Primary-500 to-Secondary-500 flex items-center justify-center'>
                            <TrendingUp className='w-3 h-3 text-white' />
                          </div>
                          <span className='text-white font-semibold text-xs'>Trending This Week</span>
                        </div>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                          {[
                            { title: "Dune: Part Two", rating: "8.9", year: "2024", genre: "Sci-Fi" },
                            { title: "Oppenheimer", rating: "8.5", year: "2023", genre: "Drama" },
                          ].map((movie, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 + i * 0.1 }}
                              className='rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-all duration-300 cursor-pointer group'
                            >
                              <div className='flex gap-2'>
                                <div className='w-8 h-10 rounded bg-gradient-to-b from-Primary-500/30 to-Secondary-500/30 flex items-center justify-center'>
                                  <Film className='w-4 h-4 text-Primary-400' />
                                </div>
                                <div className='flex-1 space-y-1'>
                                  <h3 className='font-semibold text-white text-xs group-hover:text-Primary-300 transition-colors'>{movie.title}</h3>
                                  <div className='flex items-center gap-1 text-xs text-Grey-400'>
                                    <div className='flex items-center gap-1'>
                                      <Star className='w-2 h-2 text-Warning-400 fill-current' />
                                      <span className='text-xs'>{movie.rating}</span>
                                    </div>
                                    <span>•</span>
                                    <span className='text-xs'>{movie.year}</span>
                                    <span>•</span>
                                    <span className='text-xs'>{movie.genre}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Right side - Stats */}
                      <div className='lg:col-span-2 space-y-3'>
                        <div className='flex items-center gap-2'>
                          <div className='w-6 h-6 rounded-lg bg-gradient-to-br from-Success-500 to-Secondary-500 flex items-center justify-center'>
                            <BarChart3 className='w-3 h-3 text-white' />
                          </div>
                          <span className='text-white font-semibold text-xs'>Your Stats</span>
                        </div>
                        
                        <div className='space-y-1'>
                          {[
                            { icon: Eye, label: "Watching", count: "12", color: "text-Secondary-400" },
                            { icon: Bookmark, label: "Watchlist", count: "47", color: "text-Tertiary-400" },
                            { icon: Star, label: "Favorites", count: "23", color: "text-Warning-400" },
                            { icon: Award, label: "Completed", count: "156", color: "text-Success-400" },
                          ].map((stat, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2 + i * 0.1 }}
                              className='rounded border border-white/10 bg-white/5 p-2 flex items-center justify-between hover:bg-white/10 transition-all duration-300'
                            >
                              <div className='flex items-center gap-2'>
                                <stat.icon className={`w-3 h-3 ${stat.color}`} />
                                <span className='text-Grey-300 text-xs'>{stat.label}</span>
                              </div>
                              <span className='text-white font-semibold text-xs'>{stat.count}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating accent cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className='absolute -top-2 -left-2 w-20 h-12 rounded-lg border border-Primary-500/20 bg-Primary-500/10 backdrop-blur-sm p-2 hidden lg:block'
                >
                  <div className='flex items-center gap-1'>
                    <Heart className='w-2 h-2 text-Error-400' />
                    <span className='text-xs text-white font-medium'>Liked</span>
                  </div>
                  <div className='text-sm font-bold text-white'>89</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 3 }}
                  transition={{ delay: 1.7, duration: 0.8 }}
                  className='absolute -top-2 -right-2 w-20 h-12 rounded-lg border border-Secondary-500/20 bg-Secondary-500/10 backdrop-blur-sm p-2 hidden lg:block'
                >
                  <div className='flex items-center gap-1'>
                    <Clock className='w-2 h-2 text-Secondary-400' />
                    <span className='text-xs text-white font-medium'>Hours</span>
                  </div>
                  <div className='text-sm font-bold text-white'>234</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-16 px-6'>
          <div className='max-w-5xl mx-auto'>
            <motion.div 
              variants={itemVariants}
              className='text-center space-y-3 mb-12'
            >
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-black text-white'>
                Built for
                <span className='block bg-gradient-to-r from-Primary-400 to-Secondary-400 bg-clip-text text-transparent'>
                  Entertainment Lovers
                </span>
              </h2>
              <p className='text-base text-Grey-400 max-w-xl mx-auto'>
                Every feature designed to enhance how you discover, track, and enjoy movies and TV shows
              </p>
            </motion.div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[
                {
                  icon: Search,
                  title: "Smart Discovery",
                  description: "AI-powered recommendations based on your taste and viewing history",
                  color: "from-Primary-500 to-Secondary-500",
                  delay: 0
                },
                {
                  icon: Bookmark,
                  title: "Effortless Tracking",
                  description: "Automatically sync your progress across all devices and platforms",
                  color: "from-Secondary-500 to-Tertiary-500",
                  delay: 0.1
                },
                {
                  icon: Star,
                  title: "Personal Ratings",
                  description: "Rate and review to build your personal entertainment database",
                  color: "from-Tertiary-500 to-Warning-500",
                  delay: 0.2
                },
                {
                  icon: TrendingUp,
                  title: "Trending & Popular",
                  description: "Stay current with what's trending worldwide and in your region",
                  color: "from-Success-500 to-Secondary-500",
                  delay: 0.3
                },
                {
                  icon: Users,
                  title: "Social Features",
                  description: "Share lists, compare tastes, and get recommendations from friends",
                  color: "from-Error-500 to-Primary-500",
                  delay: 0.4
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Instant search, keyboard shortcuts, and optimized for speed",
                  color: "from-Warning-500 to-Tertiary-500",
                  delay: 0.5
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className='group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-500'
                >
                  <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  
                  <div className='relative space-y-3'>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} p-2 shadow-lg`}>
                      <feature.icon className='w-full h-full text-white' />
                    </div>
                    
                    <div className='space-y-1'>
                      <h3 className='text-lg font-bold text-white group-hover:text-Primary-300 transition-colors duration-300'>
                        {feature.title}
                      </h3>
                      <p className='text-Grey-400 leading-relaxed group-hover:text-Grey-300 transition-colors duration-300 text-sm'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

 <section className='px-6 py-20'>
          <div className='mx-auto max-w-6xl'>
            <motion.div variants={itemVariants} className='mb-16 space-y-4 text-center'>
              <h2 className='text-2xl font-black text-white sm:text-3xl lg:text-4xl'>
                Experience the
                <span className='from-Primary-400 to-Secondary-400 bg-gradient-to-r bg-clip-text text-transparent'>
                  {' '}
                  Difference
                </span>
              </h2>
              <p className='text-Grey-400 mx-auto max-w-2xl text-base'>
                See how Watchfolio transforms your entertainment tracking experience
              </p>
            </motion.div>

            <div className='space-y-16'>
              {/* Discovery Feature */}
              <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
                <motion.div variants={itemVariants} className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='from-Primary-500 to-Secondary-500 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br'>
                        <Search className='h-5 w-5 text-white' />
                      </div>
                      <h3 className='text-2xl font-bold text-white'>Smart Discovery</h3>
                    </div>
                    <p className='text-Grey-400 leading-relaxed'>
                      Our AI-powered recommendation engine learns from your viewing habits, ratings, and preferences to
                      suggest content you'll actually love. No more endless scrolling through mediocre options.
                    </p>
                  </div>

                  <div className='space-y-3'>
                    {[
                      'Personalized recommendations based on your taste',
                      'Genre and mood-based suggestions',
                      'Similar content discovery',
                      'Hidden gems you might have missed',
                    ].map((feature, index) => (
                      <div key={index} className='flex items-center space-x-3'>
                        <Check className='text-Success-400 h-5 w-5' />
                        <span className='text-Grey-300'>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className='relative'>
                  <div className='bg-blur relative overflow-hidden rounded-2xl border border-white/10 p-6 backdrop-blur-xl'>
                    <div className='from-Primary-500/10 to-Secondary-500/5 absolute inset-0 bg-gradient-to-br' />

                    <div className='relative space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-semibold text-white'>Recommended for You</h4>
                        <div className='bg-Primary-500/20 flex h-6 w-6 items-center justify-center rounded-lg'>
                          <Sparkles className='text-Primary-400 h-4 w-4' />
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-3'>
                        {[
                          { title: 'The Bear', rating: '9.2', match: '95%' },
                          { title: 'Wednesday', rating: '8.7', match: '89%' },
                          { title: 'House of Dragon', rating: '8.9', match: '92%' },
                          { title: 'Stranger Things', rating: '8.8', match: '87%' },
                        ].map((show, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className='rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10'
                          >
                            <div className='from-Primary-500/20 to-Secondary-500/20 mb-2 h-12 w-full rounded bg-gradient-to-br' />
                            <h5 className='truncate text-sm font-medium text-white'>{show.title}</h5>
                            <div className='text-Grey-400 mt-1 flex justify-between text-xs'>
                              <span>★ {show.rating}</span>
                              <span className='text-Success-400'>{show.match} match</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Tracking Feature */}
              <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
                <motion.div variants={itemVariants} className='relative order-2 lg:order-1'>
                  <div className='bg-blur relative overflow-hidden rounded-2xl border border-white/10 p-6 backdrop-blur-xl'>
                    <div className='from-Secondary-500/10 to-Tertiary-500/5 absolute inset-0 bg-gradient-to-br' />

                    <div className='relative space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-semibold text-white'>Your Progress</h4>
                        <div className='text-Success-400 bg-Success-500/20 rounded-full px-2 py-1 text-xs'>
                          All synced
                        </div>
                      </div>

                      <div className='space-y-3'>
                        {[
                          { title: 'Breaking Bad', progress: 85, episode: 'S4 E12' },
                          { title: 'The Office', progress: 45, episode: 'S3 E7' },
                          { title: 'Game of Thrones', progress: 100, episode: 'Completed' },
                        ].map((show, index) => (
                          <div key={index} className='rounded-lg border border-white/10 bg-white/5 p-3'>
                            <div className='mb-2 flex items-center justify-between'>
                              <h5 className='text-sm font-medium text-white'>{show.title}</h5>
                              <span className='text-Grey-400 text-xs'>{show.episode}</span>
                            </div>
                            <div className='bg-Grey-700 h-2 w-full overflow-hidden rounded-full'>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${show.progress}%` }}
                                transition={{ delay: index * 0.2, duration: 1 }}
                                className='from-Primary-500 to-Secondary-500 h-full rounded-full bg-gradient-to-r'
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className='order-1 space-y-6 lg:order-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='from-Secondary-500 to-Tertiary-500 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br'>
                        <BarChart3 className='h-5 w-5 text-white' />
                      </div>
                      <h3 className='text-2xl font-bold text-white'>Progress Tracking</h3>
                    </div>
                    <p className='text-Grey-400 leading-relaxed'>
                      Never lose track of where you left off. Watchfolio automatically syncs your progress across all
                      devices and platforms, keeping your viewing history perfectly organized.
                    </p>
                  </div>

                  <div className='space-y-3'>
                    {[
                      'Automatic progress synchronization',
                      'Cross-platform tracking',
                      'Episode-by-episode progress',
                      'Seamless device switching',
                    ].map((feature, index) => (
                      <div key={index} className='flex items-center space-x-3'>
                        <Check className='text-Success-400 h-5 w-5' />
                        <span className='text-Grey-300'>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className='py-16 px-6'>
          <div className='max-w-3xl mx-auto'>
            <motion.div
              variants={cardVariants}
              className='relative rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 text-center overflow-hidden'
            >
              {/* Background decoration */}
              <div className='absolute inset-0 bg-gradient-to-br from-Primary-500/10 via-transparent to-Secondary-500/10 rounded-xl' />
              <div className='absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-Primary-500/20 to-Secondary-500/20 rounded-full blur-3xl' />
              <div className='absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-br from-Tertiary-500/20 to-Secondary-500/20 rounded-full blur-3xl' />
              
              <div className='relative space-y-4'>
                <motion.div
                  variants={itemVariants}
                  className='space-y-3'
                >
                  <h3 className='text-2xl sm:text-3xl font-black text-white'>
                    Ready to dive in?
                  </h3>
                  <p className='text-base text-Grey-300 max-w-lg mx-auto leading-relaxed'>
                    Join thousands building their entertainment universe with Watchfolio
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className='flex flex-col sm:flex-row justify-center gap-3'
                >
                  <Button
                    as={Link}
                    to='/movies/popular'
                    size='md'
                    color='primary'
                    className='px-6 py-2 font-semibold shadow-xl hover:shadow-Primary-500/30 transition-all duration-300'
                    startContent={<Film className='w-4 h-4' />}
                    endContent={<ArrowRight className='w-4 h-4' />}
                  >
                    Explore Movies
                  </Button>
                  <Button
                    as={Link}
                    to='/tv/popular'
                    variant='bordered'
                    size='md'
                    className='px-6 py-2 border-white/30 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300'
                    startContent={<Tv className='w-4 h-4' />}
                  >
                    Browse TV Shows
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
