import { motion } from 'framer-motion';
import { Heart, Trash2, Edit3, Plus } from 'lucide-react';
import { Button, Tooltip } from '@heroui/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/utils';
import { ShortcutKey, ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { getShortcut, ShortcutName } from '@/utils/keyboardShortcuts';
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/Drawer';
import { useMediaStatusModal } from '@/contexts/MediaStatusModalContext';
import { useConfirmationModal } from '@/contexts/ConfirmationModalContext';
import { useAddOrUpdateLibraryItem, useRemoveLibraryItem } from '@/hooks/library/useLibraryMutations';
import { generateMediaId } from '@/utils/library';

interface QuickActionsProps {
  mediaType: MediaType;
  item?: LibraryMedia;
  media?: Media;
  isFocused: boolean;
}

interface MobileActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: MediaType;
  item?: LibraryMedia;
  media?: Media;
  title: string;
}

// Shared action logic hook
function useMediaActions(mediaType: MediaType, item?: LibraryMedia, media?: Media) {
  const { openModal } = useMediaStatusModal();
  const { confirm } = useConfirmationModal();

  const id = generateMediaId(item || (media && { ...media, media_type: mediaType }));
  const { mutate: addOrUpdateItem } = useAddOrUpdateLibraryItem();
  const { mutate: removeItem } = useRemoveLibraryItem();

  const inLibrary = item && (item.status !== 'none' || item.userRating);

  const handleEditStatus = () => {
    const target = media || item;
    if (!target) return;

    // Just call openModal - it handles the smart logic internally
    openModal({ ...target, media_type: mediaType }, item);
  };

  const handleToggleFavorite = () => {
    addOrUpdateItem({
      item: { id, isFavorite: !item?.isFavorite, media_type: mediaType },
      media: media ? { ...media, media_type: mediaType } : undefined,
    });

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleRemove = async () => {
    if (item) {
      const confirmed = await confirm({
        title: 'Remove from Library',
        message: `Are you sure you want to remove "${item.title}" from your library?`,
        confirmText: 'Remove',
        confirmVariant: 'danger',
        confirmationKey: 'remove-from-library',
      });
      if (confirmed) removeItem(item);
    }
  };

  return {
    inLibrary,
    handleEditStatus,
    handleToggleFavorite,
    handleRemove,
  };
}

export function QuickActions({ mediaType, item, media, isFocused }: QuickActionsProps) {
  const { inLibrary, handleEditStatus, handleToggleFavorite, handleRemove } = useMediaActions(mediaType, item, media);

  useHotkeys(getShortcut(inLibrary ? 'editStatus' : 'addToLibrary')?.hotkey || '', handleEditStatus, {
    enabled: isFocused,
  });
  useHotkeys(getShortcut('toggleFavorite')?.hotkey || '', handleToggleFavorite, { enabled: isFocused });
  useHotkeys(getShortcut('removeFromLibrary')?.hotkey || '', handleRemove, { enabled: isFocused });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ duration: 0.3, staggerChildren: 0.05 }}
      className='absolute top-3 right-3 z-30 flex gap-1.5'
    >
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Tooltip content={<ShortcutTooltip shortcutName='toggleFavorite' />} className='tooltip-secondary!'>
          <Button
            isIconOnly
            size='sm'
            tabIndex={-1}
            className={cn(
              'h-8 w-8 border backdrop-blur-xl transition-all',
              item?.isFavorite
                ? 'border-Error-400/60 bg-Error-500/30 text-Error-200'
                : 'hover:border-Error-400/60 hover:bg-Error-500/30 hover:text-Error-200 border-white/30 bg-white/15 text-white'
            )}
            onPress={handleToggleFavorite}
            aria-label={item?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('size-3.5', item?.isFavorite && 'fill-current')} />
          </Button>
        </Tooltip>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <Tooltip
          content={<ShortcutTooltip shortcutName={inLibrary ? 'editStatus' : 'addToLibrary'} />}
          className='tooltip-secondary!'
        >
          <Button
            isIconOnly
            size='sm'
            tabIndex={-1}
            className='hover:border-Secondary-400/60 hover:bg-Secondary-500/30 hover:text-Secondary-200 h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all'
            onPress={handleEditStatus}
            aria-label={inLibrary ? 'Edit library status' : 'Add to library'}
          >
            {inLibrary ? <Edit3 className='size-3.5' /> : <Plus className='size-3.5' />}
          </Button>
        </Tooltip>
      </motion.div>

      {inLibrary && (
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Tooltip content={<ShortcutTooltip shortcutName='removeFromLibrary' />} className='tooltip-secondary!'>
            <Button
              isIconOnly
              size='sm'
              tabIndex={-1}
              className='hover:border-Error-400/60 hover:bg-Error-500/30 hover:text-Error-200 h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all'
              onPress={handleRemove}
              aria-label='Remove from library'
            >
              <Trash2 className='size-3.5' />
            </Button>
          </Tooltip>
        </motion.div>
      )}
    </motion.div>
  );
}

interface MobileActionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: MediaType;
  item?: LibraryMedia;
  media?: Media;
  title: string;
}

export function MobileActionsDrawer({ isOpen, onClose, mediaType, item, media, title }: MobileActionsDrawerProps) {
  const { inLibrary, handleEditStatus, handleToggleFavorite, handleRemove } = useMediaActions(mediaType, item, media);

  const handleActionWithClose = (action: () => void) => () => {
    action();
    onClose();
  };

  const actions = [
    {
      icon: Heart,
      label: item?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      description: item?.isFavorite ? 'Remove from your favorites list' : 'Save to your favorites',
      action: handleActionWithClose(handleToggleFavorite),
      active: item?.isFavorite,
      shortcut: 'toggleFavorite',
    },
    {
      icon: inLibrary ? Edit3 : Plus,
      label: inLibrary ? 'Edit Status' : 'Add to Library',
      description: inLibrary ? 'Update your progress, status, or rating.' : 'Track your progress or add a rating',
      action: handleActionWithClose(handleEditStatus),
      active: inLibrary,
      shortcut: inLibrary ? 'editStatus' : 'addToLibrary',
    },
    ...(inLibrary
      ? [
          {
            icon: Trash2,
            label: 'Remove from Library',
            description: 'Remove this item from your library.',
            action: handleActionWithClose(handleRemove),
            active: false,
            shortcut: 'removeFromLibrary',
          },
        ]
      : []),
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader >
            <h3 className='text-lg text-center mobile:text-xl font-bold text-white'>{title}</h3>
        </DrawerHeader>

        <DrawerBody>
          <div className='grid grid-cols-1 gap-3'>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  className={cn(
                    'group relative h-auto w-full justify-start gap-4 px-4 py-3 text-left transition-all',
                    'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:border-gray-600/70 hover:bg-gray-700/60 hover:text-white'
                  )}
                  onPress={action.action}
                >
                  <div className='rounded-xl bg-gray-700/50 p-2.5 group-hover:bg-gray-600/60'>
                    <Icon
                      className={cn(
                        'size-5 text-white transition-colors duration-300',
                        action.icon === Heart && action.active && 'fill-current text-pink-400'
                      )}
                    />{' '}
                  </div>
                  <div className='flex-1'>
                    <div className='font-semibold text-gray-200'>{action.label}</div>
                    <div className='mt-1 text-sm text-gray-400'>{action.description}</div>
                  </div>

                  <ShortcutKey shortcutName={action.shortcut as ShortcutName} />
                </Button>
              );
            })}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
