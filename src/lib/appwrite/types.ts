import { Models } from 'appwrite';
import { HIDDEN_PROFILE_SECTIONS } from '@/utils/constants';

// Meta fields for Appwrite documents
export const META_FIELDS = ['$createdAt', '$permissions', '$collectionId', '$databaseId', '$sequence'] as const;

// --- Enums & Type Aliases ---

export type ConfirmationSetting = 'enabled' | 'disabled';
export type ActivityAction = 'completed' | 'rated' | 'added';
export type HiddenSection = (typeof HIDDEN_PROFILE_SECTIONS)[number];
export type AccountPrefs = {
  hasSeenOnboarding: 'TRUE' | 'FALSE';
};

// --- Core Document Types ---

export interface Document {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $sequence: number;
  $permissions: string[];
}

// --- Profile & Preferences ---

export interface Profile extends Document {
  userId: string;
  name: string;
  email: string;
  visibility: 'public' | 'private';
  bio?: string;
  avatarUrl: string;
  username: string;
  preferences: UserPreferences;
  library: string;
  favoriteContentType: FavoriteContentType;
  favoriteGenres: number[];
  contentPreferences: string[];
  favoriteNetworks: number[];
  recentActivity: Activity[];
  hiddenProfileSections: HiddenSection[];
}

export interface UserPreferences extends Document {
  signOutConfirmation: ConfirmationSetting;
  removeFromLibraryConfirmation: ConfirmationSetting;
  clearLibraryConfirmation: ConfirmationSetting;
  theme: Theme;
  language: string;
  enableAnimations: ConfirmationSetting;
  defaultMediaStatus: WatchStatus;
  autoSync: boolean;
}

// --- Library & Media ---

export interface Library extends Document {
  averageRating?: number;
  items?: LibraryMedia[]; // LibraryMedia type assumed to be defined elsewhere
}

export interface AppwriteLibraryMedia extends Document {
  // Library item fields
  id?: string;
  status: WatchStatus;
  isFavorite: boolean;
  userRating?: number;
  notes?: string;
  addedAt: string;
  lastUpdatedAt: string;

  // TMDB media fields (flattened)
  tmdbId: number;
  media_type: MediaType;
  title: string;
  overview?: string | null;
  posterPath?: string | null;
  releaseDate?: string | null;
  genres?: string[] | null;
  rating?: number | null;
  totalMinutesRuntime?: number | null;
  networks?: number[] | null;

  // References
  library?: Library;
  deleted?: boolean;
}

// --- Activity ---

export type Activity = {
  action: ActivityAction;
  mediaType: MediaType;
  mediaId: number;
  mediaTitle: string;
  posterPath?: string | null;
  rating?: number;
  timestamp: string;
};

// --- Input Types ---

export type CreateProfileInput = {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  username: string;
};

export type CreateUserPreferencesInput = Omit<UserPreferences, keyof Document>;
export type CreateLibraryInput = Omit<Library, keyof Document | 'items'>;
export type CreateAppwriteLibraryMediaInput = Omit<AppwriteLibraryMedia, keyof Document | 'library'> & {
  libraryId: string;
};

export type UpdateProfileInput = Partial<
  CreateProfileInput & {
    bio: string;
    favoriteContentType: FavoriteContentType;
    favoriteGenres: number[];
    contentPreferences: string[];
    favoriteNetworks: number[];
    recentActivity: Activity[];
  }
>;
export type UpdateUserPreferencesInput = Partial<CreateUserPreferencesInput>;
export type UpdateLibraryInput = Partial<CreateLibraryInput>;
export type UpdateAppwriteLibraryMediaInput = Partial<Omit<CreateAppwriteLibraryMediaInput, 'libraryId'>>;

// --- User Location & Combined Types ---

export interface UserLocation {
  country: string;
  countryCode: string;
  continent: string;
  continentCode: string;
}

export interface ProfileWithLibrary extends Omit<Profile, 'library'> {
  library: Library;
}

export interface UserWithProfile extends Models.User<Models.Preferences> {
  profile: Profile;
  location: UserLocation;
}
