import type { Metadata } from 'next';
import { Chewy } from 'next/font/google';
import Navbar from '@/components/Navbar';
import '../styles/globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

const chewy = Chewy({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Watchfolio',
  description: '',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className='bg-Grey/900'>
      <body
        className={`${chewy.className} blur-bg flex h-full min-h-dvh flex-col bg-[url('/images/Background.svg')] antialiased dark`}
      >
        <Navbar />
        <Providers>
          <main className='container overflow-hidden py-4'>{children}</main>
        </Providers>
        <Toaster theme='dark' />
      </body>
    </html>
  );
}
