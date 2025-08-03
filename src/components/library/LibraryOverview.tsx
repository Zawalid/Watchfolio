import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { SquareArrowOutUpRight, Sparkles } from 'lucide-react';
import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryCard from './LibraryCard';
import LibraryStats from './LibraryStats';

// TODO : UPDATE

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

export default function LibraryOverview() {
  const { getAllItems, getCount } = useLibraryStore();

  const allItems = getAllItems();
  const recentItems = allItems
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 6);

  const totalItems = getCount('all');

  // Get current time to personalize greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div variants={containerVariants} initial='hidden' animate='visible' className='space-y-8 py-8'>
      <motion.div variants={itemVariants} className='flex flex-col justify-between sm:flex-row'>
        <div className='space-y-3'>
          <h1 className='text-Primary-50 text-3xl font-bold tracking-tight'>{greeting}, Walid</h1>
          <p className='text-Grey-300 text-lg'>
            Check out your stats, browse your latest additions, or discover something new to add to your library
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className='hidden md:flex'
        >
          <Button
            as={Link}
            to='/discover'
            // variant='glow'
            className='from-Primary-600 to-Secondary-600 hover:from-Primary-500 hover:to-Secondary-500 bg-gradient-to-r text-white shadow-lg'
            startContent={<Sparkles className='size-4' />}
          >
            Discover New Content
          </Button>
        </motion.div>
      </motion.div>

      <LibraryStats items={allItems} />

      {recentItems.length > 0 && (
        <motion.div variants={itemVariants} className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-Primary-50 text-2xl font-semibold'>Recently Added</h2>
              <p className='text-Grey-400 mt-1 text-sm'>Latest additions to your library</p>
            </div>
            <Button
              as={Link}
              to='/library/all'
              endContent={<SquareArrowOutUpRight className='size-4' />}
              className='button-secondary!'
            >
              View All ({totalItems})
            </Button>
          </div>

          <motion.div
            className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'
            variants={containerVariants}
          >
            {recentItems.map((item, index) => (
              <motion.div
                key={`${item.media_type}-${item.id}`}
                variants={itemVariants}
                custom={index}
                initial='hidden'
                animate='visible'
                transition={{ delay: index * 0.1 }}
              >
                <LibraryCard item={item} tabIndex={0} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
