import { motion } from 'framer-motion';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@heroui/react';
import { ArrowLeft, RefreshCw, Brain, Sparkles, Coffee, Lightbulb } from 'lucide-react';
import { appwriteService } from '@/lib/appwrite/api';
import { RecommendationCard } from './RecommendationCard';
import { AnimatedRing } from '@/components/ui/AnimatedRing';

interface Preferences {
  contentType: string;
  decade: string;
  duration: string;
}

interface RecommendationsListProps {
  description: string;
  userLibrary: LibraryMedia[];
  preferences: Preferences;
  userProfile?: {
    favoriteGenres: number[];
    contentPreferences: string[];
    favoriteNetworks: number[];
    favoriteContentType: string;
  };
  onBack: () => void;
}

interface Recommendation {
  tmdb_id: number;
  imdb_id?: string;
  title: string;
  year: number;
  detailed_analysis: string;
  mood_alignment: string;
  type: 'movie' | 'tv';
}

export function RecommendationsList({
  description,
  userLibrary,
  preferences,
  userProfile,
  onBack,
}: RecommendationsListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ai-recommendations', description],
    queryFn: async () => {
      return await appwriteService.aiRecommendations.getRecommendations(
        description,
        userLibrary,
        preferences,
        userProfile
      );
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });

  const allRecommendations = data?.recommendations || [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['ai-recommendations', description] });
  };

  // Create a simple info object for the description
  const requestInfo = {
    label: 'Custom Request',
    description: description.length > 50 ? description.substring(0, 50) + '...' : description,
    color: 'from-Primary-500 to-Secondary-500',
  };

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
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Button
          variant='light'
          onPress={onBack}
          startContent={<ArrowLeft className='h-4 w-4' />}
          className='text-Grey-300 hover:text-white'
        >
          New Search
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, staggerChildren: 0.1 }}
          className='flex h-full min-h-[50vh] flex-1 flex-col items-center justify-center gap-6 px-4 text-center'
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <AnimatedRing
              color='primary'
              size='lg'
              ringCount={3}
              animationSpeed='normal'
              glowEffect={true}
              floatingIcons={[
                {
                  icon: <Sparkles className='h-4 w-4' />,
                  position: 'top-right',
                  color: 'primary',
                  delay: 0,
                },
                {
                  icon: <Brain className='h-4 w-4' />,
                  position: 'bottom-left',
                  color: 'secondary',
                  delay: 1,
                },
              ]}
            >
              <Brain className='text-Primary-400 h-12 w-12' />
            </AnimatedRing>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
            className='space-y-4'
          >
            <h3 className='mb-3 text-xl sm:text-2xl font-bold text-white'>Finding your perfect matches...</h3>
            <p className='text-Grey-400 max-w-lg text-sm sm:text-base leading-relaxed'>
              Our AI is analyzing your watchlist and taste profile to curate personalized recommendations for:{' '}
              <span className='text-Grey-300 italic'>"{description}"</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <Button
          variant='light'
          onPress={onBack}
          startContent={<ArrowLeft className='h-4 w-4' />}
          className='text-Grey-300 hover:text-white'
        >
          New Search
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className='flex h-full min-h-[60vh] flex-1 flex-col items-center justify-center gap-8 px-4 text-center'
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.1 }}
          >
            <div className='rounded-full border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-8'>
              <Coffee className='h-16 w-16 text-orange-400' />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.2 }}
            className='space-y-3'
          >
            <h3 className='text-xl sm:text-2xl font-bold text-white'>AI needs a coffee break</h3>
            <p className='text-Grey-400 max-w-lg text-sm sm:text-base leading-relaxed'>
              Our AI curator couldn't find suitable recommendations for your request. Try rephrasing your mood or
              adjusting the filters above.
            </p>
            <div className='text-Grey-500 mt-3 flex items-center justify-center gap-2'>
              <Lightbulb className='h-4 w-4' />
              <span className='text-sm italic'>Try different keywords or broader descriptions</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.3 }}
            className='flex gap-4'
          >
            <Button
              onPress={handleRefresh}
              className='from-Primary-500 to-Secondary-500 rounded-full bg-gradient-to-r px-6 text-white'
              startContent={<RefreshCw className='h-4 w-4' />}
            >
              Try Again
            </Button>
            <Button
              onPress={onBack}
              variant='bordered'
              className='text-Grey-300 rounded-full border-white/20 px-6 hover:border-white/40 hover:text-white'
            >
              New Search
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Button
          variant='light'
          onPress={onBack}
          startContent={<ArrowLeft className='h-4 w-4' />}
          className='text-Grey-400 transition-colors hover:text-white'
        >
          Back to Search
        </Button>

        <Button
          variant='light'
          onPress={handleRefresh}
          startContent={<RefreshCw className='h-4 w-4' />}
          className='text-Grey-400 transition-colors hover:text-white'
          isLoading={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Request Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='space-y-3 py-8 text-center'
      >
        <h1 className='heading gradient xs:text-2xl text-xl sm:text-3xl lg:text-4xl'>Your Perfect Matches</h1>
        <p className='text-Grey-400 xs:text-sm text-xs md:text-lg'>
          Based on: <span className='text-Grey-300 italic'>"{requestInfo.description}"</span>
        </p>
        {allRecommendations.length > 0 && (
          <div className='bg-Primary-500/10 border-Primary-500/20 text-Primary-300 inline-flex items-center gap-2 rounded-full border px-3 py-1 mobile:px-4 mobile:py-2 text-xs mobile:text-sm'>
            <span className='bg-Primary-400 h-2 w-2 animate-pulse rounded-full'></span>
            {allRecommendations.length} perfect matches
          </div>
        )}
      </motion.div>

      {/* Results Grid */}
      {allRecommendations.length > 0 && (
        <div className='space-y-8'>
          <div className='space-y-2 text-center'>
            <h2 className='text-xl sm:text-2xl font-bold text-white'>Handpicked Just for You</h2>
            <p className='text-Grey-400 mx-auto max-w-lg text-sm sm:text-base'>
              Each recommendation comes with AI-powered insights explaining why it matches your vibe.
            </p>
          </div>

          <motion.div variants={containerVariants} initial='hidden' animate='visible' className='mx-auto max-w-7xl'>
            <div className='mobile:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-start gap-5'>
              {allRecommendations.map((recommendation: Recommendation, index: number) => (
                <motion.div
                  key={`${recommendation.title}-${recommendation.year}-${index}`}
                  variants={itemVariants}
                  initial='hidden'
                  animate='visible'
                  transition={{ delay: index * 0.1 }}
                  className='flex'
                >
                  <RecommendationCard recommendation={recommendation} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
