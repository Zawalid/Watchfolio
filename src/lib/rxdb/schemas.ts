import type { RxJsonSchema } from 'rxdb';

export const LibraryItemschema: RxJsonSchema<LibraryMedia> = {
  version: 4,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    status: {
      type: 'string',
      enum: ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'],
      maxLength: 20,
    },
    isFavorite: {
      type: 'boolean',
    },
    userRating: {
      type: ['integer', 'null'],
      minimum: 1,
      maximum: 10,
      multipleOf: 1,
    },
    notes: {
      type: ['string', 'null'],
      maxLength: 2000,
    },
    addedAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 50,
    },
    lastUpdatedAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 50,
    },
    tmdbId: {
      type: 'integer',
      minimum: 1,
      maximum: 999999999,
      multipleOf: 1,
    },
    title: {
      type: 'string',
      maxLength: 255,
    },
    media_type: {
      type: 'string',
      enum: ['movie', 'tv'],
      maxLength: 10,
    },
    posterPath: {
      type: ['string', 'null'],
      maxLength: 200,
    },
    releaseDate: {
      type: ['string', 'null'],
      maxLength: 50,
    },
    genres: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 2147483647,
        multipleOf: 1,
      },
    },
    rating: {
      type: ['number', 'null'],
      minimum: 0,
      maximum: 10,
    },
    totalMinutesRuntime: {
      type: ['integer', 'null'],
      minimum: 0,
      maximum: 9999999999999,
    },
    networks: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 2147483647,
        multipleOf: 1,
      },
    },
    overview: {
      type: ['string', 'null'],
      maxLength: 2000,
    },
    library: {
      type: ['string', 'null'],
      maxLength: 40,
    },
    userId: {
      type: 'string',
      maxLength: 40,
    },
  },
  required: [
    'id',
    'status',
    'isFavorite',
    'addedAt',
    'lastUpdatedAt',
    'tmdbId',
    'title',
    'media_type',
    'library',
    'userId',
  ],
  indexes: [
    // getAllLibraryItems
    ['userId', 'status'],
    ['userId', 'media_type'],
    ['userId', 'isFavorite'],

    // Filtering
    ['userId', 'title'],

    // Sorting
    ['userId', 'addedAt'],
    ['userId', 'lastUpdatedAt'],
    ['tmdbId', 'media_type'],

    'userId',
    'status',

    // Multi-filter
    ['userId', 'status', 'media_type'],
    ['userId', 'isFavorite', 'media_type'],
    ['userId', 'media_type', 'status'],
  ],
};
