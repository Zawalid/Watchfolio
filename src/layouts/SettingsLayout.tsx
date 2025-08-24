import { Outlet } from 'react-router';
import Sidebar from '@/components/settings/Sidebar';

export default function Settings() {
  return (
    <div className='grid h-full pb-7 grid-cols-[250px_auto] gap-8'>
      <Sidebar />
      <Outlet />
    </div>
  );
}
