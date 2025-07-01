import { useEffect, useRef, useCallback } from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

interface UseOnboardingOptions {
  delay?: number;
  scrollThreshold?: number;
  enabled?: boolean;
}

export function useOnboarding(options: UseOnboardingOptions = {}) {
  const {
    delay = 3000, // 3 seconds
    scrollThreshold = 200, // 200px scroll
    enabled = true,
  } = options;

  const {
    isFirstTime,
    hasSeenOnboarding,
    showModal,
    openModal,
    closeModal,
  } = useOnboardingStore();

  const timeoutRef = useRef<NodeJS.Timeout>();
  const hasTriggeredRef = useRef(false);

  // Function to trigger onboarding
  const triggerOnboarding = useCallback(() => {
    if (!hasTriggeredRef.current && isFirstTime && !hasSeenOnboarding && enabled) {
      hasTriggeredRef.current = true;
      openModal();
    }
  }, [isFirstTime, hasSeenOnboarding, enabled, openModal]);

  // Function to manually open onboarding (for "How to use" button)
  const openOnboardingManually = () => {
    openModal();
  };

  useEffect(() => {
    if (!enabled || !isFirstTime || hasSeenOnboarding || hasTriggeredRef.current) {
      return;
    }

    // Trigger after delay
    timeoutRef.current = setTimeout(() => {
      triggerOnboarding();
    }, delay);

    // Trigger on scroll
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        triggerOnboarding();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delay, scrollThreshold, enabled, isFirstTime, hasSeenOnboarding, triggerOnboarding]);

  return {
    // State
    isFirstTime,
    hasSeenOnboarding,
    showModal,
    
    // Actions
    openOnboarding: openOnboardingManually,
    closeOnboarding: closeModal,
    
    // Utils
    shouldShowOnboarding: isFirstTime && !hasSeenOnboarding,
  };
}
