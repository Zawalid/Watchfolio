import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { ChartBarStacked, Library, Heart, UserSearch, Lock } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsInsights from '@/components/profile/StatsInsights';
import ViewingTaste from '@/components/profile/ViewingTaste';
import { Tab, Tabs } from '@heroui/tabs';
import { TABS_CLASSNAMES } from '@/styles/heroui';
import UserLibrary from '@/components/profile/UserLibrary';
import { useAuthStore } from '@/stores/useAuthStore';
import { appwriteService } from '@/lib/api/appwrite-service';
import { useQuery } from '@tanstack/react-query';
import { Status } from '@/components/ui/Status';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { checkIsOwnProfile } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => await appwriteService.profiles.getByUsername(username!),
    enabled: !!username,
  });

  const isOwnProfile = checkIsOwnProfile(username);

  usePageTitle(
    isLoading
      ? 'Loading...'
      : !profile
        ? 'User Not Found'
        : profile.visibility === 'private' && !isOwnProfile
          ? 'Private Profile'
          : isOwnProfile
            ? 'Your Profile'
            : `${profile.name} (@${profile.username})`
  );

  if (isLoading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <Status.NotFound
        Icon={UserSearch}
        title='User Not Found'
        message={`We couldn't find a user with the username "${username}". Please check the spelling and try again.`}
      />
    );
  }

  if (profile.visibility === 'private' && !isOwnProfile) {
    return (
      <Status.NotFound
        Icon={Lock}
        title='Private Profile'
        message='This user has chosen to keep their profile private. Only approved users can view their content.'
        animatedRingProps={{ floatingIcons: [] }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-8'>
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      <Tabs classNames={TABS_CLASSNAMES}>
        <Tab
          key='taste'
          title={
            <div className='flex items-center gap-2'>
              <Heart className='size-4' />
              <span>Viewing Taste</span>
            </div>
          }
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <ViewingTaste profile={profile} isOwnProfile={isOwnProfile} />
          </motion.div>
        </Tab>
        <Tab
          key='stats'
          title={
            <div className='flex items-center gap-2'>
              <ChartBarStacked className='size-4' />
              <span>Stats & Insights</span>
            </div>
          }
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatsInsights isOwnProfile={isOwnProfile} />
          </motion.div>
        </Tab>
        <Tab
          key='library'
          title={
            <div className='flex items-center gap-2'>
              <Library className='size-4' />
              <span>Library</span>
            </div>
          }
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <UserLibrary profile={profile} />
          </motion.div>
        </Tab>
      </Tabs>
    </motion.div>
  );
}
