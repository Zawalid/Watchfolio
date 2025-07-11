import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import HeroSection from '@/components/home/HeroSection';
import TrendingSection from '@/components/home/TrendingSection';
import Top10Section from '@/components/home/Top10Section';
import NetworksSection from '@/components/home/NetworksSection';
import CriticsChoiceSection from '@/components/home/CriticsChoiceSection';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import TopRatedSection from '@/components/home/TopRatedSection';
import FranchisesSection from '@/components/home/FranchisesSection';
import PopularCelebritiesSection from '@/components/home/PopularCelebritiesSection';

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
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <motion.div
      className='w-full space-y-8 md:space-y-12'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.section id="hero" className='h-[90vh]' variants={sectionVariants}>
        <HeroSection />
      </motion.section>

      <motion.section id="trending" variants={sectionVariants}>
        <TrendingSection />
      </motion.section>

      <motion.section id="top-10" variants={sectionVariants}>
        <Top10Section />
      </motion.section>

      <motion.section id="networks" variants={sectionVariants}>
        <NetworksSection />
      </motion.section>

      <motion.section id="critics-choice" variants={sectionVariants}>
        <CriticsChoiceSection />
      </motion.section>

      <motion.section id="coming-soon" variants={sectionVariants}>
        <ComingSoonSection />
      </motion.section>

      <motion.section id="top-rated" variants={sectionVariants}>
        <TopRatedSection />
      </motion.section>

      <motion.section id="popular-people" variants={sectionVariants}>
        <PopularCelebritiesSection />
      </motion.section>
      
      <motion.section id="franchises" variants={sectionVariants}>
        <FranchisesSection />
      </motion.section>

    </motion.div>
  );
}
