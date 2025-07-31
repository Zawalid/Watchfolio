import { Models } from 'appwrite';

declare global {
  type Theme = 'light' | 'dark' | 'system';
  type ConfirmationSetting = 'enabled' | 'disabled';
  type MediaType = 'movie' | 'tv';
  type WatchStatus = 'watching' | 'willWatch' | 'completed' | 'onHold' | 'dropped' | 'none';
  type FavoriteContentType = 'movies' | 'tv' | 'both';
  type ConfirmationPreferences = 'signOutConfirmation' | 'removeFromLibraryConfirmation' | 'clearLibraryConfirmation';
  type ConfirmationKeys = 'sign-out' | 'remove-from-library' | 'clear-library' | 'delete-account';
  type ActivityAction = 'completed' | 'rated' | 'added';
  type Activity = {
    action: ActivityAction;
    mediaType: 'movie' | 'tv';
    mediaId: number;
    mediaTitle: string;
    posterPath?: string | null;
    rating?: number;
    timestamp: string;
  };

  interface Document {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
  }
  interface Profile extends Document {
    userId: string;
    name: string;
    email: string;
    visibility: 'public' | 'private';
    bio?: string;
    avatarUrl: string;
    username: string;
    preferences: UserPreferences;
    library: Library;
    favoriteContentType: FavoriteContentType;
    favoriteGenres: number[];
    contentPreferences: string[];
    favoriteNetworks: number[];
    recentActivity: Activity[];
    hiddenProfileSections: string[];
  }
  interface UserPreferences extends Document {
    signOutConfirmation: ConfirmationSetting;
    removeFromLibraryConfirmation: ConfirmationSetting;
    clearLibraryConfirmation: ConfirmationSetting;
    theme: Theme;
    language: string;
    enableAnimations: ConfirmationSetting;
    defaultMediaStatus: WatchStatus;
    autoSync: boolean;
  }
  interface Library extends Document {
    averageRating?: number;
    items?: LibraryItem[];
  }

  interface LibraryItem extends Document {
    status: WatchStatus;
    isFavorite: boolean;
    userRating?: number;
    notes?: string;
    addedAt?: string;
    library?: Library;
    media?: TmdbMedia;
  }

  interface TmdbMedia extends Document {
    id: number;
    mediaType: MediaType;
    title: string;
    overview?: string;
    posterPath?: string;
    releaseDate?: string;
    genres?: string[];
    rating?: number;
    totalMinutesRuntime?: number;
  }

  type CreateProfileInput = {
    userId: string;
    name: string;
    email: string;
    avatarUrl?: string;
    username?: string;
  };
  type CreateUserPreferencesInput = Omit<UserPreferences, keyof Document>;
  type CreateLibraryInput = Omit<Library, keyof Document | 'items'>;
  type CreateLibraryItemInput = Omit<LibraryItem, keyof Document | 'library' | 'media'> & {
    libraryId: string;
    mediaId: string;
  };
  type CreateTmdbMediaInput = Omit<TmdbMedia, keyof Document> & { title: string }; // TO stop the type error in sync-service

  type UpdateProfileInput = Partial<
    CreateProfileInput & {
      bio: string;
      favoriteContentType: FavoriteContentType;
      favoriteGenres: number[];
      contentPreferences: string[];
      favoriteNetworks: number[];
      recentActivity: string[];
    }
  >;
  type UpdateUserPreferencesInput = Partial<CreateUserPreferencesInput>;
  type UpdateLibraryInput = Partial<CreateLibraryInput>;
  type UpdateLibraryItemInput = Partial<Omit<CreateLibraryItemInput, 'libraryId' | 'mediaId'>>;
  type UpdateTmdbMediaInput = Partial<CreateTmdbMediaInput>;

  // User location data from Appwrite Locale API
  interface UserLocation {
    country: string;
    countryCode: string;
    continent: string;
    continentCode: string;
  }
  // Combined user type that merges auth, profile, preferences, and location
  interface UserWithProfile extends Models.User<Models.Preferences> {
    profile: Profile;
    location: UserLocation;
  }

  interface ProfileWithRelations extends Profile {
    preferences?: UserPreferences;
    library?: LibraryWithItems;
  }

  interface LibraryWithItems extends Library {
    items?: LibraryItemWithMedia[];
    user?: Profile;
  }

  interface LibraryItemWithMedia extends LibraryItem {
    library?: Library;
    media?: TmdbMedia;
  }

  interface DocumentList<T> {
    total: number;
    documents: T[];
  }

  type ProfileDocumentList = DocumentList<Profile>;
  type LibraryItemDocumentList = DocumentList<LibraryItem>;
  type TmdbMediaDocumentList = DocumentList<TmdbMedia>;
}
