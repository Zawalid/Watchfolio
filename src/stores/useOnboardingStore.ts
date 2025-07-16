import { create } from 'zustand';
import { persistAndSync } from '@/utils/persistAndSync';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';

interface OnboardingPreferences {
  selectedGenres: string[];
  selectedContentPreferences: string[];
  selectedNetworks: number[];
  favoriteContentType: 'movies' | 'tv' | 'both';
}

interface OnboardingStore {
  // State
  isFirstTime: boolean;
  hasSeenOnboarding: boolean;
  showModal: boolean;
  currentStep: number;
  totalSteps: number;
  preferences: OnboardingPreferences;

  // Actions
  setFirstTime: (value: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  updatePreferences: (preferences: Partial<OnboardingPreferences>) => void;
  clearPreferences: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persistAndSync(
    (set, get) => ({
      // Initial state
      isFirstTime: true,
      hasSeenOnboarding: false,
      showModal: false,
      currentStep: 0,
      totalSteps: 4,
      preferences: {
        selectedGenres: [],
        selectedContentPreferences: ['hollywood'], // Default to Hollywood
        selectedNetworks: [],
        favoriteContentType: 'both',
      },

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

      completeOnboarding: () =>
        set({
          hasSeenOnboarding: true,
          isFirstTime: false,
          showModal: false,
          currentStep: 0,
        }),

      resetOnboarding: () =>
        set({
          isFirstTime: true,
          hasSeenOnboarding: false,
          showModal: false,
          currentStep: 0,
          preferences: {
            selectedGenres: [],
            selectedContentPreferences: ['hollywood'],
            selectedNetworks: [],
            favoriteContentType: 'both',
          },
        }),

      updatePreferences: (newPreferences: Partial<OnboardingPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },

      clearPreferences: () => {
        set({
          preferences: {
            selectedGenres: [],
            selectedContentPreferences: ['hollywood'],
            selectedNetworks: [],
            favoriteContentType: 'both',
          },
        });
      },
    }),
    {
      name: `${LOCAL_STORAGE_PREFIX}onboarding`,
      include: ['isFirstTime', 'hasSeenOnboarding', 'currentStep', 'preferences'],
      storage: 'cookie',
    }
  )
);
