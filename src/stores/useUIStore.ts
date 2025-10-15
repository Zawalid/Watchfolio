import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export interface MediaStatusModalData {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
}

// ============================================================================
// State
// ============================================================================

interface UIState {
  // Simple modals (no data needed)
  filters: boolean;
  importExport: boolean;
  shortcuts: boolean;
  about: boolean;
  onboarding: boolean;
  quickAdd: boolean;

  // Complex modals (with data)
  mediaStatus: {
    isOpen: boolean;
    data: MediaStatusModalData | null;
  };

  confirmation: {
    isOpen: boolean;
    options: ConfirmationOptions | null;
    resolve: ((value: boolean) => void) | null;
  };

  // UI Elements
  sidebar: boolean;
  commandPalette: boolean;
  searchFocused: boolean;
}

// ============================================================================
// Actions
// ============================================================================

interface UIActions {
  // Simple modals
  openFilters: () => void;
  closeFilters: () => void;
  toggleFilters: () => void;

  openImportExport: () => void;
  closeImportExport: () => void;
  toggleImportExport: () => void;

  openShortcuts: () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;

  openAbout: () => void;
  closeAbout: () => void;
  toggleAbout: () => void;

  openOnboarding: () => void;
  closeOnboarding: () => void;

  openQuickAdd: () => void;
  closeQuickAdd: () => void;

  // Complex modals
  openMediaStatus: (data: MediaStatusModalData) => void;
  closeMediaStatus: () => void;

  confirm: (options: ConfirmationOptions) => Promise<boolean>;
  resolveConfirmation: (value: boolean) => void;

  // Global
  closeAllModals: () => void;

  // UI Elements
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  focusSearch: () => void;
  blurSearch: () => void;
}

// ============================================================================
// Store
// ============================================================================

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // State
  filters: false,
  importExport: false,
  shortcuts: false,
  about: false,
  onboarding: false,
  quickAdd: false,

  mediaStatus: {
    isOpen: false,
    data: null,
  },

  confirmation: {
    isOpen: false,
    options: null,
    resolve: null,
  },

  sidebar: true,
  commandPalette: false,
  searchFocused: false,

  // Simple modal actions
  openFilters: () => set({ filters: true }),
  closeFilters: () => set({ filters: false }),
  toggleFilters: () => set((state) => ({ filters: !state.filters })),

  openImportExport: () => set({ importExport: true }),
  closeImportExport: () => set({ importExport: false }),
  toggleImportExport: () => set((state) => ({ importExport: !state.importExport })),

  openShortcuts: () => set({ shortcuts: true }),
  closeShortcuts: () => set({ shortcuts: false }),
  toggleShortcuts: () => set((state) => ({ shortcuts: !state.shortcuts })),

  openAbout: () => set({ about: true }),
  closeAbout: () => set({ about: false }),
  toggleAbout: () => set((state) => ({ about: !state.about })),

  openOnboarding: () => set({ onboarding: true }),
  closeOnboarding: () => set({ onboarding: false }),

  openQuickAdd: () => set({ quickAdd: true }),
  closeQuickAdd: () => set({ quickAdd: false }),

  // Complex modal actions
  openMediaStatus: (data) =>
    set({
      mediaStatus: { isOpen: true, data },
    }),

  closeMediaStatus: () =>
    set({
      mediaStatus: { isOpen: false, data: null },
    }),

  confirm: (options) =>
    new Promise<boolean>((resolve) => {
      set({
        confirmation: {
          isOpen: true,
          options,
          resolve,
        },
      });
    }),

  resolveConfirmation: (value) => {
    const { resolve } = get().confirmation;
    if (resolve) resolve(value);
    set({
      confirmation: {
        isOpen: false,
        options: null,
        resolve: null,
      },
    });
  },

  // Global
  closeAllModals: () =>
    set({
      filters: false,
      importExport: false,
      shortcuts: false,
      about: false,
      onboarding: false,
      quickAdd: false,
      mediaStatus: { isOpen: false, data: null },
      confirmation: { isOpen: false, options: null, resolve: null },
    }),

  // UI Elements
  openSidebar: () => set({ sidebar: true }),
  closeSidebar: () => set({ sidebar: false }),
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),

  openCommandPalette: () => set({ commandPalette: true }),
  closeCommandPalette: () => set({ commandPalette: false }),
  toggleCommandPalette: () => set((state) => ({ commandPalette: !state.commandPalette })),

  focusSearch: () => set({ searchFocused: true }),
  blurSearch: () => set({ searchFocused: false }),
}));
