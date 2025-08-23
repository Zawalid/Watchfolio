import { filterObject } from '@/utils';

interface WorkerMessage {
  type: 'serialize';
  format: 'json' | 'csv';
  items: LibraryMedia[];
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, format, items } = event.data;

  if (type !== 'serialize') return;

  const updatedItems = items.map((item) => filterObject(item, ['library', 'userId'], 'exclude'));

  try {
    const serializedData = format === 'json' ? serializeToJSON(updatedItems) : serializeToCSV(updatedItems);
    // Send the serialized string back
    self.postMessage({ type: 'success', data: serializedData });
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

function serializeToJSON(items: LibraryMedia[]): string {
  return JSON.stringify(items, null, 2);
}

function serializeToCSV(items: LibraryMedia[]): string {
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
}
