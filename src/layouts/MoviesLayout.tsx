import { Outlet } from 'react-router';
import Tabs from '@/components/ui/Tabs';

export default function MoviesLayout() {
  return (
    <div className='space-y-12 container'>
      <Tabs
        tabs={[
          { label: 'Popular', value: 'popular', link: '/movies/popular' },
          { label: 'Top Rated', value: 'top-rated', link: '/movies/top-rated' },
          { label: 'Now Playing', value: 'now-playing', link: '/movies/now-playing' },
          { label: 'Upcoming', value: 'upcoming', link: '/movies/upcoming' },
        ]}
      />
      <Outlet />
    </div>
  );
}
