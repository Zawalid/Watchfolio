import { useMemo } from 'react';
import { Layers } from 'lucide-react';

import { MediaLayout } from '@/layouts/Layout';
import { MOVIE_COLLECTIONS } from '@/utils/constants/TMDB';

interface CollectionsLayoutProps {
  children: React.ReactNode;
}

export default function CollectionsLayout({ children }: CollectionsLayoutProps) {
  // Transform MOVIE_COLLECTIONS into the format expected by MediaLayout
  const categories = useMemo(() => {
    return Object.keys(MOVIE_COLLECTIONS).map((key) => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    }));
  }, []);

  return (
    <MediaLayout
      pageTitle="Movie Collections"
      pageDescription="Discover epic movie franchises and series"
      icon={<Layers className="w-6 h-6" />}
      categories={categories}
      type="collections"
      showSortBy={false}
      showSearch={false}
    >
      {children}
    </MediaLayout>
  );
}
