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

// No changes needed for variants
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
    // We remove the animation variants from the parent container.
    // Each section will now handle its own animation trigger.
    <div className='w-full space-y-8 md:space-y-12'>
      {/* The HeroSection is not animated on scroll, it appears instantly */}
      <section id='hero' className='h-[90vh]'>
        <HeroSection />
      </section>

      {/* Each subsequent section will animate when it enters the viewport */}
      <motion.section
        id='trending'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        <TrendingSection />
      </motion.section>

      <motion.section
        id='top-10'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-200px' }}
      >
        <Top10Section />
      </motion.section>

      <motion.section
        id='networks'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-200px' }}
      >
        <NetworksSection />
      </motion.section>

      <motion.section
        id='coming-soon'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-200px' }}
      >
        <ComingSoonSection />
      </motion.section>

      <motion.section
        id='top-rated'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-200px' }}
      >
        <TopRatedSection />
      </motion.section>

      <motion.section
        id='popular-people'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-200px' }}
      >
        <PopularCelebritiesSection />
      </motion.section>

      <motion.section
        id='franchises'
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-200px' }}
      >
        <FranchisesSection />
      </motion.section>
    </div>
  );
}
