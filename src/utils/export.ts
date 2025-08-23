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
    'addedAt',
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
