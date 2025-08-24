import LibraryCardsList from '@/components/library/LibraryCardsList';
import { usePageTitle } from '@/hooks/usePageTitle';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

export default function Library({ status }: { status: LibraryFilterStatus }) {
  usePageTitle(
    status === 'all' ? 'Your Library' : LIBRARY_MEDIA_STATUS.find((m) => m.value === status)?.label || status
  );

  return <LibraryCardsList status={status || 'all'} isOwnProfile />;
}
