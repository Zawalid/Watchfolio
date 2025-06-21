import Details from '@/components/settings/Details';
import ChangePassword from '@/components/settings/ChangePassword';
import DeleteAccount from '@/components/settings/DeleteAccount';

export default function Account() {
  return (
    <div className='flex flex-col gap-8'>
      <h3 className='text-Primary-100 text-xl font-semibold'>Details</h3>
      <Details />
      <hr className='border-border border-t-2' />
      <div className='space-y-2'>
        <h3 className='text-Primary-100 text-xl font-semibold'>Security</h3>
        <div className='flex flex-col gap-5'>
          <ChangePassword />
        </div>
      </div>

      <hr className='border-border border-t-2' />
      <div className='space-y-2'>
        <h3 className='text-Primary-100 text-xl font-semibold'>Danger Zone</h3>
        <div className='flex flex-col gap-5'>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
