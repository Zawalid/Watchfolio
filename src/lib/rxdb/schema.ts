import { RxJsonSchema } from 'rxdb';

// TypeScript interfaces
export interface UserPreferences {
  id: string;
  signOutConfirmation?: 'enabled' | 'disabled';
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  clearLibraryConfirmation?: 'enabled' | 'disabled';
  removeFromLibraryConfirmation?: 'enabled' | 'disabled';
  enableAnimations?: 'enabled' | 'disabled';
  defaultMediaStatus?: 'watching' | 'willWatch' | 'onHold' | 'dropped' | 'none' | 'completed';
  autoSync?: boolean;
}

export interface Library {
  id: string;
  averageRating?: number;
}

export interface LibraryItem {
  id: string;
  status?: 'watching' | 'willWatch' | 'onHold' | 'dropped' | 'none' | 'completed';
  isFavorite?: boolean;
  userRating?: number;
  addedAt?: string;
}

export interface TmdbMedia {
  id: string; // RxDB primary key (string)
  mediaType: 'movie' | 'tv';
  tmdbId: number; // The actual TMDB ID from Appwrite's "id" field
  title: string;
  overview?: string;
  releaseDate?: string;
  genres?: string[];
  rating?: number;
  posterPath?: string;
  totalMinutesRuntime?: number;
  networks?: number[];
}

// Simple Todo interface for testing
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  username?: string;
  userId: string;
  libraryId?: string; // Reference to library
  preferencesId?: string; // Reference to preferences
  bio?: string;
  visibility?: 'public' | 'private';
  contentPreferences?: string[];
  favoriteNetworks?: number[];
  favoriteContentType?: 'movies' | 'tv' | 'both';
  recentActivity?: string[];
  favoriteGenres?: number[];
  hiddenProfileSections?: string[];
}

// RxDB Schemas
export const userPreferencesSchema: RxJsonSchema<UserPreferences> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    signOutConfirmation: {
      type: 'string',
      enum: ['enabled', 'disabled'],
      default: 'enabled',
    },
    theme: {
      type: 'string',
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: 'string',
      maxLength: 10,
      default: 'en',
    },
    clearLibraryConfirmation: {
      type: 'string',
      enum: ['enabled', 'disabled'],
      default: 'enabled',
    },
    removeFromLibraryConfirmation: {
      type: 'string',
      enum: ['enabled', 'disabled'],
      default: 'enabled',
    },
    enableAnimations: {
      type: 'string',
      enum: ['enabled', 'disabled'],
      default: 'enabled',
    },
    defaultMediaStatus: {
      type: 'string',
      enum: ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'],
      default: 'none',
    },
    autoSync: {
      type: 'boolean',
      default: true,
    },
  },
  required: ['id'],
};

export const librarySchema: RxJsonSchema<Library> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    averageRating: {
      type: 'number',
      minimum: 0,
      maximum: 10,
    },
  },
  required: ['id'],
};

export const tmdbMediaSchema: RxJsonSchema<TmdbMedia> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    mediaType: {
      type: 'string',
      enum: ['movie', 'tv'],
    },
    tmdbId: {
      type: 'integer',
      minimum: 1,
      maximum: 2147483647,
    },
    title: {
      type: 'string',
      maxLength: 255,
    },
    overview: {
      type: 'string',
      maxLength: 1000,
    },
    releaseDate: {
      type: 'string',
      format: 'date-time',
    },
    genres: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 50,
      },
    },
    rating: {
      type: 'number',
      minimum: 0,
      maximum: 10,
    },
    posterPath: {
      type: 'string',
      maxLength: 50,
    },
    totalMinutesRuntime: {
      type: 'integer',
      minimum: 0,
    },
    networks: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 2147483647,
      },
    },
  },
  required: ['id', 'mediaType', 'tmdbId', 'title'],
};

export const libraryItemSchema: RxJsonSchema<LibraryItem> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    status: {
      type: 'string',
      enum: ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'],
      default: 'none',
    },
    isFavorite: {
      type: 'boolean',
      default: false,
    },
    userRating: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
    },
    addedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['id'],
};

export const todoSchema: RxJsonSchema<Todo> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    text: {
      type: 'string',
      maxLength: 500,
    },
    completed: {
      type: 'boolean',
      default: false,
    },
  },
  required: ['id', 'text'],
};

export const userProfileSchema: RxJsonSchema<UserProfile> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 50,
    },
    name: {
      type: 'string',
      maxLength: 200,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    avatarUrl: {
      type: 'string',
      format: 'uri',
    },
    username: {
      type: 'string',
      maxLength: 50,
    },
    userId: {
      type: 'string',
      maxLength: 50,
    },
    libraryId: {
      type: 'string',
      maxLength: 50,
    },
    preferencesId: {
      type: 'string',
      maxLength: 50,
    },
    bio: {
      type: 'string',
      maxLength: 500,
    },
    visibility: {
      type: 'string',
      enum: ['public', 'private'],
      default: 'public',
    },
    contentPreferences: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 50,
      },
    },
    favoriteNetworks: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    favoriteContentType: {
      type: 'string',
      enum: ['movies', 'tv', 'both'],
      default: 'both',
    },
    recentActivity: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 500,
      },
    },
    favoriteGenres: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 0,
      },
    },
    hiddenProfileSections: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 40,
      },
    },
  },
  required: ['id', 'name', 'email', 'userId'],
};

// Collection schemas object for RxDB initialization
export const collections = {
  userpreferences: userPreferencesSchema,
  libraries: librarySchema,
  libraryitems: libraryItemSchema,
  tmdbmedia: tmdbMediaSchema,
  userprofiles: userProfileSchema,
  todos: todoSchema,
};
