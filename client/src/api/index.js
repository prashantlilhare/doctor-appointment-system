const RAW_BASE = import.meta.env.VITE_API_URL || '';
const BASE = RAW_BASE.replace(/\/+$/, '');
const API_BASE = BASE.endsWith('/api') ? BASE : `${BASE}/api`;

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('sovind_token');

  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  // Appointments
  createAppointment: (data) =>
    fetch(`${API_BASE}/appointments/create`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  trackAppointments: (phone) =>
    fetch(`${API_BASE}/appointments/track/${phone}`, { headers: getHeaders() }).then((r) => r.json()),

  getAllAppointments: () =>
    fetch(`${API_BASE}/appointments/all`, { headers: getHeaders() }).then((r) => r.json()),

  updateAppointment: (id, status) =>
    fetch(`${API_BASE}/appointments/update/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then((r) => r.json()),

  // Auth
  login: (data) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // Feedback
  createFeedback: (data) =>
    fetch(`${API_BASE}/feedback/create`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  getAllFeedback: () =>
    fetch(`${API_BASE}/feedback/all`, { headers: getHeaders() }).then((r) => r.json()),

  getAllFeedbackAdmin: () =>
    fetch(`${API_BASE}/feedback/admin/all`, { headers: getHeaders() }).then((r) => r.json()),

  approveFeedback: (id) =>
    fetch(`${API_BASE}/feedback/approve/${id}`, { method: 'PATCH', headers: getHeaders() }).then((r) => r.json()),

  // Schedule
  getSchedule: () =>
    fetch(`${API_BASE}/schedule`, { headers: getHeaders(false) }).then((r) => r.json()),

  updateSchedule: (day, data) =>
    fetch(`${API_BASE}/schedule/${day}`, {
      method: 'PATCH',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};
