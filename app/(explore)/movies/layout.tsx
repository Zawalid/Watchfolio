import Tabs from '@/components/ui/Tabs';
import { TABS_INDICATORS } from '@/utils/constants';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='space-y-12'>
      <Tabs
        tabs={[
          { label: 'Popular', value: 'popular', link: '/movies/popular' },
          { label: 'Top Rated', value: 'top-rated', link: '/movies/top-rated' },
          { label: 'Now Playing', value: 'now-playing', link: '/movies/now-playing' },
          { label: 'Upcoming', value: 'upcoming', link: '/movies/upcoming' },
        ]}
        TABS_INDICATORS={TABS_INDICATORS}
      />
      {children}
    </div>
  );
}
