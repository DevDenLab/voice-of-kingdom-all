/**
 * Tiny fetch wrapper for the session-authenticated admin endpoints.
 *
 * - always sends cookies (Django session + CSRF)
 * - adds the X-CSRFToken header (from the `csrftoken` cookie) on unsafe methods
 * - throws an Error with a `.status` and a readable `.message` on non-2xx
 *
 * Call `GET /api/gallery/session/` once before any write so Django sets the
 * CSRF cookie (that endpoint is decorated with @ensure_csrf_cookie).
 */

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const SAFE = /^(GET|HEAD|OPTIONS|TRACE)$/i;

export async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { ...(options.headers || {}) };

  if (!SAFE.test(method)) {
    const token = getCookie('csrftoken');
    if (token) headers['X-CSRFToken'] = token;
  }
  // Let the browser set the multipart boundary for FormData bodies.
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(path, { credentials: 'include', ...options, method, headers });

  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const err = new Error(
      (data && (data.detail || data.error)) || `Request failed (${res.status})`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
