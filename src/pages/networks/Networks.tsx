import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import { NETWORKS } from '@/utils/constants/TMDB';
import { containerVariants, itemVariants } from '@/lib/animations';
import NetworkCard from './NetworkCard';

export default function Networks() {
  return (
    <motion.div variants={containerVariants} className='container mx-auto space-y-8 px-4 py-8'>
      <motion.div className='flex items-center gap-4' variants={itemVariants}>
        <div className='from-Tertiary-400 to-Primary-400 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
          <Tv className='h-6 w-6 text-white drop-shadow-sm' />
        </div>
        <div>
          <h1 className='heading gradient'>TV Networks</h1>
          <p className='text-Grey-400 text-sm'>Discover shows from your favorite streaming platforms</p>
        </div>
      </motion.div>

      {/* Networks Grid */}
      <motion.div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3' variants={containerVariants}>
        {NETWORKS.map((network) => (
          <motion.div key={network.id} variants={itemVariants}>
            <NetworkCard network={network} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
