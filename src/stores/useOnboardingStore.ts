import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingStore {
  // State
  isFirstTime: boolean;
  hasSeenOnboarding: boolean;
  showModal: boolean;
  currentStep: number;
  totalSteps: number;
  
  // Actions
  setFirstTime: (value: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isFirstTime: true,
      hasSeenOnboarding: false,
      showModal: false,
      currentStep: 0,
      totalSteps: 4,

      // Actions
      setFirstTime: (value: boolean) => set({ isFirstTime: value }),

      openModal: () => set({ showModal: true, currentStep: 0 }),

      closeModal: () => set({ showModal: false }),

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps - 1) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (step: number) => {
        const { totalSteps } = get();
        if (step >= 0 && step < totalSteps) {
          set({ currentStep: step });
        }
      },

      completeOnboarding: () => set({ 
        hasSeenOnboarding: true, 
        isFirstTime: false, 
        showModal: false,
        currentStep: 0 
      }),

      resetOnboarding: () => set({ 
        isFirstTime: true, 
        hasSeenOnboarding: false, 
        showModal: false,
        currentStep: 0 
      }),
    }),
    {
      name: 'watchfolio-onboarding',
      partialize: (state) => ({
        isFirstTime: state.isFirstTime,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
