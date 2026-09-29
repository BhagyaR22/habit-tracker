// Base URL for the backend. In dev, Vite proxies /api to the Express server
// (see vite.config.js). In production, set VITE_API_URL to the deployed
// backend's base URL (e.g. https://api.yourapp.com/api).
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),

  // Habits
  getHabits: () => request('/habits'),
  createHabit: (payload) => request('/habits', { method: 'POST', body: payload }),
  deleteHabit: (id) => request(`/habits/${id}`, { method: 'DELETE' }),

  // Logs (habit completion entries)
  getLogs: (params = '') => request(`/logs${params}`),
  toggleLog: (payload) => request('/logs/toggle', { method: 'POST', body: payload })
};
