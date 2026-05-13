const DEFAULT_API_ROOT = 'rooms-app-api.prairiedog-stargazer.ts.net';

const normalizeApiRoot = (rawRoot) => {
  if (!rawRoot) return DEFAULT_API_ROOT;
  return rawRoot.replace(/^https?:\/\//, '').replace(/\/+$/, '');
};

export function getApiRoot() {
  if (typeof window === 'undefined') {
    return normalizeApiRoot(process.env.NEXT_PUBLIC_API_ROOT);
  }

  const localOverride = window.localStorage.getItem('apiRoot');
  return normalizeApiRoot(localOverride || process.env.NEXT_PUBLIC_API_ROOT);
}

export function getApiBaseUrl() {
  return `https://${getApiRoot()}`;
}

export function getWsBaseUrl() {
  return `wss://${getApiRoot()}`;
}

export async function pingBackend() {
  const response = await fetch(getApiBaseUrl());
  if (!response.ok) {
    throw new Error('Backend is not reachable.');
  }
  return true;
}

export async function loginWithCredentials(payload) {
  const response = await fetch(`${getApiBaseUrl()}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }

  return result;
}

export async function startSession({ authTokenId, ip, sessionType }) {
  const response = await fetch(`${getApiBaseUrl()}/start-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      authTokenId,
      ip,
      ...(sessionType ? { sessionType } : {}),
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Failed to start session');
  }

  return result;
}

export async function getPublicIpV4() {
  const response = await fetch('https://api.ipify.org?format=json');
  if (!response.ok) {
    throw new Error('Could not resolve public IP.');
  }

  const result = await response.json();
  return result.ip;
}
