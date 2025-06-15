interface WorkerMessage {
  type: 'parse';
  format: 'json' | 'csv';
  content: string;
}

interface WorkerResponse {
  type: 'success' | 'error';
  data?: LibraryMedia[];
  error?: string;
}

// Handle messages from the main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, format, content } = event.data;

  if (type !== 'parse' || !content) {
    self.postMessage({
      type: 'error',
      error: 'Invalid message format',
    } as WorkerResponse);
    return;
  }

  try {
    // Check for empty content
    if (!content || content.trim() === '') {
      throw new Error('The import file appears to be empty');
    }

    let parsedData: LibraryMedia[];

    if (format === 'json') {
      parsedData = parseJSON(content);
    } else if (format === 'csv') {
      parsedData = parseCSV(content);
    } else {
      throw new Error('Unsupported format');
    }

    // Validate parsed items
    validateImportedItems(parsedData);

    if (parsedData.length === 0) {
      throw new Error('No valid items found in import data');
    }

    // Send the parsed data back to the main thread
    self.postMessage({ type: 'success', data: parsedData } as WorkerResponse);
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    } as WorkerResponse);
  }
};

// Parse JSON content
function parseJSON(content: string): LibraryMedia[] {
  try {
    // First, parse the JSON
    const parsedData = JSON.parse(content);

    // Handle array format
    if (Array.isArray(parsedData)) {
      return parsedData;
    }
    // Handle object format (key-value pairs)
    else if (typeof parsedData === 'object' && parsedData !== null) {
      return Object.values(parsedData);
    } else {
      throw new Error('Invalid JSON structure. Expected an array of items or an object with items as values.');
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`JSON parsing error: ${error.message}`);
    }
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Parse CSV content
function parseCSV(content: string): LibraryMedia[] {
  const importedItems: LibraryMedia[] = [];
  const lines = content.trim().split('\n');

  if (lines.length <= 1) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  // Validate header row - be more flexible with headers
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());
  const requiredHeaders = ['id', 'media_type'];
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
  }

  // Parse each data row
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Use proper CSV parsing with quote handling
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
        if (value === 'true') {
          item[header] = true;
        } else if (value === 'false') {
          item[header] = false;
        } else if (header === 'id') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            console.warn(`Row ${i + 1}: invalid id "${value}", must be a number`);
            // Skip this row by not setting the ID
          } else {
            item[header] = numValue;
          }
        } else if (header === 'isFavorite') {
          item[header] = value === 'true';
        } else if (header === 'userRating') {
          const numValue = Number(value);
          item[header] = isNaN(numValue) ? undefined : numValue;
        }
        // else if (header === 'watchDates' && value) {
        //   try {
        //     const dates = JSON.parse(value);
        //     item[header] = Array.isArray(dates) ? dates : [];
        //   } catch {
        //     item[header] = [];
        //   }
        // } else if (header === 'lastWatchedEpisode' && value) {
        //   try {
        //     item[header] = JSON.parse(value);
        //   } catch {
        //     // Invalid JSON, skip this field
        //   }
        // }
        else {
          item[header] = value;
        }
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
}

// Helper function to parse a CSV row with proper handling of quotes
function parseCSVRow(line: string): string[] {
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
}

// Helper to validate ISO date strings
function isValidISODate(dateStr: string): boolean {
  if (typeof dateStr !== 'string') return false;

  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.includes('T');
  } catch {
    return false;
  }
}

// Validate the parsed items
function validateImportedItems(items: LibraryMedia[]): void {
  // Check that we have at least some items
  if (!items || items.length === 0) {
    throw new Error('No items found in the import file');
  }

  // First, check if the array contains only objects
  if (!items.every((item) => typeof item === 'object' && item !== null)) {
    throw new Error('Import data must contain only objects');
  }

  // Check required fields on all items
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
    }
  }

  // Check for required date fields and fix if needed
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
}
