/**
 * api.js
 * Centralised helpers for all Flask API calls.
 * The CRA proxy (set in package.json) forwards /api → http://localhost:5000
 */

const BASE = process.env.REACT_APP_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const contentType = res.headers.get('Content-Type') || '';
  const text = await res.text();
  let data;

  if (text) {
    if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        if (!res.ok) {
          throw new Error(text.trim() || `Request failed (${res.status})`);
        }
        throw new Error('Invalid JSON response from API');
      }
    } else {
      data = text;
    }
  }

  if (!res.ok) {
    if (data && typeof data === 'object' && 'error' in data) {
      throw new Error(data.error);
    }
    throw new Error(typeof data === 'string' && data.trim() ? data.trim() : `Request failed (${res.status})`);
  }

  return data;
}

/* ── Articles ──────────────────────────────────────── */

/** GET /api/articles?category=  →  array of article summaries */
export function getArticles(category = '') {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/articles${qs}`);
}

/** GET /api/articles/<id>  →  single article with full content */
export function getArticle(id) {
  return request(`/articles/${id}`);
}

/** POST /api/articles  →  created article */
export function createArticle(data) {
  return request('/articles', { method: 'POST', body: JSON.stringify(data) });
}

/** PUT /api/articles/<id>  →  updated article */
export function updateArticle(id, data) {
  return request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

/** DELETE /api/articles/<id>  →  { message } */
export function deleteArticle(id) {
  return request(`/articles/${id}`, { method: 'DELETE' });
}

/** GET /api/articles/search?q=  →  array of matching articles */
export function searchArticles(query) {
  return request(`/articles/search?q=${encodeURIComponent(query)}`);
}

/** GET /api/categories  →  array of category strings */
export function getCategories() {
  return request('/categories');
}
