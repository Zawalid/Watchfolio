import LibraryCardsList from '@/components/library/LibraryCardsList';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useFilteredLibrary } from '@/hooks/useFilteredLibrary';
import { mapFromAppwriteData } from '@/utils/library';
import { LibraryLayout } from '@/layouts';
import { Status } from '../ui/Status';

export default function UserLibrary({ profile, status }: { profile: Profile; status: LibraryFilterStatus }) {
  usePageTitle(`${profile.name} Library`);

  const items = profile.library?.items?.length
    ? profile.library.items.map((item) => mapFromAppwriteData(item, item.media))
    : [];
  const filteredItems = useFilteredLibrary(items, status);

  console.log(profile.library?.items);

  if (!profile.library?.items?.length) return <Status.Empty />;
  return (
    <div className='h-full space-y-8'>
      <LibraryLayout userName={profile.name} isOwnProfile={false}>
        <LibraryCardsList items={filteredItems} allItems={items} status={status || 'all'} isOwnProfile={false} />
      </LibraryLayout>
    </div>
  );
}
