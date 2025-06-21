import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router';

export default function DeleteAccount() {
  const { confirm } = useConfirmationModal();
  const {user, deleteUserAccount, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Account',
      message:
        'Are you sure you want to delete your account? This action is irreversible and will permanently delete all your data including your library, preferences, and profile.',
      confirmText: 'Delete Account',
      confirmVariant: 'danger',
      confirmationKey: 'delete-account',
    });

    if (confirmed) {
      try {
        await deleteUserAccount();
        addToast({
          title: 'Account deleted',
          description: 'Your account has been permanently deleted.',
          color: 'success',
        });
        navigate('/');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
        console.error('Failed to delete account:', error);
        addToast({
          title: 'Error deleting account',
          description: errorMessage,
          color: 'danger',
        });
      }
    }
  };

   if (!user) {
    return (
      <div className='flex flex-col gap-5'>
        <p className='text-Grey-400'>Please sign in to delete your account.</p>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col gap-2'>
        <h4 className='text-Grey-300 font-semibold'>Delete Account</h4>
        <p className='text-Grey-300 text-sm'>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button color='danger' size='sm' className='w-fit' onPress={handleDeleteAccount} isLoading={isLoading}>
          Delete Account
        </Button>
      </div>
    </>
  );
}
