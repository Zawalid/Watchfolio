import { z } from 'zod';

/**
 * Validation schemas for library data
 */

// Base schema for required fields in any library item
const libraryMediaBaseSchema = z.object({
  id: z.number().int().positive(),
  media_type: z.enum(['movie', 'tv']),
  status: z.enum(['completed', 'watching', 'willWatch', 'onHold', 'dropped', 'none']).default('none'),
  isFavorite: z.boolean().default(false),
  addedAt: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)),
  lastUpdatedAt: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)),
});

// Optional fields schema
const libraryMediaOptionalSchema = z.object({
  title: z.string().optional(),
  posterPath: z.string().nullable().optional(),
  releaseDate: z.string().optional(),
  genres: z.array(z.string()).optional(),
  rating: z.number().min(0).max(10).optional(),
  userRating: z.number().min(0).max(10).optional(),
  notes: z.string().optional(),
  watchDates: z.array(z.string().datetime()).optional(),
  lastWatchedEpisode: z
    .object({
      seasonNumber: z.number().int().min(1),
      episodeNumber: z.number().int().min(1),
      watchedAt: z.string().datetime().optional(),
    })
    .optional(),
});

// Complete library media item schema
export const LibraryItemschema = libraryMediaBaseSchema.merge(libraryMediaOptionalSchema);

// Schema for array of library items (for validating imported data)
export const libraryImportSchema = z.array(LibraryItemschema);

// Schema for import options
export const importOptionsSchema = z.object({
  mergeStrategy: z.enum(['smart', 'overwrite', 'skip']).default('smart'),
  keepExistingFavorites: z.boolean().default(true),
});

/**
 * Error message customization
 */
export const formatZodError = (error: z.ZodError): string => {
  const issues = error.issues.map((issue) => {
    const path = issue.path.join('.');
    return `${path ? `${path}: ` : ''}${issue.message}`;
  });

  return issues.join('\n');
};
