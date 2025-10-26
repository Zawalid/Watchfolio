import { useOutletContext } from 'react-router';
import LibraryView from '@/components/library/LibraryView';
import { usePageTitle } from '@/hooks/usePageTitle';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';

export default function Library({ status }: { status: LibraryFilterStatus }) {
  const { isSearching } = useOutletContext<{ isSearching: boolean }>();

  usePageTitle(
    status === 'all' ? 'Your Library' : LIBRARY_MEDIA_STATUS.find((m) => m.value === status)?.label || status
  );

  return <LibraryView status={status} isSearching={isSearching} />;
}
