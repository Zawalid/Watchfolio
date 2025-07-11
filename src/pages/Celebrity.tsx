import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { useQueries } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo, useCallback } from 'react';
import { getPersonDetails, getPersonCombinedCredits } from '@/lib/api/TMDB';
import { queryKeys } from '@/lib/react-query';
import { calculateKnownForScore, categorizeCredits } from '@/utils/media';
import CelebrityProfile from '@/components/celebrity/details/CelebrityProfile';
import CelebrityCategories from '@/components/celebrity/details/CelebrityCategories';
import CelebrityCredits from '@/components/celebrity/details/CelebrityCredits';
import CelebritySkeleton from '@/components/celebrity/details/CelebritySkeleton';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const sortCredits = (items: Credit[], sortBy: string, sortDir: string): Credit[] => {
  return [...items].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = (a.title || a.name || '').localeCompare(b.title || b.name || '');
        break;
      case 'rating':
        comparison = (a.vote_average || 0) - (b.vote_average || 0);
        break;
      case 'date':
        comparison =
          new Date(a.release_date || a.first_air_date || 0).getTime() -
          new Date(b.release_date || b.first_air_date || 0).getTime();
        break;
      case 'popularity':
      default:
        comparison = (a.popularity || 0) - (b.popularity || 0);
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });
};

export default function Celebrity() {
  const { slug } = useParams();
  const personId = parseInt(slug!);
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('known-for'));
  const [sortBy, setSortBy] = useQueryState('sort_by', parseAsString.withDefault('popularity'));
  const [sortDir, setSortDir] = useQueryState('sort_dir', parseAsString.withDefault('desc'));

  const [personResult, creditsResult] = useQueries({
    queries: [
      { queryKey: queryKeys.celebrity(personId), queryFn: () => getPersonDetails(personId), enabled: !!personId },
      {
        queryKey: [...queryKeys.celebrity(personId), 'combined-credits'],
        queryFn: () => getPersonCombinedCredits(personId),
        enabled: !!personId,
      },
    ],
  });

  const { person, combinedCredits, isLoading, isError } = {
    person: personResult.data,
    combinedCredits: creditsResult.data,
    isLoading: personResult.isLoading || creditsResult.isLoading,
    isError: personResult.isError || creditsResult.isError,
    // error: personResult.error || creditsResult.error,
  };

  const { categorized, knownForItems, availableCategories } = useMemo(() => {
    if (!combinedCredits) return { categorized: null, knownForItems: [], availableCategories: [] };

    const allCredits = [...(combinedCredits.cast || []), ...(combinedCredits.crew || [])];
    const categorizedData = categorizeCredits(allCredits);
    const { movies, tvShows, voice, production } = categorizedData;

    const knownForPool = [...movies, ...tvShows, ...voice, ...production];
    const sortedKnownFor = knownForPool
      .sort((a, b) => calculateKnownForScore(b) - calculateKnownForScore(a))
      .slice(0, 20);

    const cats = [];
    if (sortedKnownFor.length > 0) cats.push('known-for');
    if (movies.length > 0) cats.push('movies');
    if (tvShows.length > 0) cats.push('tv');
    if (voice.length > 0) cats.push('voice');
    if (categorizedData.guest.length > 0) cats.push('guest');
    if (production.length > 0) cats.push('production');

    return { categorized: categorizedData, knownForItems: sortedKnownFor, availableCategories: cats };
  }, [combinedCredits]);

  const currentContent = useMemo(() => {
    if (!categorized) return [];
    let contentToDisplay = [];
    switch (category) {
      case 'movies':
        contentToDisplay = categorized.movies;
        break;
      case 'tv':
        contentToDisplay = categorized.tvShows;
        break;
      case 'voice':
        contentToDisplay = categorized.voice;
        break;
      case 'guest':
        contentToDisplay = categorized.guest;
        break;
      case 'production':
        contentToDisplay = categorized.production;
        break;
      case 'known-for':
      default:
        contentToDisplay = knownForItems;
    }
    return sortCredits(contentToDisplay, sortBy, sortDir as 'asc' | 'desc');
  }, [category, categorized, knownForItems, sortBy, sortDir]);

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSortBy('popularity');
      setSortDir('desc');
      setCategory(categoryId);
    },
    [setCategory, setSortBy, setSortDir]
  );

  if (isLoading) return <CelebritySkeleton />;
  if (isError || !person) return null; // TODO : Better error UI

  return (
    <motion.div className='space-y-6' variants={containerVariants} initial='hidden' animate='visible'>
      <motion.section variants={sectionVariants}>
        <div className='min-h-[500px] flex-1 py-4'>
          <CelebrityProfile
            person={person}
            appearances={(combinedCredits?.cast?.length || 0) + (combinedCredits?.crew?.length || 0)}
          />
        </div>
      </motion.section>

      <CelebrityCategories
        selectedCategory={category}
        onCategorySelect={handleCategorySelect}
        availableCategories={availableCategories}
        credits={{
          'known-for': knownForItems.length,
          movies: categorized?.movies?.length || 0,
          tv: categorized?.tvShows?.length || 0,
          voice: categorized?.voice?.length || 0,
          guest: categorized?.guest?.length || 0,
          production: categorized?.production?.length || 0,
        }}
      />

      <CelebrityCredits
        currentContent={currentContent || []}
        category={category || 'known-for'}
        isDeceased={!!person.deathday}
      />
    </motion.div>
  );
}
