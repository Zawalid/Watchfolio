import { useState } from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import SortBy from '@/components/SortBy';
import LibraryViewLayout from '@/components/library/LibraryViewLayout';
import LibraryView from '@/components/library/LibraryView';
import { useAuthStore } from '@/stores/useAuthStore';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { Profile } from '@/lib/appwrite/types';

export default function UserLibrary({ profile, stats }: { profile: Profile; stats: LibraryStats }) {
  const { checkIsOwnProfile } = useAuthStore();
  const [status, setStatus] = useState<LibraryFilterStatus>('all');
  const isOwnProfile = checkIsOwnProfile(profile.username);

  const hiddenProfileSections = profile?.hiddenProfileSections || [];
  const visibleStatuses = LIBRARY_MEDIA_STATUS.filter(
    (s) => isOwnProfile || !hiddenProfileSections.includes(`library.${s.value}`)
  );

  const tabs = [
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
  ];

  const renderActions = () => <SortBy options={[{ key: 'recent', label: 'Recently Added' }]} defaultSort='recent' />;

  return (
    <LibraryViewLayout
      sidebarTitle={`${profile.name.split(' ')[0]}'s Library`}
      tabs={tabs}
      activeTab={status}
      onTabChange={(val) => setStatus(val as LibraryFilterStatus)}
      searchLabel={`Search ${profile.name.split(' ')[0]}'s Library`}
      renderActions={renderActions}
    >
      <LibraryView profile={profile} status={status} />
    </LibraryViewLayout>
  );
}
