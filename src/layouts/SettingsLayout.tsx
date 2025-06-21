import { Outlet } from 'react-router';
import Sidebar from '@/components/settings/Sidebar';

export default function Settings() {
  return (
    <div className='grid h-full pb-7 grid-cols-[200px_auto] gap-5'>
      <Sidebar />
      <Outlet />
    </div>
  );
}
