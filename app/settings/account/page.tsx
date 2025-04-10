import Details from '../components/Details';
import ChangePassword from '../components/ChangePassword';
import DeleteAccount from '../components/DeleteAccount';
import { getUser } from '@/lib/db/user';

export default async function Page() {
  const user = await getUser();

  return (
    <div className='flex flex-col gap-8'>
      <h3 className='text-xl font-semibold text-Primary/100'>Details</h3>
      <Details user={user} />
      <hr className='border-t-2 border-border' />
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold text-Primary/100'>Security</h3>
        <div className='flex flex-col gap-5'>
          <ChangePassword />
        </div>
      </div>

      <hr className='border-t-2 border-border' />
      <div className='space-y-2'>
        <h3 className='text-xl font-semibold text-Primary/100'>Danger Zone</h3>
        <div className='flex flex-col gap-5'>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
