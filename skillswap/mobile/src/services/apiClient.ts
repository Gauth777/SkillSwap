// API Client — connects mobile app to SkillSwap backend
// Falls back gracefully if EXPO_PUBLIC_API_URL is missing or backend is offline

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

/** Whether backend integration is configured */
export function isBackendConfigured(): boolean {
  return !!BASE_URL && BASE_URL.length > 0;
}

/** Generic fetch wrapper with timeout and error handling */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  if (!isBackendConfigured()) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[API] ${options.method || 'GET'} ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    clearTimeout(timeout);
    // Network error or timeout — silent fallback
    console.warn(`[API] ${path} failed:`, err instanceof Error ? err.message : err);
    return null;
  }
}
