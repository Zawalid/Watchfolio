import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Eye, Film, Tv,  Trophy, Sparkles } from 'lucide-react';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) => (
  <motion.div
    className='space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm'
    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
    transition={{ duration: 0.2 }}
  >
    <div className={`rounded-full bg-${color}-500/20 w-fit p-3`}>
      <Icon className={`size-6 text-${color}-400`} />
    </div>
    <h3 className='text-Primary-50 text-xl font-semibold'>{title}</h3>
    <p className='text-Grey-400'>{description}</p>
  </motion.div>
);

export default function WelcomeView() {
  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='space-y-8 py-8'>
      <motion.div variants={itemVariants} className='space-y-12'>
        {/* Hero section */}
        <div className='space-y-6 text-center'>
          <motion.div
            className='from-Primary-500/50 to-Secondary-500/50 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img src='/images/logo.svg' alt='watchfolio' className='size-16' />
          </motion.div>

          <div className='space-y-3'>
            <h1 className='text-Primary-50 from-Primary-400 to-Secondary-400 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight'>
              Welcome to Watchfolio
            </h1>
            <p className='text-Grey-200 mx-auto max-w-2xl text-lg'>
              Your personal entertainment tracker is ready! Discover, collect, and organize your favorite movies and TV
              shows all in one place.
            </p>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Button
              as={Link}
              to='/movies/popular'
              variant='solid'
              color='primary'
              startContent={<Film className='size-4' />}
              size='lg'
            >
              Explore Movies
            </Button>
            <Button
              as={Link}
              to='/tv/popular'
              variant='light'
              className='button-secondary'
              startContent={<Tv className='size-4' />}
              size='lg'
            >
              Explore TV Shows
            </Button>
          </div>
        </div>

        {/* Features showcase */}
        <div className='grid gap-8 md:grid-cols-3'>
          <FeatureCard
            icon={Eye}
            title='Track Everything'
            description="Keep tabs on what you're watching, what you've completed, and what's next in your watchlist."
            color='blue'
          />

          <FeatureCard
            icon={Trophy}
            title='Rate and Review'
            description='Add your own ratings, reviews, and notes to build your personalized entertainment database.'
            color='purple'
          />

          <FeatureCard
            icon={Sparkles}
            title='Discover New Gems'
            description='Find new recommendations based on your watch history and preferences.'
            color='green'
          />
        </div>

        <div className='text-center'>
          <p className='text-Grey-300'>
            Ready to start? Explore popular movies and TV shows, then add them to your library!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
