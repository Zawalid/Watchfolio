import Image from 'next/image';
import signInImage from '@/images/signin.svg';
import AuthPrompt from '@/app/(auth-flow)/components/AuthPrompt';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid h-full items-center gap-5 md:grid-cols-2'>
      <div className='relative hidden h-full md:block'>
        <Image src={signInImage} alt='image' fill />
      </div>
      <div className='flex flex-col gap-2'>
        <AuthPrompt />
        {children}
      </div>
    </div>
  );
}
