import { cn } from '@/utils';

export default function Switch({ className, disabled, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className='relative inline-flex items-center'>
      <input type='checkbox' className='peer sr-only' {...props} />
      <div
        className={cn(
          "peer h-5 w-9 rounded-full bg-black/20 backdrop-blur-2xl after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:duration-300 after:content-[''] peer-checked:bg-Primary-500 peer-checked:after:translate-x-full peer-focus:outline-hidden peer-checked:rtl:after:-translate-x-full",
          disabled ? 'after:opacity-50' : 'cursor-pointer',
          className
        )}
      ></div>
    </label>
  );
}
