import Sidebar from './components/Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid h-full grid-cols-[200px_auto] gap-5'>
      <Sidebar />
      {children}
    </div>
  );
}
