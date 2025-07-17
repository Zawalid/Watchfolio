import { createContext, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';

// Define the shape of our context
interface AnimationContextType {
  animationsEnabled: ConfirmationSetting;
}

const AnimationContext = createContext<AnimationContextType>({ animationsEnabled: 'enabled' });

// A custom hook for easy access to the context value

// The main provider component
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const animationsEnabled = useAuthStore((state) => state.user?.profile.preferences?.enableAnimations || 'enabled');

  if (typeof document !== 'undefined') {
    document.body.dataset.animations = animationsEnabled === 'enabled' ? 'true' : 'false';
  }

  const value = useMemo(() => ({ animationsEnabled }), [animationsEnabled]);

  return (
    <AnimationContext.Provider value={value}>
      <MotionConfig reducedMotion={animationsEnabled === 'enabled' ? 'user' : 'always'}>{children}</MotionConfig>
    </AnimationContext.Provider>
  );
}
