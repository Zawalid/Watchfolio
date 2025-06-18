import { type Models } from 'appwrite';

type Theme = 'light' | 'dark' | 'system';
type ConfirmationSetting = 'enabled' | 'disabled';
type MediaType = 'movie' | 'tv';
type WatchStatus = 'watching' | 'willWatch' | 'watched' | 'onHold' | 'dropped' | 'none';

declare global {
  interface User extends Models.Document {
    name: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    username?: string;
    preferences?: UserPreferences;
    library?: Library;
  }

  interface UserPreferences extends Models.Document {
    signOutConfirmation: ConfirmationSetting;
    removeFromWatchlistConfirmation: ConfirmationSetting;
    theme: Theme;
    language: string;
  }

  interface Library extends Models.Document {
    averageRating?: number;
    items?: LibraryItem[];
    user?: User;
  }

  interface LibraryItem extends Models.Document {
    status: WatchStatus;
    isFavorite: boolean;
    userRating?: number;
    notes?: string;
    addedAt?: string;
    library?: Library;
    media?: TmdbMedia;
  }

  interface TmdbMedia extends Models.Document {
    id: number;
    mediaType: MediaType;
    title: string;
    overview?: string;
    posterPath?: string;
    releaseDate?: string;
    genres?: string[];
    rating?: number;
  }

  type CreateUserInput = Omit<User, keyof Models.Document | 'preferences' | 'library'>;
  type CreateUserPreferencesInput = Omit<UserPreferences, keyof Models.Document>;
  type CreateLibraryInput = Omit<Library, keyof Models.Document | 'items' | 'user'>;
  type CreateLibraryItemInput = Omit<LibraryItem, keyof Models.Document | 'library' | 'media'> & {
    libraryId: string;
    mediaId: string;
  };
  type CreateTmdbMediaInput = Omit<TmdbMedia, keyof Models.Document>;

  type UpdateUserInput = Partial<CreateUserInput>;
  type UpdateUserPreferencesInput = Partial<CreateUserPreferencesInput>;
  type UpdateLibraryInput = Partial<CreateLibraryInput>;
  type UpdateLibraryItemInput = Partial<Omit<CreateLibraryItemInput, 'libraryId' | 'mediaId'>>;
  type UpdateTmdbMediaInput = Partial<CreateTmdbMediaInput>;

  interface UserWithRelations extends User {
    preferences?: UserPreferences;
    library?: LibraryWithItems;
  }

  interface LibraryWithItems extends Library {
    items?: LibraryItemWithMedia[];
    user?: User;
  }

  interface LibraryItemWithMedia extends LibraryItem {
    library?: Library;
    media?: TmdbMedia;
  }

  interface DocumentList<T> {
    total: number;
    documents: T[];
  }

  type UserDocumentList = DocumentList<User>;
  type LibraryItemDocumentList = DocumentList<LibraryItem>;
  type TmdbMediaDocumentList = DocumentList<TmdbMedia>;
}
