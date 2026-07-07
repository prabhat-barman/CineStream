import {API_URL} from './config';

export type AuthProvider = 'email' | 'google' | 'apple';

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  provider: AuthProvider;
  providerUserId?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  {method = 'GET', body, token, signal}: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {Accept: 'application/json'};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    throw new ApiError(
      `Cannot reach API at ${API_URL}. Is the backend running?`,
      0,
      err,
    );
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => ({})) : undefined;

  if (!res.ok) {
    const message =
      (payload && typeof payload.error === 'string' && payload.error) ||
      `Request failed with ${res.status}`;
    throw new ApiError(message, res.status, payload?.details);
  }

  return payload as T;
}

export const api = {
  auth: {
    register: (input: {name: string; email: string; password: string}) =>
      request<AuthResponse>('/auth/register', {method: 'POST', body: input}),
    login: (input: {email: string; password: string}) =>
      request<AuthResponse>('/auth/login', {method: 'POST', body: input}),
    me: (token: string) =>
      request<{user: PublicUser}>('/auth/me', {token}),
    socialGoogle: (input: {idToken: string}) =>
      request<AuthResponse>('/auth/social/google', {
        method: 'POST',
        body: input,
      }),
    socialApple: (input: {
      identityToken: string;
      name?: string;
      email?: string;
    }) =>
      request<AuthResponse>('/auth/social/apple', {
        method: 'POST',
        body: input,
      }),
  },
};
