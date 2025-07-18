import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/react';
import { Button } from '@heroui/react';
import { useNavigate } from 'react-router';
import { Trash2, Info } from 'lucide-react';

export default function DeleteAccount() {
  const { confirm } = useConfirmationModal();
  const { user, deleteUserAccount, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete Account',
      message:
        'Are you sure you want to delete your account? This action is irreversible and will permanently delete all your data.',
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
    <div className='space-y-4'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-4'>
          <div className='space-y-2'>
            <h4 className='text-lg font-semibold text-red-100'>Delete Account</h4>
            <p className='text-Grey-300 max-w-md text-sm'>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </div>
        <Button
          color='danger'
          size='sm'
          onPress={handleDeleteAccount}
          isLoading={isLoading}
          className='flex items-center gap-2'
        >
          <Trash2 className='size-4' />
          Delete Account
        </Button>
      </div>

      {/* Warning Box */}
      <div className='flex items-start gap-3'>
        <Info className='mt-0.5 size-5 flex-shrink-0 text-amber-400' />
        <div className='space-y-1'>
          <p className='text-sm font-medium text-amber-300'>Before you delete your account</p>
          <ul className='text-Grey-400 space-y-1 text-xs'>
            <li>• All your library data will be permanently lost</li>
            <li>• Your watchlists and preferences will be deleted</li>
            <li>• Your profile and settings will be removed</li>
            <li>• This action cannot be reversed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
