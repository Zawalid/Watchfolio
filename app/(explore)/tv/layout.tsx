import Tabs from '@/components/ui/Tabs';
import { TABS_INDICATORS } from '@/utils/constants';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='space-y-12'>
      <Tabs
        tabs={[
          { label: 'Popular', value: 'popular', link: '/tv/popular' },
          { label: 'Top Rated', value: 'top-rated', link: '/tv/top-rated' },
          { label: 'Airing Today', value: 'airing-today', link: '/tv/airing-today' },
          { label: 'On TV', value: 'on-tv', link: '/tv/on-tv' },
        ]}
        TABS_INDICATORS={TABS_INDICATORS}
      />
      {children}
    </div>
  );
}
