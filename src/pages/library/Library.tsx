import { useLibraryStore } from '@/stores/useLibraryStore';
import LibraryInfiniteCardsList from '@/components/library/LibraryInfiniteCardsList';
import { usePageTitle } from '@/hooks/usePageTitle';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { useFilteredLibrary } from '@/hooks/library/useFilteredLibrary';

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

  return <LibraryInfiniteCardsList items={filteredItems} allItems={rawItems} status={status || 'all'} isOwnProfile />;
}
