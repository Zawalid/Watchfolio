import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
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

interface BatchResponse {
  recommendations: Recommendation[];
  description: string;
  total: number;
}

export function RecommendationsList({
  description,
  userLibrary,
  preferences,
  userProfile,
  onBack,
}: RecommendationsListProps) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BatchResponse, Error, InfiniteData<BatchResponse>, string[], number>({
    queryKey: ['ai-recommendations', description],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      // Get all previous recommendations from cache to exclude
      const excludeTitles: string[] = [];
      if (data?.pages) {
        for (const page of data.pages) {
          excludeTitles.push(...page.recommendations.map((rec: Recommendation) => rec.title));
        }
      }

      const response = await appwriteService.aiRecommendations.getRecommendationsBatch(
        description,
        userLibrary,
        preferences,
        userProfile,
        pageParam,
        excludeTitles
      );

      return response;
    },
    getNextPageParam: (lastPage: BatchResponse, pages: BatchResponse[]) => {
      const maxBatches = 4;
      if (pages.length >= maxBatches || !lastPage?.recommendations?.length) {
        return undefined;
      }
      return pages.length + 1;
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });

  // Auto-fetch next page after delay
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && (data?.pages?.length ?? 0) > 0) {
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasNextPage, isFetchingNextPage, data?.pages?.length, fetchNextPage]);

  const allRecommendations = data?.pages?.flatMap(page => page.recommendations) || [];

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
            <h3 className='mb-3 text-2xl font-bold text-white'>Finding your perfect matches...</h3>
            <p className='text-Grey-400 max-w-lg text-base leading-relaxed'>
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
            <h3 className='text-2xl font-bold text-white'>AI needs a coffee break</h3>
            <p className='text-Grey-400 max-w-lg text-base leading-relaxed'>
              Our AI curator couldn't find suitable recommendations for your request. Try rephrasing your mood or adjusting the filters above.
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
        <h1 className='heading gradient max-mobile:text-3xl max-xs:text-2xl'>Your Perfect Matches</h1>
        <p className='text-Grey-400 mx-auto max-w-2xl text-lg'>
          Based on: <span className='text-Grey-300 italic'>"{requestInfo.description}"</span>
        </p>
        {allRecommendations.length > 0 && (
          <div className='bg-Primary-500/10 border-Primary-500/20 text-Primary-300 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm'>
            <span className='bg-Primary-400 h-2 w-2 animate-pulse rounded-full'></span>
            {allRecommendations.length} perfect matches
          </div>
        )}
      </motion.div>

      {/* Results Grid */}
      {allRecommendations.length > 0 && (
        <div className='space-y-8'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold text-white'>Handpicked Just for You</h2>
            <p className='text-Grey-400 mx-auto max-w-lg text-base'>
              Each recommendation comes with AI-powered insights explaining why it matches your vibe.{' '}
              {hasNextPage && <span className='text-Primary-300'>More matches loading...</span>}
            </p>
          </div>

          <motion.div variants={containerVariants} initial='hidden' animate='visible' className='mx-auto max-w-7xl'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {allRecommendations.map((recommendation: Recommendation, index: number) => (
                <motion.div
                  key={`${recommendation.title}-${recommendation.year}-${index}`}
                  variants={itemVariants}
                  initial='hidden'
                  animate='visible'
                  transition={{ delay: index * 0.1 }}
                  className='flex justify-center'
                >
                  <RecommendationCard recommendation={recommendation} />
                </motion.div>
              ))}

              {/* Loading placeholders for incoming recommendations */}
              {isFetchingNextPage && (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                      key={`loading-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className='flex justify-center'
                    >
                      <div className='aspect-[2/3] w-full max-w-sm animate-pulse rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08]'>
                        <div className='bg-Grey-800/50 flex h-full w-full items-center justify-center rounded-2xl'>
                          <div className='text-Grey-500 flex items-center gap-2'>
                            <Brain className='h-5 w-5 animate-pulse' />
                            <span className='text-sm'>Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>

          {/* Progress indicator */}
          {(hasNextPage || isFetchingNextPage) && (
            <div className='text-center'>
              <div className='text-Grey-400 flex items-center justify-center gap-3'>
                <div className='flex gap-1'>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full transition-all duration-300 ${
                        index < (data?.pages?.length ?? 0)
                          ? 'bg-Primary-500'
                          : index === (data?.pages?.length ?? 0) && isFetchingNextPage
                            ? 'bg-Primary-500/50 animate-pulse'
                            : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-sm'>
                  {isFetchingNextPage
                    ? 'Finding more matches...'
                    : hasNextPage
                      ? `${allRecommendations.length}/20 perfect matches`
                      : `${allRecommendations.length} matches found`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
