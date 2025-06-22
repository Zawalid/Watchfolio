import { FC } from 'react';
import { getShortcut, ShortcutName } from '@/utils/keyboardShortcuts';
import { cn } from '@/utils';

export const ShortcutKey: FC<{ shortcutName: ShortcutName; className?: string }> = ({ shortcutName, className }) => {
  const shortcut = getShortcut(shortcutName);
  const keys = shortcut.label?.split(' ');

  return (
    <span className='inline-flex items-center gap-1'>
      {keys?.map((key, index) => (
        <kbd key={index} className={cn('kbd', className)}>
          {key}
        </kbd>
      ))}
    </span>
  );
};

export const ShortcutTooltip: FC<{ shortcutName: ShortcutName; description?: string; className?: string }> = ({
  shortcutName,
  description,
  className,
}) => {
  const shortcut = getShortcut(shortcutName);

  return (
    <div className='flex items-center gap-2'>
      <div>{description || shortcut.description}</div>
      <div className='flex items-center gap-1'>
        {shortcut.label?.split(' ').map((key, index) => (
          <kbd key={index} className={cn('kbd-sm!', className)}>
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
};
