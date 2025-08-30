import { filterObject } from '@/utils';

interface WorkerChunkMessage {
  type: 'serialize-chunk';
  items: LibraryMedia[];
}

interface WorkerCompleteMessage {
  type: 'export-complete';
  format: 'json' | 'csv';
}

type WorkerMessage = WorkerChunkMessage | WorkerCompleteMessage;

// Store items in memory across multiple messages
let accumulatedItems: LibraryMedia[] = [];

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  // Handle incoming chunks by adding them to our array
  if (message.type === 'serialize-chunk') {
    accumulatedItems.push(...message.items);
    return;
  }

  // Handle the final signal to process all accumulated items
  if (message.type === 'export-complete') {
    if (accumulatedItems.length === 0) {
      self.postMessage({ type: 'error', error: 'No items were provided to export.' });
      return;
    }

    const updatedItems = accumulatedItems.map((item) => filterObject(item, ['library', 'userId'], 'exclude'));

    try {
      const serializedData = message.format === 'json' ? serializeToJSON(updatedItems) : serializeToCSV(updatedItems);

      // Send the single, complete serialized string back
      self.postMessage({ type: 'success', data: serializedData });
    } catch (error) {
      self.postMessage({
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      // Reset the state for the next export operation
      accumulatedItems = [];
    }
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
