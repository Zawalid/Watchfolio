import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { queryKeys } from '@/lib/react-query';
import { NETWORKS } from '@/utils/constants/TMDB';
import { getTvShowsByNetwork } from '@/lib/api/TMDB';
import MediaCardsList from '@/components/media/MediaCardsList';
import SortBy from '@/components/SortBy';
import { Tv } from 'lucide-react';
import { cn } from '@/utils';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useDiscoverParams } from '@/hooks/useDiscoverParams';
import FiltersModal from '@/components/FiltersModal';
import { useDisclosure } from '@heroui/react';
import { Status } from '@/components/ui/Status';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NetworkDetails() {
  const { slug } = useParams();
  const { discoverParams } = useDiscoverParams('tv');
  const filtersDisclosure = useDisclosure();

  const network = NETWORKS.find((n) => n.slug === slug);

  usePageTitle(network?.name || 'TV Network');

  if (!network)
    return (
      <Status.NotFound
        title='Network Not Found'
        message='The network you are looking for does not exist. Please try again with a different network.'
      />
    );

  return (
    <motion.div className='flex h-full flex-col gap-8' variants={containerVariants} initial='hidden' animate='visible'>
      <motion.div
        variants={itemVariants}
        className='relative grid h-[300px] place-content-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-t from-black/50 to-transparent p-8 shadow-2xl'
      >
        <img
          src={network.logo.replace('w500', 'original')}
          alt={`${network.name} logo`}
          className={cn(
            'relative z-10 max-h-[200px] object-contain drop-shadow-2xl',
            network.invertOnHover && 'invert'
          )}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'
      >
        <div className='flex items-center gap-3'>
          <div className='from-Success-400 to-Primary-400 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Tv className='h-6 w-6 text-white drop-shadow-sm' />
          </div>
          <div>
            <h1 className='heading gradient'>{network.name}</h1>
            <p className='text-Grey-400 text-sm'>Explore popular TV shows from this network.</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <SortBy
            options={[
              { key: 'popularity', label: 'Popularity' },
              { key: 'vote_average', label: 'Rating' },
              { key: 'first_air_date', label: 'Air Date' },
              { key: 'name', label: 'Title' },
            ]}
            defaultSort='popularity'
          />
          <FiltersModal
            disclosure={filtersDisclosure}
            title='TV Shows'
            filterOptions={['genres', 'language', 'ratingRange', 'releaseYear']}
          />
        </div>
      </motion.div>

      <MediaCardsList
        queryOptions={{
          queryKey: queryKeys.network(network?.id, discoverParams),
          queryFn: () => getTvShowsByNetwork(network!.id, discoverParams),
          enabled: !!network?.id,
        }}
      />
    </motion.div>
  );
}
