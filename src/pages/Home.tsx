import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import HeroSection from '@/components/home/HeroSection';
import TrendingSection from '@/components/home/TrendingSection';
import Top10Section from '@/components/home/Top10Section';
import NetworksSection from '@/components/home/NetworksSection';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import TopRatedSection from '@/components/home/TopRatedSection';
import FranchisesSection from '@/components/home/FranchisesSection';
import PopularCelebritiesSection from '@/components/home/PopularCelebritiesSection';
import { usePageTitle } from '@/hooks/usePageTitle';

const animation = {
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-200px' },
};

export default function Home() {
  const location = useLocation();

  usePageTitle('Home');

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
    <div className='w-full space-y-8 md:space-y-12'>
      <section id='hero' className='h-[90vh]'>
        <HeroSection />
      </section>

      <motion.section id='trending' {...animation}>
        <TrendingSection />
      </motion.section>

      <motion.section id='top-10' {...animation}>
        <Top10Section />
      </motion.section>

      <motion.section id='networks' {...animation}>
        <NetworksSection />
      </motion.section>

      <motion.section id='coming-soon' {...animation}>
        <ComingSoonSection />
      </motion.section>

      <motion.section id='top-rated' {...animation}>
        <TopRatedSection />
      </motion.section>

      <motion.section id='popular-people' {...animation}>
        <PopularCelebritiesSection />
      </motion.section>

      <motion.section id='franchises' {...animation}>
        <FranchisesSection />
      </motion.section>
    </div>
  );
}
