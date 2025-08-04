import { Models } from 'appwrite';

export type ConfirmationSetting = 'enabled' | 'disabled';
export type ActivityAction = 'completed' | 'rated' | 'added';

export type Activity = {
    action: ActivityAction;
    mediaType: MediaType;
    mediaId: number;
    mediaTitle: string;
    posterPath?: string | null;
    rating?: number;
    timestamp: string;
};

export interface Document {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
}
export interface Profile extends Document {
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
export interface Library extends Document {
    averageRating?: number;
    items?: LibraryItem[];
}

export interface LibraryItem extends Document {
    status: WatchStatus;
    isFavorite: boolean;
    userRating?: number;
    notes?: string;
    addedAt?: string;
    library?: Library;
    media?: TmdbMedia;
}

export interface TmdbMedia extends Document {
    id: number;
    mediaType: MediaType;
    title: string;
    overview?: string;
    posterPath?: string;
    releaseDate?: string;
    genres?: string[];
    rating?: number;
    totalMinutesRuntime?: number;
    networks?: number[];
}

export type CreateProfileInput = {
    userId: string;
    name: string;
    email: string;
    avatarUrl?: string;
    username?: string;
};
export type CreateUserPreferencesInput = Omit<UserPreferences, keyof Document>;
export type CreateLibraryInput = Omit<Library, keyof Document | 'items'>;
export type CreateLibraryItemInput = Omit<LibraryItem, keyof Document | 'library' | 'media'> & {
    libraryId: string;
    mediaId: string;
};
export type CreateTmdbMediaInput = Omit<TmdbMedia, keyof Document> & { title: string }; // TO stop the type error in sync-service

export type UpdateProfileInput = Partial<
    CreateProfileInput & {
        bio: string;
        favoriteContentType: FavoriteContentType;
        favoriteGenres: number[];
        contentPreferences: string[];
        favoriteNetworks: number[];
        recentActivity: string[];
    }
>;
export type UpdateUserPreferencesInput = Partial<CreateUserPreferencesInput>;
export type UpdateLibraryInput = Partial<CreateLibraryInput>;
export type UpdateLibraryItemInput = Partial<Omit<CreateLibraryItemInput, 'libraryId' | 'mediaId'>>;
export type UpdateTmdbMediaInput = Partial<CreateTmdbMediaInput>;

// User location data from Appwrite Locale API
export interface UserLocation {
    country: string;
    countryCode: string;
    continent: string;
    continentCode: string;
}
// Combined user type that merges auth, profile, preferences, and location
export interface UserWithProfile extends Models.User<Models.Preferences> {
    profile: Profile;
    location: UserLocation;
}

export interface LibraryWithItems extends Library {
    items?: LibraryItemWithMedia[];
    user?: Profile;
}

export interface LibraryItemWithMedia extends LibraryItem {
    library?: Library;
    media?: TmdbMedia;
}

export interface DocumentList<T> {
    total: number;
    documents: T[];
}

export type ProfileDocumentList = DocumentList<Profile>;
export type LibraryItemDocumentList = DocumentList<LibraryItem>;
export type TmdbMediaDocumentList = DocumentList<TmdbMedia>;
