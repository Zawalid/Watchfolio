import { motion } from 'framer-motion';
import { Share2, UserRoundPen, Check, Film, Tv, Clapperboard, CalendarDays, Clock } from 'lucide-react';
import { Button, useDisclosure } from '@heroui/react';
import { Tooltip } from '@heroui/react';
import { Avatar } from '@heroui/react';
import { AVATAR_CLASSNAMES } from '@/styles/heroui';
import { formatDate } from '@/utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Profile } from '@/lib/appwrite/types';
import CustomizeProfileModal from './CustomizeProfileModal';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  stats: LibraryStats;
}

const getContentType = (type: string) => {
  switch (type) {
    case 'movies':
      return { display: 'Movie Enthusiast', icon: <Film className='size-4' /> };
    case 'tv':
      return { display: 'Series Binge-Watcher', icon: <Tv className='size-4' /> };
    default:
      return { display: 'Film & TV Aficionado', icon: <Clapperboard className='size-4' /> };
  }
};

export default function ProfileHeader({ profile, isOwnProfile = false, stats }: ProfileHeaderProps) {
  const disclosure = useDisclosure();
  const { copied, copy } = useCopyToClipboard();
  const joinedDate = profile.$createdAt ? formatDate(profile.$createdAt) : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='from-Grey-800/50 to-Grey-900/50 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-8 backdrop-blur-sm'
      >
        <div className='relative'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            {/* Left: Avatar + Info */}
            <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
              <div className='relative'>
                <Avatar
                  src={profile.avatarUrl}
                  alt={profile.name}
                  classNames={AVATAR_CLASSNAMES}
                  className='size-28!'
                />
              </div>

              {/* Name, username, bio, type */}
              <div className='flex-1 space-y-4'>
                <div>
                  <h1 className='heading gradient'>{profile.name}</h1>
                  <p className='text-Secondary-400 text-base font-medium'>@{profile.username}</p>
                </div>

                <p className='text-Grey-300 max-w-2xl text-sm leading-relaxed lg:text-base'>
                  {profile.bio ||
                    (isOwnProfile
                      ? 'Your bio is empty. Add something about yourself!'
                      : 'This user hasn’t written a bio yet, but their watchlist tells a story.')}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className='flex flex-wrap gap-2'
                >
                  <div className='bg-Grey-800/60 flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm backdrop-blur-sm'>
                    <Film className='text-Primary-400 h-4 w-4' />
                    <span className='font-medium text-white'>{stats.all}</span>
                    <span className='text-Grey-400'>Watched</span>
                  </div>
                  <div className='bg-Grey-800/60 flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm backdrop-blur-sm'>
                    <Clock className='text-Secondary-400 h-4 w-4' />
                    <span className='font-medium text-white'>{`${stats.totalHoursWatched}h`}</span>
                    <span className='text-Grey-400'>Watch Time</span>
                  </div>
                </motion.div>

                <div className='flex flex-wrap items-center gap-3 text-sm'>
                  <span className='bg-Secondary-900/80 text-Secondary-300 ring-Secondary-500/30 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                    {getContentType(profile.favoriteContentType).icon}
                    <span>{getContentType(profile.favoriteContentType).display}</span>
                  </span>

                  {joinedDate && (
                    <span className='bg-Grey-800/80 text-Grey-300 ring-Grey-700/40 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                      <CalendarDays className='size-4' />
                      <span>Joined {joinedDate}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className='flex flex-wrap items-center gap-3 sm:justify-end sm:gap-3'>
              {profile.visibility === 'public' && (
                <Tooltip content={copied ? 'Link copied!' : 'Copy profile link'} className='tooltip-secondary!'>
                  <Button
                    isIconOnly
                    className='button-secondary!'
                    onPress={async () => await copy(window.location.href)}
                    aria-label='Share profile'
                  >
                    {copied ? <Check className='text-Success-400 h-4 w-4' /> : <Share2 className='h-4 w-4' />}
                  </Button>
                </Tooltip>
              )}

              {isOwnProfile && (
                <Button
                  onPress={disclosure.onOpen}
                  className='button-primary px-4 py-2'
                  startContent={<UserRoundPen className='h-4 w-4' />}
                >
                  Customize Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <CustomizeProfileModal disclosure={disclosure} />
    </>
  );
}
