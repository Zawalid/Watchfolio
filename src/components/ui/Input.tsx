import { cn } from '@/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { JSX } from 'react';
import { forwardRef } from 'react';
import { NAME_ICON, EMAIL_ICON, PASSWORD_ICON, LINK_ICON, SEARCH_ICON, TITLE_ICON } from './Icons';

type IconType = 'name' | 'email' | 'search' | 'password' | 'title' | 'link';

// eslint-disable-next-line react-refresh/only-export-components
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

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ children, type, icon, label, parentClassname, error, ...props }, ref) {
  const { placeholder } = props;
  const [parent] = useAutoAnimate();

  return (
    <div className={cn('flex flex-col gap-2', parentClassname)} ref={parent}>
      <div className='relative rounded-xl'>
        <span className='text-Grey-600 absolute top-1/2 left-4 z-10 -translate-y-1/2'>
          {icons[type as IconType] || (icon && icons[icon])}
        </span>
        <input
          ref={ref}
          type={type || 'text'}
          placeholder={type === 'email' ? 'eg. hello@example.com' : placeholder}
          {...props}
          className={cn(
            'peer text-Grey-100 focus:placeholder:text-Grey-600 relative z-10 w-full rounded-xl border-2 bg-white/5 pt-4.5 pr-4 pb-1.5 pl-14 text-sm outline-hidden transition-colors duration-200 placeholder:text-sm placeholder:text-transparent read-only:bg-transparent focus:bg-transparent',
            error
              ? 'border-Error-500 focus:border-Error-500'
              : 'focus:border-Primary-500 read-only:focus:border-Primary-300 border-white/5',
            props.className
          )}
        />
        <label className='text-Grey-600 peer-focus:text-Grey-400 peer-not-placeholder-shown:text-Grey-400 absolute top-1/2 left-14 z-0 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-not-placeholder-shown:z-10 peer-not-placeholder-shown:-translate-y-5 peer-not-placeholder-shown:text-xs peer-focus:z-10 peer-focus:-translate-y-5 peer-focus:text-xs focus:text-white'>
          {label}
        </label>

        {children}
      </div>
      {error && <span className='text-Error-500 text-sm'>{error}</span>}
    </div>
  );
});

