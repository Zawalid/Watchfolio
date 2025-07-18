import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryCardsList from '@/components/library/LibraryCardsList';
import { usePageTitle } from '@/hooks/usePageTitle';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useFilteredLibrary } from '@/hooks/useFilteredLibrary';

export default function Library({ status }: { status: LibraryFilterStatus }) {
  const { getAllItems, getItemsByStatus } = useLibraryStore();

  usePageTitle(
    status === 'all' ? 'Your Library' : LIBRARY_MEDIA_STATUS.find((m) => m.value === status)?.label || status
  );

  const rawItems = (() => {
    if (!status || status === 'all') return getAllItems();
    return getItemsByStatus(status);
  })();

  const filteredItems = useFilteredLibrary(rawItems, status);

  return <LibraryCardsList items={filteredItems} status={status || 'all'} isOwnProfile />;
}
