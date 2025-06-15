/**
 * Generates a consistent key for a media item
 */
export const generateMediaKey = (mediaType: 'movie' | 'tv', id: number) => `${mediaType}-${id}`;

/**
 * Estimates file size for export preview
 */
export const estimateFileSize = (count: number, format: 'json' | 'csv'): string => {
  const averageSize = format === 'json' ? 400 : 160;
  const bytes = count * averageSize;

  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

/**
 * Formats date for filenames
 */
export const formatDateForFilename = (date: Date): string => date.toISOString().slice(0, 10).replace(/-/g, '');

/**
 * Serializes library items to JSON format
 */
export const serializeToJSON = (items: LibraryMedia[]): string => {
  return JSON.stringify(items, null, 2);
};

/**
 * Serializes library items to CSV format
 */
export const serializeToCSV = (items: LibraryMedia[]): string => {
  if (items.length === 0) return '';

  // Define headers based on LibraryMedia interface
  const headers: (keyof LibraryMedia)[] = [
    'id',
    'media_type',
    'title',
    'posterPath',
    'releaseDate',
    'status',
    'isFavorite',
    'userRating',
    'addedToLibraryAt',
    'lastUpdatedAt',
    'notes',
  ];

  // Create CSV header row
  let csvContent = headers.join(',') + '\n';

  // Add data rows
  items.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header as keyof LibraryMedia];

      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      } else if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
      } else if (typeof value === 'object') {
        try {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } catch {
          return '""';
        }
      } else {
        return String(value);
      }
    });

    csvContent += row.join(',') + '\n';
  });

  return csvContent;
};

type ImportOptions = {
  mergeStrategy: 'smart' | 'overwrite' | 'skip';
  keepExistingFavorites: boolean;
};

/**
 * Merges imported items with existing library
 */
export const mergeLibraryItems = (
  importedItems: LibraryMedia[],
  currentLibrary: LibraryCollection,
  options: ImportOptions
): { mergedLibrary: LibraryCollection; importCount: number } => {
  // Create a new merged library object to avoid mutation
  const mergedLibrary: LibraryCollection = {};
  let importCount = 0;

  // Filter out invalid items before processing
  const validItems = importedItems.filter(
    (item) =>
      item &&
      typeof item.id === 'number' &&
      (item.media_type === 'movie' || item.media_type === 'tv') &&
      typeof item.isFavorite === 'boolean'
  );

  if (validItems.length < importedItems.length) {
    console.warn(`Filtered out ${importedItems.length - validItems.length} invalid items during import`);
  }

  // Handle different merge strategies
  if (options.mergeStrategy === 'overwrite') {
    // For overwrite, start with a clean slate
    if (options.keepExistingFavorites) {
      // First map all existing favorites to preserve them
      const existingFavorites: Record<string, boolean> = {};
      Object.entries(currentLibrary).forEach(([key, item]) => {
        if (item.isFavorite) {
          existingFavorites[key] = true;
        }
      });

      // Then add all imported items, preserving favorite status if needed
      validItems.forEach((item) => {
        const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
        if (existingFavorites[key]) {
          mergedLibrary[key] = { ...item, isFavorite: true };
        } else {
          mergedLibrary[key] = item;
        }
        importCount++;
      });
    } else {
      // Simple overwrite - just use imported items
      validItems.forEach((item) => {
        const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
        mergedLibrary[key] = item;
        importCount++;
      });
    }
  } else {
    // For 'smart' or 'skip' strategies, process each imported item
    validItems.forEach((importedItem) => {
      const key = generateMediaKey(importedItem.media_type as 'movie' | 'tv', importedItem.id);
      const existingItem = currentLibrary[key];

      // Handle item based on existence and merge strategy
      if (!existingItem) {
        // New item - always add regardless of strategy
        mergedLibrary[key] = importedItem;
        importCount++;
      } else {
        // Item exists, apply strategy
        if (options.mergeStrategy === 'skip') {
          // Skip - keep existing item unchanged
          mergedLibrary[key] = existingItem;
        } else {
          // Smart merge: combine both with preference for newer data
          const mergedItem = {
            ...existingItem,
            ...importedItem,
            // Keep existing favorites if option is enabled
            isFavorite: options.keepExistingFavorites
              ? existingItem.isFavorite || importedItem.isFavorite
              : importedItem.isFavorite,
            // For dates, keep the more recent one
            addedToLibraryAt: existingItem.addedToLibraryAt || importedItem.addedToLibraryAt,
            // Use the more recent lastUpdatedAt
            lastUpdatedAt: new Date(
              Math.max(new Date(existingItem.lastUpdatedAt).getTime(), new Date(importedItem.lastUpdatedAt).getTime())
            ).toISOString(),
          };
          mergedLibrary[key] = mergedItem;
          importCount++;
        }
      }
    });
  }

  // Add any existing items that weren't in the import (if not overwriting everything)
  if (options.mergeStrategy !== 'overwrite') {
    Object.entries(currentLibrary).forEach(([key, item]) => {
      if (!mergedLibrary[key]) {
        mergedLibrary[key] = item;
      }
    });
  }

  return { mergedLibrary, importCount };
};
