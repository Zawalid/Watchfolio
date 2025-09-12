import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import { NETWORKS } from '@/utils/constants/TMDB';
import { containerVariants, itemVariants } from '@/lib/animations';
import NetworkCard from './NetworkCard';
import PageLayout from '@/layouts/PageLayout';
import { Input } from '@/components/ui/Input';
import { useQueryState } from 'nuqs';
import { Status } from '@/components/ui/Status';

export default function Networks() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '', shallow: false });

  const searchedNetworks = NETWORKS.filter((network) => network.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <PageLayout Icon={Tv} title='TV Networks' subtitle='Discover shows from your favorite streaming platforms'>
      <Input
        type='text'
        icon='search'
        parentClassname='w-full md:w-80'
        name='search'
        value={query}
        label='Search Networks'
        placeholder='Search by title...'
        onChange={(e) => setQuery(e.target.value)}
      />
      <motion.div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3' variants={containerVariants}>
        {searchedNetworks.length > 0 ? (
          searchedNetworks.map((network) => (
            <motion.div key={network.id} variants={itemVariants}>
              <NetworkCard network={network} />
            </motion.div>
          ))
        ) : (
          <Status.Empty
            title='No Networks Found'
            message='Try adjusting your search to find what you are looking for.'
            Icon={Tv}
          />
        )}
      </motion.div>
    </PageLayout>
  );
}
