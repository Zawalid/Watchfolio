import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import TrendingSection from '@/components/home/TrendingSection';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import Top10Section from '@/components/home/Top10Section';
import TopRatedSection from '@/components/home/TopRatedSection';
import FranchisesSection from '@/components/home/FranchisesSection';
import ThisDayInCinema from '@/components/home/ThisDayInCinema';
import AwardsSpotlight from '@/components/home/AwardsSpotlight';
import HiddenGemsSection from '@/components/home/HiddenGemsSection';

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
    <motion.div
      className='w-full space-y-8 md:space-y-12'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.section className='py-10' variants={sectionVariants}>
        <HeroSection />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <TrendingSection />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <Top10Section />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <AwardsSpotlight />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <HiddenGemsSection />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <ThisDayInCinema />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <ComingSoonSection />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <TopRatedSection />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <FranchisesSection />
      </motion.section>
    </motion.div>
  );
}
