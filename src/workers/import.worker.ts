import { z } from 'zod';

// --- TYPE-SAFE ZOD SCHEMAS ---

// This schema handles the raw, unpredictable input from a file.
const RawMediaSchema = z.object({
  id: z.string().optional(),
  tmdbId: z.coerce.number({ invalid_type_error: 'must be a number' }).positive('must be a positive number'),
  media_type: z.enum(['movie', 'tv'], { invalid_type_error: 'must be either "movie" or "tv"' }),
  title: z.string().trim().min(1, 'cannot be empty').optional(),
  status: z.enum(['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed']).optional().default('none'),
  isFavorite: z.coerce.boolean().optional().default(false),
  userRating: z.coerce.number().min(1).max(10).nullable().optional(),
  notes: z.string().nullable().optional(),
  addedAt: z.coerce.date({ invalid_type_error: 'is not a valid date' }).optional(),
  lastUpdatedAt: z.coerce.date({ invalid_type_error: 'is not a valid date' }).optional(),
  releaseDate: z.coerce.date().nullable().optional(),
  posterPath: z.string().nullable().optional(),
  genres: z.preprocess((val) => (typeof val === 'string' ? JSON.parse(val) : val), z.array(z.string()).optional().default([])),
  rating: z.coerce.number().nullable().optional(),
  totalMinutesRuntime: z.coerce.number().int().nullable().optional(),
  networks: z.preprocess((val) => (typeof val === 'string' ? JSON.parse(val) : val), z.array(z.number()).optional().default([])),
  overview: z.string().nullable().optional(),
  userId: z.string().nullable().optional(),
});

// This schema defines the final, strict shape our application requires.
const FinalMediaSchema = RawMediaSchema.transform((data) => {
  const now = new Date();
  return {
    ...data,
    id: data.id || `${data.media_type}-${data.tmdbId}`,
    title: data.title || `Untitled ${data.media_type}-${data.tmdbId}`,
    // Add the required 'library' field and convert dates back to ISO strings
    library: null,
    addedAt: (data.addedAt || now).toISOString(),
    lastUpdatedAt: (data.lastUpdatedAt || now).toISOString(),
    releaseDate: data.releaseDate ? data.releaseDate.toISOString() : null,
  };
});

const ImportSchema = z.array(RawMediaSchema);

// --- WORKER MESSAGE HANDLING ---

interface WorkerMessage {
  type: 'parse';
  format: 'json' | 'csv';
  content: string;
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, format, content } = event.data;
  if (type !== 'parse' || !content) {
    self.postMessage({ type: 'error', error: 'Invalid message format' });
    return;
  }

  try {
    if (!content || content.trim() === '') {
      throw new Error('The import file appears to be empty.');
    }

    let rawData: unknown[];
    if (format === 'json') {
      rawData = parseJSON(content);
    } else if (format === 'csv') {
      rawData = parseCSV(content);
    } else {
      throw new Error('Unsupported format.');
    }

    const parsed = ImportSchema.safeParse(rawData);
    if (!parsed.success) {
      throw new Error(formatZodError(parsed.error));
    }

    const finalData = parsed.data.map(item => FinalMediaSchema.parse(item));
    self.postMessage({ type: 'success', data: finalData });

  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// --- HELPER FUNCTIONS ---

function formatZodError(error: z.ZodError): string {
  const firstError = error.errors[0];
  const itemIndex = (firstError.path[0] as number) + 1;
  const fieldName = firstError.path[1] as string;
  const message = firstError.message;

  return `Import failed on item #${itemIndex}: The "${fieldName}" field ${message}. Please check your file and try again.`;
}

function parseJSON(content: string): unknown[] {
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) return Object.values(data);
    throw new Error('Invalid JSON structure. Expected an array or object of items.');
  } catch (e) {
    throw new Error(`JSON parsing error: ${e instanceof Error ? e.message : 'Invalid format'}`);
  }
}

function parseCSV(content: string): Record<string, unknown>[] {
  const lines = content.trim().split('\n');
  if (lines.length <= 1) throw new Error('CSV must contain a header and at least one data row.');

  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const items: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = parseCSVRow(lines[i]);
    if (row.length !== headers.length) continue;

    const item: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      if (row[index] !== '') item[header] = row[index];
    });
    items.push(item);
  }
  return items;
}

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && inQuotes && line[i + 1] === '"') {
      current += '"'; i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}