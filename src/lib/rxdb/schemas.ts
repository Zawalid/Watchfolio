import type { RxJsonSchema } from 'rxdb';
import type { WatchfolioLibraryItem, WatchfolioUserPreferences } from './types';

// ===== LIBRARY ITEM SCHEMA =====

export const libraryItemSchema: RxJsonSchema<WatchfolioLibraryItem> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        status: {
            type: 'string',
            enum: ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'],
            maxLength: 20  // Required for indexed string fields
        },
        isFavorite: {
            type: 'boolean'
        },
        userRating: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
            multipleOf: 1
        },
        notes: {
            type: 'string',
            maxLength: 2000
        },
        addedAt: {
            type: 'string',
            format: 'date-time',
            maxLength: 50  // Required for indexed string fields
        },
        libraryId: {
            type: 'string',
            maxLength: 100  // Required for indexed string fields
        },
        tmdbId: {
            type: 'integer',
            minimum: 1,
            maximum: 999999999,
            multipleOf: 1  // Required for indexed integer fields
        },
        title: {
            type: 'string',
            maxLength: 255
        },
        mediaType: {
            type: 'string',
            enum: ['movie', 'tv'],
            maxLength: 10  // Required for indexed string fields
        },
        posterPath: {
            type: 'string',
            maxLength: 200  // Increased for full poster URLs
        },
        releaseDate: {
            type: 'string',
            format: 'date-time',
            maxLength: 50
        },
        genres: {
            type: 'array',
            items: {
                type: 'string',
                maxLength: 50
            }
        },
        rating: {
            type: 'number',
            minimum: 0,
            maximum: 10,
            multipleOf: 0.1  // For decimal ratings like 7.5
        },
        totalMinutesRuntime: {
            type: 'integer',
            minimum: 0,
            maximum: 99999, // Reasonable upper limit for runtime in minutes
            multipleOf: 1  // Add this since it might be indexed later
        },
        networks: {
            type: 'array',
            items: {
                type: 'integer',
                minimum: 0,
                maximum: 2147483647, // 32-bit signed integer limit
                multipleOf: 1  // Required for integer array items
            }
        }
    },
    required: ['id', 'status', 'isFavorite', 'addedAt', 'libraryId', 'tmdbId', 'title', 'mediaType'],
    indexes: [
        ['libraryId'],           // Query by user's library
        ['tmdbId', 'mediaType'], // Find specific media
        ['status'],              // Filter by watch status
        ['isFavorite'],          // Get favorites
        ['addedAt']              // Sort by date added
    ]
};

// ===== USER PREFERENCES SCHEMA =====

export const userPreferencesSchema: RxJsonSchema<WatchfolioUserPreferences> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        userId: {
            type: 'string',
            maxLength: 100  // Required for indexed string fields
        },
        signOutConfirmation: {
            type: 'string',
            enum: ['enabled', 'disabled'],
            maxLength: 20
        },
        theme: {
            type: 'string',
            enum: ['light', 'dark', 'system'],
            maxLength: 20
        },
        language: {
            type: 'string',
            maxLength: 10
        },
        clearLibraryConfirmation: {
            type: 'string',
            enum: ['enabled', 'disabled'],
            maxLength: 20
        },
        removeFromLibraryConfirmation: {
            type: 'string',
            enum: ['enabled', 'disabled'],
            maxLength: 20
        },
        enableAnimations: {
            type: 'string',
            enum: ['enabled', 'disabled'],
            maxLength: 20
        },
        defaultMediaStatus: {
            type: 'string',
            enum: ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'],
            maxLength: 20
        },
        autoSync: {
            type: 'boolean'
        }
    },
    required: ['id', 'userId'],
    indexes: [
        ['userId'] // Query by user
    ]
};

// ===== SCHEMA COLLECTIONS MAP =====

export const schemaCollections = {
    libraryItems: {
        schema: libraryItemSchema
    },
    userPreferences: {
        schema: userPreferencesSchema
    }
} as const;
