import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { AlertCircle, ChartBarStacked, Library, Loader2, Heart, UserSearch } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import LibraryOverview from '@/components/profile/LibraryOverview';
import Preferences from '@/components/profile/Preferences';
import { Tab, Tabs } from '@heroui/tabs';
import { TABS_CLASSNAMES } from '@/styles/heroui';
import UserLibrary from '@/components/profile/UserLibrary';
import { useAuthStore } from '@/stores/useAuthStore';
import { appwriteService } from '@/lib/api/appwrite-service';
import { useQuery } from '@tanstack/react-query';
import { Status } from '@/components/ui/Status';

const mockLibraryStats: LibraryStats = {
  totalItems: 847,
  watching: 23,
  completed: 542,
  willWatch: 156,
  onHold: 12,
  dropped: 12,
  favorites: 89,
  movies: 456,
  tvShows: 391,
  totalHoursWatched: 1247,
  averageRating: 4.2,
  topGenres: [
    { name: 'Drama', count: 156 },
    { name: 'Sci-Fi', count: 134 },
    { name: 'Thriller', count: 98 },
    { name: 'Comedy', count: 87 },
    { name: 'Action', count: 76 },
  ],
  recentActivity: [
    {
      id: '1',
      title: 'The Bear',
      type: 'tv',
      action: 'completed',
      date: '2024-01-10T00:00:00Z',
      rating: 5,
    },
    {
      id: '2',
      title: 'Oppenheimer',
      type: 'movie',
      action: 'rated',
      date: '2024-01-08T00:00:00Z',
      rating: 4,
    },
    {
      id: '3',
      title: 'House of the Dragon',
      type: 'tv',
      action: 'added',
      date: '2024-01-05T00:00:00Z',
    },
    {
      id: '4',
      title: 'Dune: Part Two',
      type: 'movie',
      action: 'added',
      date: '2024-01-03T00:00:00Z',
    },
  ],
};

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user, isAuthenticated, isLoading: isUserLoading } = useAuthStore();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => await appwriteService.profiles.getByUsername(username!),
    enabled: !!username,
  });
  
  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-Grey-400 flex items-center gap-3'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Status.NotFound
        Icon={UserSearch}
        title='User Not Found'
        message={`We couldn't find a user with the username "${username}". Please check the spelling and try again.`}
      />
    );
  }

  // Check if profile is private and user doesn't have access
  if (profile.visibility === 'private') {
    // In real app, check if current user owns this profile or has permission
    const hasAccess = true; // Replace with actual permission check

    if (!hasAccess) {
      return (
        <div className='flex h-96 items-center justify-center'>
          <div className='text-center'>
            <AlertCircle className='text-Warning-400 mx-auto mb-4 h-12 w-12' />
            <h2 className='mb-2 text-xl font-semibold text-white'>Private Profile</h2>
            <p className='text-Grey-400'>This profile is set to private and cannot be viewed.</p>
          </div>
        </div>
      );
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-8'>
      <ProfileHeader profile={profile} isOwnProfile={isAuthenticated && username === profile.username} />

      <Tabs classNames={TABS_CLASSNAMES}>
        <Tab
          key='preferences'
          title={
            <div className='flex items-center gap-2'>
              <Heart className='size-4' />
              <span>Viewing Taste</span>
            </div>
          }
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Preferences profile={profile} />
          </motion.div>
        </Tab>
        <Tab
          key='overview'
          title={
            <div className='flex items-center gap-2'>
              <ChartBarStacked className='size-4' />
              <span>Stats & Insights</span>
            </div>
          }
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <LibraryOverview stats={mockLibraryStats} />
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
            <UserLibrary profile={profile} status='all' />
          </motion.div>
        </Tab>
      </Tabs>
    </motion.div>
  );
}
