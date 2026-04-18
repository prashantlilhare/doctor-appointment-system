const BASE = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('sovind_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Appointments
  createAppointment: (data) =>
    fetch(`${BASE}/appointments/create`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  trackAppointments: (phone) =>
    fetch(`${BASE}/appointments/track/${phone}`, { headers: getHeaders() }).then(r => r.json()),

  getAllAppointments: () =>
    fetch(`${BASE}/appointments/all`, { headers: getHeaders() }).then(r => r.json()),

  updateAppointment: (id, status) =>
    fetch(`${BASE}/appointments/update/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then(r => r.json()),

  // Auth
  login: (data) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  // Feedback
  createFeedback: (data) =>
    fetch(`${BASE}/feedback/create`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  getAllFeedback: () =>
    fetch(`${BASE}/feedback/all`, { headers: getHeaders() }).then(r => r.json()),

  getAllFeedbackAdmin: () =>
    fetch(`${BASE}/feedback/admin/all`, { headers: getHeaders() }).then(r => r.json()),

  approveFeedback: (id) =>
    fetch(`${BASE}/feedback/approve/${id}`, { method: 'PATCH', headers: getHeaders() }).then(r => r.json()),
};
