import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ModalBody } from '@heroui/react';
import { Globe, Heart, User } from 'lucide-react';
import Details from '../settings/Details';
import ProfileVisibility from '../settings/ProfileVisibility';
import { SettingSection } from '../settings/SettingSection';
import ViewingTaste from '../settings/ViewingTaste';
import { Modal } from '../ui/Modal';

export default function CustomizeProfileModal({ disclosure }: { disclosure: Disclosure }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
    disclosure.onClose();
  };

  return (
    <Modal disclosure={disclosure} size='5xl' classNames={{ base: 'full-mobile-modal' }}>
      <ModalBody className='space-y-8 md:p-8'>
        <SettingSection Icon={User} title='Profile Information'>
          <Details
            onSuccess={(data) => {
              if (data.username) navigate(`/u/${data.username}`);
              else onSuccess();
            }}
          />
        </SettingSection>
        <SettingSection Icon={Heart} title='Viewing Taste'>
          <ViewingTaste onSuccess={onSuccess} />
        </SettingSection>
        <SettingSection Icon={Globe} title='Profile Visibility'>
          <ProfileVisibility onSuccess={onSuccess} />
        </SettingSection>
      </ModalBody>
    </Modal>
  );
}
