import { motion } from 'framer-motion';
import { Share2, Lock, Globe, UserRoundPen, Check, Film, Tv, Clapperboard } from 'lucide-react';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { cn } from '@/utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Avatar } from '@heroui/avatar';
import { AVATAR_CLASSNAMES } from '@/styles/heroui';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

const getContentType = (type: string) => {
  switch (type) {
    case 'movies':
      return { display: 'Movie Enthusiast', icon: <Film className='size-4' /> };
    case 'series':
      return { display: 'Series Binge-Watcher', icon: <Tv className='size-4' /> };
    case 'both':
    default:
      return { display: 'Film & TV Aficionado', icon: <Clapperboard className='size-4' /> };
  }
};

export default function ProfileHeader({ profile, isOwnProfile = false }: ProfileHeaderProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='from-Grey-800/50 to-Grey-900/50 relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-8 backdrop-blur-sm'
    >
      <div className='relative'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            {/* Avatar */}
            <div className='relative'>
              <Avatar src={profile.avatarUrl} alt={profile.name} classNames={AVATAR_CLASSNAMES} className='size-28!' />
              <Tooltip
                content={profile.visibility === 'public' ? 'Public Profile' : 'Private Profile'}
                className='tooltip-secondary!'
              >
                <div
                  className={cn(
                    'absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-white/10 text-white/80 backdrop-blur-md',
                    profile.visibility === 'public' ? 'bg-Success-500/50' : 'bg-Warning-500/50'
                  )}
                >
                  {profile.visibility === 'public' ? <Globe className='size-3' /> : <Lock className='size-3' />}
                </div>
              </Tooltip>
            </div>

            {/* Name and Bio */}
            <div className='flex-1 space-y-4'>
              <div>
                <h1 className='heading gradient'>{profile.name}</h1>
                <p className='text-Secondary-400 text-base font-medium'>@{profile.username}</p>
              </div>

              <p className='text-Grey-300 max-w-2xl text-sm leading-relaxed lg:text-base'>
                {profile.bio || 'This user hasn’t written a bio yet, but their library speaks volumes'}
              </p>

              <div className='flex flex-wrap items-center gap-3 text-sm'>
                <motion.span className='bg-Secondary-900/80 text-Secondary-300 ring-Secondary-500/30 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ring-1 backdrop-blur-md'>
                  {getContentType(profile.favoriteContentType).icon}
                  <span>{getContentType(profile.favoriteContentType).display}</span>
                </motion.span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-3'>
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
              <Button className='button-primary px-4 py-2' startContent={<UserRoundPen className='h-4 w-4' />}>
                Customize Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
