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
 * Detects format and parses import content
 */
export const parseImportContent = (content: string): LibraryMedia[] => {
  // Support both JSON and CSV formats
  let importedItems: LibraryMedia[] = [];

  // Check for empty content
  if (!content || content.trim() === '') {
    throw new Error('The import file appears to be empty');
  }

  // Parse JSON content
  if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
    try {
      // First, parse the JSON
      const parsedData = JSON.parse(content);

      // Handle array format
      if (Array.isArray(parsedData)) {
        importedItems = parsedData;
      }
      // Handle object format (key-value pairs)
      else if (typeof parsedData === 'object' && parsedData !== null) {
        importedItems = Object.values(parsedData);
      } else {
        throw new Error('Invalid JSON structure. Expected an array of items or an object with items as values.');
      }

      // Validate that parsed items have required fields
      validateImportedItems(importedItems);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`JSON parsing error: ${error.message}`);
      }
      throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // Parse CSV content
  else if (content.includes(',')) {
    try {
      importedItems = parseCSVContent(content);
      validateImportedItems(importedItems);
    } catch (error) {
      throw new Error(`Invalid CSV format: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    throw new Error('Unrecognized file format. File must be JSON or CSV.');
  }

  if (importedItems.length === 0) {
    throw new Error('No valid items found in import data');
  }

  return importedItems;
};

// Helper function to validate imported items have required fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateImportedItems = (items: any[]): void => {
  // Check that we have at least some items
  if (!items || items.length === 0) {
    throw new Error('No items found in the import file');
  }

  // First, check if the array contains only objects
  if (!items.every((item) => typeof item === 'object' && item !== null)) {
    throw new Error('Import data must contain only objects');
  }

  // Check required fields on all items (not just samples)
  // This ensures we don't fail later during processing
  const invalidItems = items.filter(
    (item) => !item.id || typeof item.id !== 'number' || (item.media_type !== 'movie' && item.media_type !== 'tv')
  );

  if (invalidItems.length > 0) {
    const percentage = Math.round((invalidItems.length / items.length) * 100);

    if (percentage > 50) {
      // If more than half the items are invalid, reject the import
      throw new Error(
        'Import file contains too many invalid items. Each item must have a numeric id and a valid media_type (movie or tv).'
      );
    } else if (invalidItems.length > 0) {
      // Just log a warning if some items are invalid
      console.warn(
        `Warning: ${invalidItems.length} items (${percentage}%) in the import file are invalid and will be skipped.`
      );

      // For debugging
      console.debug('Sample invalid item:', invalidItems[0]);
    }
  }

  // Check for required date fields
  let dateWarning = false;
  items.forEach((item) => {
    // Ensure dates are in ISO format
    if (item.addedToLibraryAt && !isValidISODate(item.addedToLibraryAt)) {
      item.addedToLibraryAt = new Date().toISOString();
      dateWarning = true;
    }

    if (item.lastUpdatedAt && !isValidISODate(item.lastUpdatedAt)) {
      item.lastUpdatedAt = new Date().toISOString();
      dateWarning = true;
    }

    // Set default dates if missing
    if (!item.addedToLibraryAt) {
      item.addedToLibraryAt = new Date().toISOString();
    }

    if (!item.lastUpdatedAt) {
      item.lastUpdatedAt = new Date().toISOString();
    }
  });

  if (dateWarning) {
    console.warn('Some dates in the import file were invalid and have been replaced with current date.');
  }
};

// Helper to validate ISO date strings
const isValidISODate = (dateStr: string): boolean => {
  if (typeof dateStr !== 'string') return false;

  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.includes('T');
  } catch {
    return false;
  }
};

/**
 * Parses CSV content to library items
 */
export const parseCSVContent = (csvContent: string): LibraryMedia[] => {
  const importedItems: LibraryMedia[] = [];
  const lines = csvContent.trim().split('\n');

  if (lines.length <= 1) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  // Validate header row
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());
  const requiredHeaders = ['id', 'media_type'];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
  }

  // Parse each data row
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Use a proper CSV parsing approach with quote handling
    const row = parseCSVRow(lines[i]);

    if (row.length !== headers.length) {
      console.warn(`Skipping row ${i + 1}: invalid column count (expected ${headers.length}, got ${row.length})`);
      continue;
    }

    const item: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      if (index < row.length) {
        const value = row[index];

        // Convert to appropriate types
        if (value === 'true') item[header] = true;
        else if (value === 'false') item[header] = false;
        else if (header === 'id') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            console.warn(`Row ${i + 1}: invalid id "${value}", must be a number`);
            // Skip this row by not setting the ID
          } else {
            item[header] = numValue;
          }
        } else if (header === 'isFavorite') item[header] = value === 'true';
        else if (header === 'userRating') {
          const numValue = Number(value);
          item[header] = isNaN(numValue) ? undefined : numValue;
        } else if (header === 'watchDates' && value) {
          try {
            const dates = JSON.parse(value);
            item[header] = Array.isArray(dates) ? dates : [];
          } catch {
            item[header] = [];
          }
        } else if (header === 'lastWatchedEpisode' && value) {
          try {
            item[header] = JSON.parse(value);
          } catch {
            // Invalid JSON, skip this field
          }
        } else item[header] = value;
      }
    });

    // Only add if required fields are present and valid
    if (
      item.id &&
      typeof item.id === 'number' &&
      item.media_type &&
      (item.media_type === 'movie' || item.media_type === 'tv')
    ) {
      // Ensure required boolean field
      if (typeof item.isFavorite !== 'boolean') {
        item.isFavorite = false;
      }

      // Ensure required status field
      if (!item.status || typeof item.status !== 'string') {
        item.status = 'none';
      }

      // Ensure date fields
      if (!item.addedToLibraryAt) {
        item.addedToLibraryAt = new Date().toISOString();
      }

      if (!item.lastUpdatedAt) {
        item.lastUpdatedAt = new Date().toISOString();
      }

      importedItems.push(item as unknown as LibraryMedia);
    } else {
      console.warn(`Skipping row ${i + 1}: missing or invalid required fields`);
    }
  }

  return importedItems;
};

/**
 * Properly parses a CSV row handling quoted fields
 */
export const parseCSVRow = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i < line.length - 1 ? line[i + 1] : '';

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Handle escaped quotes inside quoted string
        current += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  result.push(current);
  return result;
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

  // For larger libraries, create a map of keys for O(1) lookups
  const importedItemsMap = new Map<string, LibraryMedia>();
  validItems.forEach((item) => {
    const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
    importedItemsMap.set(key, item);
  });

  // Handle different merge strategies
  if (options.mergeStrategy === 'overwrite') {
    // For overwrite, start with a clean slate
    // But we still need to handle the keepExistingFavorites option
    if (options.keepExistingFavorites) {
      // First map all existing favorites to preserve them
      const existingFavorites: Record<string, boolean> = {};
      Object.entries(currentLibrary).forEach(([key, item]) => {
        if (item.isFavorite) {
          existingFavorites[key] = true;
        }
      });

      // Then add all imported items, preserving favorite status if needed
      importedItems.forEach((item) => {
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
      importedItems.forEach((item) => {
        const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
        mergedLibrary[key] = item;
        importCount++;
      });
    }
  } else {
    // For 'smart' or 'skip' strategies, process each imported item
    importedItems.forEach((importedItem) => {
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
