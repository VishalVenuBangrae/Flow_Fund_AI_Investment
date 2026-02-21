/**
 * Decode JWT payload without verification (only to read exp).
 * Returns null if token is invalid or missing.
 */
function getTokenExpiration(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const data = JSON.parse(json);
    return data.exp ? data.exp * 1000 : null; // exp is in seconds, convert to ms
  } catch {
    return null;
  }
}

/**
 * If token is expired, clear it and redirect to login.
 * Otherwise schedule redirect at expiration time.
 * Call once on app load and after login.
 */
export function scheduleSessionExpiry() {
  const token = localStorage.getItem('token');
  const expMs = getTokenExpiration(token);
  if (!expMs) return;

  const now = Date.now();
  if (expMs <= now) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  const msUntilExpiry = expMs - now;
  setTimeout(() => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }, msUntilExpiry);
}
