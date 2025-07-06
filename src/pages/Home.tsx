import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
// import ContinueWatching from '@/components/home/ContinueWatching';
// import TrendingSection from '@/components/home/TrendingSection';
// import TopRatedSection from '@/components/home/TopRatedSection';
// import NewReleasesSection from '@/components/home/NewReleasesSection';
// import ComingSoonSection from '@/components/home/ComingSoonSection';
// import RecommendedSection from '@/components/home/RecommendedSection';
// import WatchFolioTop10 from '@/components/home/WatchFolioTop10';
// import CollectionsSection from '@/components/home/CollectionsSection';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  return (
    <motion.div className='space-y-8 w-full md:space-y-12' variants={containerVariants} initial='hidden' animate='visible'>
      {/* Hero Section */}
      <motion.section variants={sectionVariants}>
        <HeroSection />
      </motion.section>

      {/* Continue Watching - Personal Section */}
      <motion.section variants={sectionVariants}>{/* <ContinueWatching /> */}</motion.section>

      {/* Trending This Week */}
      <motion.section variants={sectionVariants}>{/* <TrendingSection /> */}</motion.section>

      {/* Top Rated Movies */}
      <motion.section variants={sectionVariants}>{/* <TopRatedSection type='movie' /> */}</motion.section>

      {/* New This Week */}
      <motion.section variants={sectionVariants}>{/* <NewReleasesSection /> */}</motion.section>

      {/* Top Rated TV Shows */}
      <motion.section variants={sectionVariants}>{/* <TopRatedSection type='tv' /> */}</motion.section>

      {/* Coming Soon */}
      <motion.section variants={sectionVariants}>{/* <ComingSoonSection /> */}</motion.section>

      {/* Recommended For You - AI Powered */}
      <motion.section variants={sectionVariants}>{/* <RecommendedSection /> */}</motion.section>

      {/* WatchFolio TOP 10 */}
      <motion.section variants={sectionVariants}>{/* <WatchFolioTop10 /> */}</motion.section>

      {/* Featured Collections */}
      <motion.section variants={sectionVariants}>{/* <CollectionsSection /> */}</motion.section>
    </motion.div>
  );
}
