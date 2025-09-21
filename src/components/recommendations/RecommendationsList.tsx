import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@heroui/react';
import { ArrowLeft, RefreshCw, AlertTriangle, Brain, Sparkles } from 'lucide-react';
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

export function RecommendationsList({ description, userLibrary, preferences, onBack }: RecommendationsListProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: recommendations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['ai-recommendations', description, refreshKey],
    queryFn: async () => {
      const response = await appwriteService.aiRecommendations.getRecommendations(
        description,
        userLibrary,
        preferences
      );
      return response;
    },
    staleTime: 1000 * 60 * 30,
    retry: 2
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Create a simple info object for the description
  const requestInfo = {
    label: 'Custom Request',
    description: description.length > 50 ? description.substring(0, 50) + '...' : description,
    color: 'from-Primary-500 to-Secondary-500'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="light"
          onPress={onBack}
          startContent={<ArrowLeft className="h-4 w-4" />}
          className="text-Grey-300 hover:text-white"
        >
          New Search
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, staggerChildren: 0.1 }}
          className="flex h-full min-h-[50vh] flex-1 flex-col items-center justify-center gap-6 px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <AnimatedRing
              color="primary"
              size="lg"
              ringCount={3}
              animationSpeed="normal"
              glowEffect={true}
              floatingIcons={[
                {
                  icon: <Sparkles className="h-4 w-4" />,
                  position: 'top-right',
                  color: 'primary',
                  delay: 0,
                },
                {
                  icon: <Brain className="h-4 w-4" />,
                  position: 'bottom-left',
                  color: 'secondary',
                  delay: 1,
                },
              ]}
            >
              <Brain className="h-12 w-12 text-Primary-400" />
            </AnimatedRing>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-white mb-3 text-2xl font-bold">Curating your recommendations...</h3>
            <p className="text-Grey-400 max-w-lg text-base leading-relaxed">
              Analyzing your taste profile and finding the perfect matches for: <span className="text-Grey-300 italic">"{description}"</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="light"
          onPress={onBack}
          startContent={<ArrowLeft className="h-4 w-4" />}
          className="text-Grey-300 hover:text-white"
        >
          New Search
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className="flex h-full min-h-[60vh] flex-1 flex-col items-center justify-center gap-8 px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.1 }}
          >
            <div className="rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 p-8 border border-red-500/30">
              <AlertTriangle className="h-16 w-16 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-white text-2xl font-bold">Search failed</h3>
            <p className="text-Grey-400 max-w-lg">
              We couldn't process your request right now. Please try again.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.3 }}
            className="flex gap-4"
          >
            <Button
              onPress={handleRefresh}
              className="from-Primary-500 to-Secondary-500 bg-gradient-to-r text-white rounded-full px-6"
              startContent={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
            <Button
              onPress={onBack}
              variant="bordered"
              className="border-white/20 text-Grey-300 hover:border-white/40 hover:text-white rounded-full px-6"
            >
              New Search
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="light"
          onPress={onBack}
          startContent={<ArrowLeft className="h-4 w-4" />}
          className="text-Grey-400 hover:text-white transition-colors"
        >
          Back to Search
        </Button>

        <Button
          variant="light"
          onPress={handleRefresh}
          startContent={<RefreshCw className="h-4 w-4" />}
          className="text-Grey-400 hover:text-white transition-colors"
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
        className="text-center space-y-3 py-8"
      >
        <h1 className="heading gradient max-mobile:text-3xl max-xs:text-2xl">
          Your Recommendations
        </h1>
        <p className="text-Grey-400 text-lg max-w-2xl mx-auto">
          For: <span className="text-Grey-300 italic">"{requestInfo.description}"</span>
        </p>
        {recommendations && (
          <div className="inline-flex items-center gap-2 rounded-full bg-Primary-500/10 border border-Primary-500/20 px-4 py-2 text-Primary-300 text-sm">
            <span className="w-2 h-2 bg-Primary-400 rounded-full animate-pulse"></span>
            {recommendations.total} recommendations found
          </div>
        )}
      </motion.div>

      {/* Results Grid */}
      {recommendations?.recommendations && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Curated for you</h2>
            <p className="text-Grey-400 text-base max-w-lg mx-auto">
              Each recommendation includes detailed AI analysis. Click the info button to see why it matches your request.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {recommendations.recommendations.map((recommendation: Recommendation, index: number) => (
                <motion.div
                  key={`${recommendation.tmdb_id}-${index}`}
                  variants={itemVariants}
                  className="flex justify-center"
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