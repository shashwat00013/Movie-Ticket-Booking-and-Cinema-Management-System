// Frontend API client. Change API_BASE if the backend is hosted elsewhere.
const API_BASE = window.CINEMAHUB_API_URL || 'http://localhost:5000/api';
const API = {
  async request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
  },
  get: resource => API.request(`/${resource}`),
  getById: (resource, id) => API.request(`/${resource}/${encodeURIComponent(id)}`),
  create: (resource, data) => API.request(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
  put: (resource, id, data) => API.request(`/${resource}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (resource, id, data) => API.request(`/${resource}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (resource, id) => API.request(`/${resource}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  login: (role, credentials) => API.request(`/auth/${role}/login`, { method: 'POST', body: JSON.stringify(credentials) })
};








































