import { Cloud, User } from 'lucide-react';
import Details from '@/components/settings/Details';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Profile() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
        
      <div className='space-y-6'>
        <div className='border-Primary-500/20 from-Primary-500/5 to-Primary-600/10 flex flex-col items-center gap-6 rounded-xl border bg-gradient-to-br p-8 text-center'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-full border p-4'>
            <User className='text-Primary-400 size-8' />
          </div>

          <div className='space-y-2'>
            <h3 className='text-Primary-100 text-xl font-semibold'>Create Your Profile</h3>
            <p className='text-Grey-300 max-w-md text-sm'>
              Sign in to personalize your Watchfolio experience and keep your data synced across all devices.
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='border-Primary-500/10 bg-Primary-500/[0.02] rounded-lg border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='bg-Primary-500/10 rounded-lg p-2'>
                <User className='text-Primary-400 size-4' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Personal Profile</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Customize your avatar, bio, and preferences</p>
          </div>

          <div className='border-Primary-500/10 bg-Primary-500/[0.02] rounded-lg border p-4'>
            <div className='mb-3 flex items-center gap-3'>
              <div className='bg-Primary-500/10 rounded-lg p-2'>
                <Cloud className='text-Primary-400 size-4' />
              </div>
              <h4 className='text-Grey-200 font-medium'>Cloud Sync</h4>
            </div>
            <p className='text-Grey-400 text-sm'>Keep your library synced across all devices</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-8'>
      <section className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/10 border-Primary-500/20 rounded-lg border p-2'>
            <User className='text-Primary-400 size-5' />
          </div>
          <h3 className='text-Primary-100 text-xl font-semibold'>Profile Information</h3>
        </div>
        <div className='rounded-xl border border-white/5 bg-white/[0.015] p-6 backdrop-blur-sm'>
          <Details />
        </div>
      </section>
    </div>
  );
}
