import { motion } from 'framer-motion';
import { Heart, Tv, Globe } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';
import { GENRES, NETWORKS, CONTENT_PREFERENCES } from '@/utils/constants/TMDB';
import NetworkCard from '@/pages/networks/NetworkCard';
import { Profile } from '@/lib/appwrite/types';

interface ViewingTasteProps {
  profile: Profile;
  isOwnProfile:boolean
}

export default function ViewingTaste({ profile, isOwnProfile }: ViewingTasteProps) {
  return (
    <motion.div variants={containerVariants} className='lg:grid-cols- grid gap-6'>
      {profile.favoriteGenres && (
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.4 }}
          className='space-y-4 rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'
        >
          <div className='flex items-center gap-3'>
            <div className='to-Error-600 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500'>
              <Heart className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-white'>Favorite Genres</h3>
              <p className='text-Grey-400 text-sm'>Preferred content categories</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {profile.favoriteGenres.length > 0 ? (
              profile.favoriteGenres.map((genreId) => (
                <span key={genreId} className='pill-bg text-Grey-300 text-sm transition-colors hover:bg-white/10'>
                  {GENRES.find((g) => g.id === genreId)?.label || ''}
                </span>
              ))
            ) : (
              <p className='text-Grey-400 text-sm italic'>
                {isOwnProfile
                  ? 'You haven’t picked any favorite genres yet. Update your profile to let others know what you love watching.'
                  : 'No favorite genres listed. Looks like this user enjoys a bit of everything!'}
              </p>
            )}
          </div>
        </motion.div>
      )}
      {profile.contentPreferences && (
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.4 }}
          className='space-y-4 rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'
        >
          <div className='flex items-center gap-3'>
            <div className='to-Error-600 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500'>
              <Globe className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-white'>Content Preferences</h3>
              <p className='text-Grey-400 text-sm'>Preferred content types</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {profile.contentPreferences.length > 0 ? (
              profile.contentPreferences.map((preference) => (
                <span key={preference} className='pill-bg text-Grey-300 text-sm'>
                  {CONTENT_PREFERENCES.find((p) => p.code === preference)?.name || ''}
                </span>
              ))
            ) : (
              <p className='text-Grey-400 text-sm italic'>
                {isOwnProfile
                  ? 'You haven’t added any regional or stylistic preferences yet. You can set them in your profile settings.'
                  : 'No content preferences set. This user might be exploring content from all over the world!'}
              </p>
            )}
          </div>
        </motion.div>
      )}
      {profile.favoriteNetworks && (
        <motion.div
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          transition={{ delay: 0.4 }}
          className='col-span- space-y-4 rounded-xl border border-white/5 bg-white/[0.015] p-4 backdrop-blur-sm'
        >
          <div className='flex items-center gap-3'>
            <div className='to-Error-600 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500'>
              <Tv className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-white'>Favorite Networks</h3>
              <p className='text-Grey-400 text-sm'>Preferred streaming platforms</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {profile.favoriteNetworks.length > 0 ? (
              profile.favoriteNetworks.map((networkId) => {
                const network = NETWORKS.find((net) => net.id === networkId);
                if (!network) return null;
                return <NetworkCard key={network.slug} network={network} className='h-22 w-32' />;
              })
            ) : (
              <p className='text-Grey-400 text-sm italic'>
                {isOwnProfile
                  ? 'No favorite streaming platforms selected yet. Add them to better tailor your recommendations.'
                  : "No favorite networks yet — maybe they're watching off the grid!"}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
