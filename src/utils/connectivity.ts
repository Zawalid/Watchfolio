/**
 * Check if we have actual internet connectivity (not just local network)
 * navigator.onLine is unreliable - it only checks adapter status
 */

let lastCheckTime = 0;
let cachedOnlineStatus = true;
const CHECK_CACHE_MS = 5000; // Cache result for 5s to avoid spam

export async function isActuallyOnline(): Promise<boolean> {
  // Use cached result if recent
  const now = Date.now();
  if (now - lastCheckTime < CHECK_CACHE_MS) {
    return cachedOnlineStatus;
  }

  // Quick check: if navigator says offline, we're definitely offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    cachedOnlineStatus = false;
    lastCheckTime = now;
    return false;
  }

  // Try a lightweight HEAD request to verify actual connectivity
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeout);
    cachedOnlineStatus = response.ok;
    lastCheckTime = now;
    return response.ok;
  } catch {
    // Any error means we're offline
    cachedOnlineStatus = false;
    lastCheckTime = now;
    return false;
  }
}

interface NetworkErrorLike {
  type?: string;
  code?: string | number;
  name?: string;
}

/**
 * Detect if an error is a network/connectivity error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const errorObj = error as NetworkErrorLike;
  const errorType = errorObj.type?.toLowerCase() || '';
  const errorCode = errorObj.code;
  const errorName = errorObj.name?.toLowerCase() || '';

  // Common network error patterns
  return (
    // Fetch errors
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('networkerror') ||
    // DNS errors
    errorMessage.includes('name_not_resolved') ||
    errorMessage.includes('err_name_not_resolved') ||
    errorName.includes('name_not_resolved') ||
    // Connection errors
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('refused') ||
    errorMessage.includes('unreachable') ||
    // Type checks
    errorType.includes('network') ||
    errorName === 'networkerror' ||
    // Code checks
    errorCode === 0 || // Network error
    errorCode === 'ENOTFOUND' || // DNS error
    errorCode === 'ECONNREFUSED' || // Connection refused
    errorCode === 'ETIMEDOUT' // Timeout
  );
}
