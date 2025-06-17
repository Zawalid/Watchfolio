import { type Models } from 'appwrite';

export type Theme = 'light' | 'dark' | 'system';
export type ConfirmationSetting = 'enabled' | 'disabled';
export type MediaType = 'movie' | 'tv';
export type WatchStatus = 'watching' | 'willWatch' | 'watched' | 'onHold' | 'dropped' | 'none';

export interface User extends Models.Document {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  username?: string;
  preferences?: UserPreferences;
  library?: Library;
}

export interface UserPreferences extends Models.Document {
  signOutConfirmation: ConfirmationSetting;
  removeFromWatchlistConfirmation: ConfirmationSetting;
  theme: Theme;
  language: string;
}

export interface Library extends Models.Document {
  averageRating?: number;
  items?: LibraryItem[];
  user?: User;
}

export interface LibraryItem extends Models.Document {
  status: WatchStatus;
  isFavorite: boolean;
  userRating?: number;
  notes?: string;
  addedAt?: string;
  library?: Library;
  media?: TmdbMedia;
}

export interface TmdbMedia extends Models.Document {
  id: number;
  mediaType: MediaType;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  genres?: string[];
  rating?: number;
}

export type CreateUserInput = Omit<User, keyof Models.Document | 'preferences' | 'library'>;
export type CreateUserPreferencesInput = Omit<UserPreferences, keyof Models.Document>;
export type CreateLibraryInput = Omit<Library, keyof Models.Document | 'items' | 'user'>;
export type CreateLibraryItemInput = Omit<LibraryItem, keyof Models.Document | 'library' | 'media'> & {
  libraryId: string;
  mediaId: string;
};
export type CreateTmdbMediaInput = Omit<TmdbMedia, keyof Models.Document>;

export type UpdateUserInput = Partial<CreateUserInput>;
export type UpdateUserPreferencesInput = Partial<CreateUserPreferencesInput>;
export type UpdateLibraryInput = Partial<CreateLibraryInput>;
export type UpdateLibraryItemInput = Partial<Omit<CreateLibraryItemInput, 'libraryId' | 'mediaId'>>;
export type UpdateTmdbMediaInput = Partial<CreateTmdbMediaInput>;

export interface UserWithRelations extends User {
  preferences?: UserPreferences;
  library?: LibraryWithItems;
}

export interface LibraryWithItems extends Library {
  items?: LibraryItemWithMedia[];
  user?: User;
}

export interface LibraryItemWithMedia extends LibraryItem {
  library?: Library;
  media?: TmdbMedia;
}

export interface DocumentList<T> {
  total: number;
  documents: T[];
}

export type UserDocumentList = DocumentList<User>;
export type LibraryItemDocumentList = DocumentList<LibraryItem>;
export type TmdbMediaDocumentList = DocumentList<TmdbMedia>;
