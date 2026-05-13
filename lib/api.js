const SESSION_KEY = 'rooms.session.token';

export function getSessionToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token) {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, token);
}

async function request(path, options = {}) {
  const token = getSessionToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'x-session-token': token } : {}),
  };

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Request failed');
  }

  return result;
}

export const api = {
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me'),
  logout: () => request('/api/auth/logout', { method: 'POST', body: '{}' }),
  changePassword: (payload) =>
    request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(payload) }),

  listGroups: () => request('/api/groups'),
  createGroup: (payload) => request('/api/groups', { method: 'POST', body: JSON.stringify(payload) }),
  joinGroup: (payload) => request('/api/groups/join', { method: 'POST', body: JSON.stringify(payload) }),

  listRooms: (groupId) => request(`/api/groups/${groupId}/rooms`),
  createRoom: (groupId, payload) =>
    request(`/api/groups/${groupId}/rooms`, { method: 'POST', body: JSON.stringify(payload) }),

  listMembers: (groupId) => request(`/api/groups/${groupId}/members`),

  listUserGroups: (groupId) => request(`/api/groups/${groupId}/user-groups`),
  createUserGroup: (groupId, payload) =>
    request(`/api/groups/${groupId}/user-groups`, { method: 'POST', body: JSON.stringify(payload) }),

  listInvitations: (groupId) => request(`/api/groups/${groupId}/invitations`),
  createInvitation: (groupId) =>
    request(`/api/groups/${groupId}/invitations`, { method: 'POST', body: '{}' }),

  listBookings: (groupId, params = {}) => {
    const query = new URLSearchParams();
    if (params.date) query.set('date', params.date);
    if (params.roomId) query.set('roomId', params.roomId);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request(`/api/groups/${groupId}/bookings${suffix}`);
  },
  createBooking: (groupId, payload) =>
    request(`/api/groups/${groupId}/bookings`, { method: 'POST', body: JSON.stringify(payload) }),
};
