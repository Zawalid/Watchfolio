import { useState } from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import LibraryViewLayout from '@/components/library/LibraryViewLayout';
import LibraryView from '@/components/library/LibraryView';
import { useAuthStore } from '@/stores/useAuthStore';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { Profile } from '@/lib/appwrite/types';
import { useOutletContext } from 'react-router';

export default function UserLibrary() {
  const { profile, stats } = useOutletContext<{ profile: Profile; stats: LibraryStats }>();

  const { checkIsOwnProfile } = useAuthStore();
  const [status, setStatus] = useState<LibraryFilterStatus>('all');
  const isOwnProfile = checkIsOwnProfile(profile.username);

  const hiddenProfileSections = profile?.hiddenProfileSections || [];
  const visibleStatuses = LIBRARY_MEDIA_STATUS.filter(
    (s) => isOwnProfile || !hiddenProfileSections.includes(`library.${s.value}`)
  );

  return (
    <LibraryViewLayout
      sidebarTitle={isOwnProfile ? 'My Library' : `${profile.name.split(' ')[0]}'s Library`}
      tabs={[
        {
          label: `All (${stats.all})`,
          icon: <GalleryVerticalEnd className='size-4' />,
          value: 'all',
        },
        ...visibleStatuses.map((s) => {
          const IconComponent = s.icon;
          return {
            label: `${s.label} (${stats[s.value]})`,
            icon: <IconComponent className='size-4' />,
            value: s.value,
          };
        }),
      ]}
      activeTab={status}
      onTabChange={(val) => setStatus(val as LibraryFilterStatus)}
      searchLabel={`Search ${profile.name.split(' ')[0]}'s Library`}
      isOwnProfile={isOwnProfile}
    >
      <LibraryView profile={profile} status={status} />
    </LibraryViewLayout>
  );
}
