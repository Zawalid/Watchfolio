import { Outlet } from 'react-router';
import Sidebar from '@/components/settings/Sidebar';
import { useViewportSize } from '@/hooks/useViewportSize';
import { cn } from '@/utils';

export default function Settings() {
  const { isAbove } = useViewportSize();

  return (
    <div className={cn('h-full relative gap-8 py-6', isAbove('lg') && 'grid grid-cols-[250px_auto]')}>
      <Sidebar />
      <Outlet />
    </div>
  );
}
