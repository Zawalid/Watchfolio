import { Outlet } from 'react-router';
import Tabs from '@/components/ui/Tabs';

export default function TvLayout() {
  return (
    <div className='space-y-12'>
      <Tabs
        tabs={[
          { label: 'Popular', value: 'popular', link: '/tv/popular' },
          { label: 'Top Rated', value: 'top-rated', link: '/tv/top-rated' },
          { label: 'Airing Today', value: 'airing-today', link: '/tv/airing-today' },
          { label: 'On The Air', value: 'no-the-air', link: '/tv/no-the-air' },
        ]}
      />
      <Outlet />
    </div>
  );
}
