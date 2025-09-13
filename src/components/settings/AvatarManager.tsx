import { useState } from 'react';
import { Avatar } from '@heroui/react';
import { Button } from '@heroui/react';
import { useDisclosure } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { ModalBody, ModalFooter, ModalHeader } from '@heroui/react';
import { Input } from '@/components/ui/Input';
import { addToast } from '@heroui/react';
import {
  AVATAR_STYLES,
  generateRandomAvatar,
  getDefaultAvatarUrl,
  validateAvatarUrl,
  type AvatarStyle,
} from '@/utils/avatar';
import { cn } from '@/utils';
import { Shuffle, Globe, Lock } from 'lucide-react';
import { AVATAR_CLASSNAMES } from '@/styles/heroui';
import { Tooltip } from '@heroui/react';

interface AvatarManagerProps {
  currentAvatarUrl?: string;
  userName: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  className?: string;
  visibility: 'public' | 'private';
}

export default function AvatarManager({
  currentAvatarUrl,
  userName,
  onAvatarChange,
  className,
  visibility,
}: AvatarManagerProps) {
  const disclosure = useDisclosure();
  const [customUrl, setCustomUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>('fun-emoji');

  const currentUrl = currentAvatarUrl || getDefaultAvatarUrl(userName);

  const handleGenerateRandom = () => {
    const newUrl = generateRandomAvatar(selectedStyle);
    setPreviewUrl(newUrl);
  };

  const handleGenerateWithStyle = (style: AvatarStyle) => {
    const newUrl = getDefaultAvatarUrl(userName, style);
    setPreviewUrl(newUrl);
    setSelectedStyle(style);
  };

  const handleCustomUrlChange = (url: string) => {
    setCustomUrl(url);
    if (url && validateAvatarUrl(url)) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSave = () => {
    const urlToSave = previewUrl || currentUrl;

    if (!validateAvatarUrl(urlToSave)) {
      addToast({
        title: 'Invalid URL',
        description: 'Please enter a valid image URL.',
        color: 'danger',
      });
      return;
    }

    onAvatarChange(urlToSave);

    disclosure.onClose();
    setPreviewUrl('');
    setCustomUrl('');
  };

  const handleRemoveAvatar = () => {
    const defaultUrl = getDefaultAvatarUrl(userName);
    onAvatarChange(defaultUrl);
  };

  const close = () => {
    disclosure.onClose();
    setPreviewUrl('');
    setCustomUrl('');
  };

  return (
    <>
      <div className={cn('flex items-center gap-5', className)}>
        <div className='relative'>
          <Avatar src={currentUrl} className='size-24!' classNames={AVATAR_CLASSNAMES} />
          <Tooltip
            content={visibility === 'public' ? 'Public Profile' : 'Private Profile'}
            className='tooltip-secondary!'
          >
            <div
              className={cn(
                'absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-white/10 text-white/80 backdrop-blur-md',
                visibility === 'public' ? 'bg-Success-500/50' : 'bg-Warning-500/50'
              )}
            >
              {visibility === 'public' ? <Globe className='size-3' /> : <Lock className='size-3' />}
            </div>
          </Tooltip>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <Button color='primary' size='sm' onPress={disclosure.onOpen}>
              Change Avatar
            </Button>
            <Button className='button-secondary! text-xs!' size='sm' onPress={handleRemoveAvatar}>
              Reset to Default
            </Button>
          </div>
          <p className='text-Grey-500 text-sm'>Use a custom URL or generate a new avatar.</p>
        </div>
      </div>

      <Modal disclosure={disclosure} className='max-w-2xl' classNames={{ base: 'full-mobile-modal' }}>
        <ModalHeader className='flex flex-col'>
          <h4 className='text-Primary-100 text-lg font-semibold'>Change Avatar</h4>
          <p className='text-Grey-300 text-sm'>Choose a new avatar from our generators or use a custom URL.</p>
        </ModalHeader>

        <ModalBody className='flex flex-col gap-6'>
          {/* Preview */}
          <div className='flex items-center justify-center'>
            <Avatar src={previewUrl || currentUrl} className='!size-28' classNames={AVATAR_CLASSNAMES} showFallback />
          </div>

          {/* Avatar Styles */}
          <div className='space-y-3'>
            <h5 className='text-Grey-200 font-medium'>Generate Avatar</h5>
            <div className='grid grid-cols-4 gap-2'>
              {Object.entries(AVATAR_STYLES).map(([key, label]) => (
                <Button
                  key={key}
                  className='selectable-button!'
                  data-is-selected={selectedStyle === key}
                  size='sm'
                  onPress={() => handleGenerateWithStyle(key as AvatarStyle)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Button size='sm' onPress={handleGenerateRandom} className='button-secondary! w-full'>
              <Shuffle className='size-4' />
              Generate Random
            </Button>
          </div>

          {/* Custom URL */}
          <div className='space-y-3'>
            <h5 className='text-Grey-200 font-medium'>Custom URL</h5>
            <Input
              label='Image URL'
              placeholder='https://example.com/avatar.png'
              icon='link'
              value={customUrl}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
              error={customUrl && !validateAvatarUrl(customUrl) ? 'Please enter a valid image URL' : undefined}
            />
            <p className='text-Grey-400 text-xs'>
              Supported: Direct image URLs, DiceBear, Gravatar, GitHub, etc.
              <br />
              Ensure the URL points directly to an image file (e.g., .png, .svg).
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button className='bg-Grey-800 hover:bg-Grey-700' onPress={close}>
            Cancel
          </Button>
          <Button color='primary' onPress={handleSave} isDisabled={!previewUrl && !currentUrl}>
            Save Avatar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
