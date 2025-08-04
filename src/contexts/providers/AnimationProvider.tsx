import { createContext, useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { MotionConfig } from 'framer-motion';
import { ConfirmationSetting } from '@/lib/appwrite/types';

interface AnimationContextType {
  animationsEnabled: ConfirmationSetting;
}

const AnimationContext = createContext<AnimationContextType>({ animationsEnabled: 'enabled' });

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const animationsEnabled = useAuthStore((state) => state.userPreferences.enableAnimations);

  if (typeof document !== 'undefined') {
    document.body.dataset.animations = animationsEnabled === 'enabled' ? 'true' : 'false';
  }

  const value = useMemo(() => ({ animationsEnabled }), [animationsEnabled]);

  return (
    <AnimationContext.Provider value={value}>
      <MotionConfig reducedMotion={animationsEnabled === 'enabled' ? 'user' : 'always'}>
        {children}
      </MotionConfig>
    </AnimationContext.Provider>
  );
}
