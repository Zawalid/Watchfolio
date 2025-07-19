import { createContext, useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { MotionConfig } from 'framer-motion';

interface AnimationContextType {
  animationsEnabled: ConfirmationSetting;
}

const AnimationContext = createContext<AnimationContextType>({ animationsEnabled: 'enabled' });

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const animationsEnabled = useAuthStore((state) => state.user?.profile.preferences?.enableAnimations || 'enabled');

  if (typeof document !== 'undefined') {
    document.body.dataset.animations = animationsEnabled === 'enabled' ? 'true' : 'false';
  }

  const value = useMemo(() => ({ animationsEnabled }), [animationsEnabled]);

  return (
    <AnimationContext.Provider value={value}>
      <MotionConfig reducedMotion={'always'}>{children}</MotionConfig>
    </AnimationContext.Provider>
  );
}
