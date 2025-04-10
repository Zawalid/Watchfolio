'use client';

import { HeroUIProvider } from '@heroui/system';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <HeroUIProvider className='grid flex-1'>{children}</HeroUIProvider>
  );
}
