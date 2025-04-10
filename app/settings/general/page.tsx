import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import Switch from '@/components/ui/Switch';
import { preferencesSchema } from '@/lib/validation';

type FormData = z.infer<typeof preferencesSchema>;

export default async function Page() {
  const user = {};

  return (
    <div className='flex flex-col gap-8'>
      <h3 className='text-xl font-semibold text-Primary/100'>Preferences</h3>

      <div className='flex flex-col gap-x-3 gap-y-3 xs:grid xs:grid-cols-[auto_144px] xs:items-center xs:gap-x-6 sm:gap-x-10'>
        <div>
          <h4 className='font-bold text-Grey/200'>Sign out confirmation</h4>
          <p className='mt-2 text-Grey/400'>Display a confirmation dialog when you want to sign out.</p>
        </div>
        <Switch className='scale-150' />
      </div>
      <div className='flex flex-col gap-x-3 gap-y-3 xs:grid xs:grid-cols-[auto_144px] xs:items-center xs:gap-x-6 sm:gap-x-10'>
        <div>
          <h4 className='font-bold text-Grey/200'>Remove from watchlist confirmation</h4>
          <p className='mt-2 text-Grey/400'>
            Display a confirmation dialog when you want to remove an item from your watchlist.
          </p>
        </div>
        <Switch className='scale-150' />
      </div>

      <hr className='border-t-2 border-border' />
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold text-Primary/100'></h3>
      </div>
    </div>
  );
}
