import { cn } from '@/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { JSX } from 'react';
import { NAME_ICON, EMAIL_ICON, PASSWORD_ICON, LINK_ICON, SEARCH_ICON, TITLE_ICON } from './Icons';

type IconType = 'name' | 'email' | 'search' | 'password' | 'title' | 'link';

export const icons: Record<IconType, JSX.Element> = {
  name: NAME_ICON,
  email: EMAIL_ICON,
  password: PASSWORD_ICON,
  link: LINK_ICON,
  search: SEARCH_ICON,
  title: TITLE_ICON,
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  type?: IconType | 'text';
  icon?: IconType;
  label?: string;
  parentClassname?: string;
  error?: string;
}

export default function Input({ children, type, icon, label, ...props }: InputProps) {
  const { parentClassname, placeholder, error } = props;
  const [parent] = useAutoAnimate();

  return (
    <div className={cn('flex flex-col gap-2', parentClassname)} ref={parent}>
      <div className='relative rounded-xl'>
        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-Grey/600'>
          {icons[type as IconType] || (icon && icons[icon])}
        </span>
        <input
          type={type || 'text'}
          placeholder={type === 'email' ? 'eg. hello@example.com' : placeholder}
          {...props}
          className={cn(
            'peer relative z-10 w-full rounded-xl border-2 bg-Black/10 pb-3 pl-14 pr-4 pt-7 text-sm text-Grey/100 outline-none placeholder:text-sm placeholder:text-transparent read-only:bg-transparent focus:placeholder:text-Grey/600',
            error
              ? 'border-Error/500 focus:border-Error/500'
              : 'border-Grey/800 focus:border-Primary/500 read-only:focus:border-Primary/300',
            props.className
          )}
        />
        <label className='absolute left-14 top-1/2 z-0 -translate-y-1/2 cursor-text text-sm text-Grey/600 transition-all duration-300 focus:text-white peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:text-Grey/400 peer-[&:not(:placeholder-shown)]:z-10 peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:text-Grey/400'>
          {label}
        </label>

        {children}
      </div>
      {error && <span className='text-sm text-Error/500'>{error}</span>}
    </div>
  );
}
