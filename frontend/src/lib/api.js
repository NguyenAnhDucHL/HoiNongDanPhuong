/**
 * API helper for HND frontend
 * Base URL proxied via Vite to http://localhost:3002
 */

const BASE = '/api';

export const fetchApi = async (path, options = {}) => {
  const token = localStorage.getItem('hnd_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && data.error === 'kicked_out') {
      localStorage.removeItem('hnd_admin_token');
      localStorage.removeItem('hnd_admin_info');
      window.location.href = '/admin/login?error=kicked_out';
      return;
    }

    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data;
};

export const postFormData = async (path, formData) => {
  const token = localStorage.getItem('hnd_admin_token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && data.error === 'kicked_out') {
      localStorage.removeItem('hnd_admin_token');
      localStorage.removeItem('hnd_admin_info');
      window.location.href = '/admin/login?error=kicked_out';
      return;
    }

    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
};
