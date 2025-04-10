import { cn } from '@/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
  label?: string;
  parentclassname?: string;
  error?: string;
}

export default function Textarea({ children, label, ...props }: InputProps) {
  const { parentclassname, error } = props;
  const [parent] = useAutoAnimate();

  return (
    <div className={cn('flex flex-col gap-2', parentclassname)} ref={parent}>
      <div className='relative rounded-xl'>
        <textarea
          {...props}
          className={cn(
            'peer relative z-10 overflow-hidden w-full rounded-xl border-2 bg-Black/10 px-4 pb-3 pt-7 text-sm text-Grey/100 outline-none placeholder:text-sm placeholder:text-transparent read-only:bg-transparent focus:placeholder:text-Grey/600',
            error
              ? 'border-Error/500 focus:border-Error/500'
              : 'border-Grey/800 focus:border-Primary/500 read-only:focus:border-Primary/300',
            props.className
          )}
        />
        <label className='absolute left-4 top-1/2 z-0 -translate-y-1/2 cursor-text text-sm text-Grey/600 transition-all duration-300 focus:text-white peer-focus:top-1 peer-focus:z-10 peer-focus:translate-y-0 peer-focus:text-Grey/400 peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:z-10 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-Grey/400'>
          {label}
        </label>

        {children}
      </div>
      {error && <span className='text-sm text-Error/500'>{error}</span>}
    </div>
  );
}
