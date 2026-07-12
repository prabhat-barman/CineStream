import {API_URL} from './config';

// ------------------------------
// Backend contract
// Ref: https://vertical-admin-backend.onrender.com/api-docs
// Frontend guide: docs/MOBILE_API.md (this repo's backend)
// ------------------------------

export type UserRole = 'MOBILE_USER' | 'STUDENT';
export type UserStatus = 'active' | 'locked' | 'pending_verification';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  instituteId?: string | null;
};

// UI-friendly user shape used throughout the app.
export type AuthProvider = 'email' | 'google' | 'apple';

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole | 'admin' | 'user';
  provider: AuthProvider;
  emailVerified: boolean;
  status?: UserStatus;
  instituteId?: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SignUpResponseData = {
  userId: string;
  email: string;
  role: 'MOBILE_USER';
  status: 'pending_verification';
  emailVerified: boolean;
  name: string;
  phone?: string;
  emailSent: boolean;
  otpExpiresInMinutes: number;
  message: string;
  otp?: string;
};

export type AuthTokenResponseData = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  message?: string;
};

export type RefreshResponseData = {
  accessToken: string;
  refreshToken: string;
};

export type ForgotPasswordResponseData = {
  message: string;
  email: string;
  emailSent: boolean;
  otpExpiresInMinutes: number;
  otp?: string;
};

export type ResendOtpResponseData = ForgotPasswordResponseData;

export type MessageResponseData = {message: string};

// ------------------------------
// Profile
// ------------------------------

export type LinkedProvider = {
  provider: 'google' | 'apple';
  linkedAt: string;
};

export type MobileUserProfile = {
  userId: string;
  email: string;
  role: 'MOBILE_USER';
  status: UserStatus;
  emailVerified: boolean;
  fullName: string;
  phone?: string | null;
  subscriptionStatus?: string;
  linkedProviders?: LinkedProvider[];
  createdAt?: string;
  updatedAt?: string;
};

export type MeResponseData =
  | (MobileUserProfile & {name?: never})
  | AuthUser;

// ------------------------------
// Content
// ------------------------------

export type WebseriesStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type Webseries = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  coverImage?: string;
  language?: string;
  ageRating?: string;
  genres?: string[];
  tags?: string[];
  isPremium?: boolean;
  totalEpisodes?: number;
  status: WebseriesStatus;
  releaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  cast?: Actor[]; // populated on /webseries/:id
};

export type EpisodeStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type Episode = {
  _id: string;
  webSeriesId: string;
  title: string;
  description?: string;
  episodeNumber: number;
  orderIndex?: number;
  duration?: number; // seconds
  videoUrl?: string;
  thumbnail?: string;
  status: EpisodeStatus;
  releaseDate?: string;
};

export type Actor = {
  _id: string;
  name: string;
  bio?: string;
  photo?: string;
  socialLinks?: Record<string, string>;
  gallery?: string[];
  skills?: string[];
};

export type PageMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PageMeta;
};

// ------------------------------
// Response envelope
// ------------------------------

type ApiSuccessEnvelope<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: PageMeta;
};

type ApiErrorEnvelope = {
  success: false;
  message?: string;
  errors?: Array<{
    message?: string;
    field?: string;
    property?: string;
    constraints?: string[] | Record<string, string>;
    [k: string]: unknown;
  }>;
};

function extractErrorMessage(env?: ApiErrorEnvelope, fallback?: string): string {
  const first = env?.errors?.[0];
  if (first) {
    if (typeof first.message === 'string' && first.message) {
      return first.message;
    }
    const c = first.constraints;
    if (Array.isArray(c) && c.length && typeof c[0] === 'string') {
      return c[0];
    }
    if (c && typeof c === 'object') {
      const values = Object.values(c).filter(v => typeof v === 'string');
      if (values.length) {
        return values[0] as string;
      }
    }
  }
  return env?.message || fallback || 'Request failed';
}

// ------------------------------
// Errors
// ------------------------------

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

// Thrown when the server hits its global rate limit (HTTP 429). The caller
// can inspect `retryAfterMs` and either wait or show a friendly message.
export class RateLimitError extends ApiError {
  retryAfterMs: number;
  retryAt: Date;
  constructor(message: string, retryAfterMs: number, details?: unknown) {
    super(message, 429, details);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
    this.retryAt = new Date(Date.now() + retryAfterMs);
  }
}

// ------------------------------
// Session bridge — plugged in by AuthContext at mount so the request
// pipeline can auto-refresh tokens and notify on session death.
// ------------------------------

export type SessionBridge = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onTokensRefreshed: (tokens: AuthTokens) => void | Promise<void>;
  onSessionExpired: () => void | Promise<void>;
};

let sessionBridge: SessionBridge | null = null;

export function configureAuth(bridge: SessionBridge | null): void {
  sessionBridge = bridge;
}

// ------------------------------
// Retry + backoff
// ------------------------------

const RETRY_MAX_ATTEMPTS = 3; // 1 original + up to 2 retries
const RETRY_BASE_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Full jitter exponential backoff: sleep = random(0, base * 2^attempt)
function backoffDelay(attempt: number): number {
  const cap = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
  return Math.floor(Math.random() * cap);
}

// Retriable HTTP statuses. 429 is handled separately (no auto-retry — server
// asked us to slow down). 5xx and network errors (status 0) are retriable.
function isRetriableStatus(status: number): boolean {
  if (status === 0) {
    return true;
  }
  if (status === 408 || status === 425) {
    return true;
  }
  if (status >= 500 && status < 600 && status !== 501) {
    return true;
  }
  return false;
}

// GET is always safe to retry. Non-idempotent POSTs are still safe to retry
// when the request never reached the server (network error / timeout — status
// 0), because the server never processed the first attempt.
function shouldRetry(
  status: number,
  method: HttpMethod,
  attempt: number,
): boolean {
  if (attempt >= RETRY_MAX_ATTEMPTS - 1) {
    return false;
  }
  if (!isRetriableStatus(status)) {
    return false;
  }
  if (method === 'GET' || method === 'HEAD') {
    return true;
  }
  // Non-idempotent verbs: only retry when server never saw the request.
  return status === 0;
}

// ------------------------------
// Single-flight refresh
// ------------------------------

let refreshInFlight: Promise<AuthTokens | null> | null = null;

async function performRefresh(): Promise<AuthTokens | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }
  const bridge = sessionBridge;
  const refreshToken = bridge?.getRefreshToken();
  if (!bridge || !refreshToken) {
    return null;
  }
  refreshInFlight = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);
      let res: Response;
      try {
        res = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({refreshToken}),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
      if (!res.ok) {
        return null;
      }
      const json = (await res.json().catch(() => undefined)) as
        | ApiSuccessEnvelope<RefreshResponseData>
        | undefined;
      if (!json?.success || !json.data?.accessToken || !json.data?.refreshToken) {
        return null;
      }
      const tokens: AuthTokens = {
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      };
      await bridge.onTokensRefreshed(tokens);
      return tokens;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

// ------------------------------
// Core request
// ------------------------------

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
  signal?: AbortSignal;
  // Backend is on Render free tier which cold-starts in ~30-60s, so default
  // is generous. Set lower for interactive flows if you want to fail fast.
  timeoutMs?: number;
  // If true, the request will not attempt an automatic 401 refresh. Used by
  // the refresh call itself to avoid recursion, and by explicit login flows
  // where a 401 is a legitimate "wrong password" signal.
  skipAuthRefresh?: boolean;
};

type EnvelopeResult<T> = {
  data: T;
  meta?: PageMeta;
};

function buildUrl(
  path: string,
  query: RequestOptions['query'],
): string {
  if (!query) {
    return `${API_URL}${path}`;
  }
  const params: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  }
  if (!params.length) {
    return `${API_URL}${path}`;
  }
  const sep = path.includes('?') ? '&' : '?';
  return `${API_URL}${path}${sep}${params.join('&')}`;
}

async function attemptOnce<T>(
  path: string,
  method: HttpMethod,
  body: unknown,
  query: RequestOptions['query'],
  token: string | null | undefined,
  signal: AbortSignal | undefined,
  timeoutMs: number,
): Promise<EnvelopeResult<T>> {
  const headers: Record<string, string> = {Accept: 'application/json'};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Compose caller-supplied AbortSignal with our own timeout so the request
  // cannot hang forever if the server never responds.
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onExternalAbort);
    }
  }
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    const externallyAborted = signal?.aborted === true;
    if (externallyAborted) {
      throw new ApiError('Request cancelled', 0, err);
    }
    if (controller.signal.aborted) {
      throw new ApiError(
        'The server took too long to respond. It may be waking up — please try again in a few seconds.',
        0,
        err,
      );
    }
    throw new ApiError(
      'Cannot reach the server. Please check your internet connection.',
      0,
      err,
    );
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onExternalAbort);
    }
  }

  // 429 — surface immediately with retry hint. No auto-retry: the doc says
  // "Backoff, retry after 15 min" which is a UI decision, not a burst retry.
  if (res.status === 429) {
    const reset = res.headers.get('RateLimit-Reset');
    const retryAfter = res.headers.get('Retry-After');
    let retryAfterMs = 60_000;
    if (reset) {
      const n = Number(reset);
      if (Number.isFinite(n) && n > 0) {
        // IETF header: seconds until the current window resets.
        retryAfterMs = n * 1000;
      }
    } else if (retryAfter) {
      const n = Number(retryAfter);
      if (Number.isFinite(n) && n > 0) {
        retryAfterMs = n * 1000;
      }
    }
    let details: unknown;
    try {
      details = await res.json();
    } catch {
      // ignore
    }
    throw new RateLimitError(
      'Too many requests. Please wait a moment and try again.',
      retryAfterMs,
      details,
    );
  }

  const isJson = res.headers
    .get('content-type')
    ?.toLowerCase()
    .includes('application/json');
  const payload = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const errPayload = payload as ApiErrorEnvelope | undefined;
    const message = extractErrorMessage(
      errPayload,
      `Request failed with ${res.status}`,
    );
    throw new ApiError(message, res.status, errPayload?.errors);
  }

  const okPayload = payload as ApiSuccessEnvelope<T> | undefined;
  if (!okPayload || !okPayload.success) {
    throw new ApiError(
      okPayload?.message || 'Unexpected response from server',
      res.status,
      okPayload,
    );
  }
  return {data: okPayload.data, meta: okPayload.meta};
}

async function requestEnvelope<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<EnvelopeResult<T>> {
  const {
    method = 'GET',
    body,
    query,
    token,
    signal,
    timeoutMs = 75_000,
    skipAuthRefresh,
  } = opts;

  let currentToken = token;
  let refreshAttempted = false;
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt < RETRY_MAX_ATTEMPTS; attempt++) {
    try {
      return await attemptOnce<T>(
        path,
        method,
        body,
        query,
        currentToken,
        signal,
        timeoutMs,
      );
    } catch (err) {
      if (!(err instanceof ApiError)) {
        throw err;
      }
      lastError = err;

      // 401 → try one refresh, then retry the ORIGINAL call once.
      if (
        err.status === 401 &&
        !skipAuthRefresh &&
        !refreshAttempted &&
        sessionBridge?.getRefreshToken()
      ) {
        refreshAttempted = true;
        const newTokens = await performRefresh();
        if (newTokens) {
          currentToken = newTokens.accessToken;
          continue; // retry with new token, same attempt slot
        }
        // Refresh failed. Wipe session and surface the original 401.
        await sessionBridge?.onSessionExpired();
        throw err;
      }

      // RateLimitError is thrown directly by attemptOnce — never retried.
      if (err instanceof RateLimitError) {
        throw err;
      }

      if (signal?.aborted) {
        throw err;
      }

      if (shouldRetry(err.status, method, attempt)) {
        await sleep(backoffDelay(attempt));
        continue;
      }
      throw err;
    }
  }

  // Loop exit: exhausted retries.
  throw lastError ?? new ApiError('Request failed', 0);
}

// ------------------------------
// Public helpers
// ------------------------------

async function request<T>(path: string, opts?: RequestOptions): Promise<T> {
  const {data} = await requestEnvelope<T>(path, opts);
  return data;
}

async function requestPaginated<T>(
  path: string,
  opts?: RequestOptions,
): Promise<Paginated<T>> {
  const {data, meta} = await requestEnvelope<T[]>(path, opts);
  return {
    data,
    meta: meta ?? {
      total: data.length,
      page: 1,
      limit: data.length,
      totalPages: 1,
    },
  };
}

// ------------------------------
// Endpoints
// ------------------------------

export const api = {
  auth: {
    signUp: (input: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
    }) =>
      request<SignUpResponseData>('/auth/ott/signup', {
        method: 'POST',
        body: input,
      }),

    verifyOtp: (input: {email: string; otp: string}) =>
      request<AuthTokenResponseData>('/auth/ott/verify-otp', {
        method: 'POST',
        body: input,
        // A failed OTP is a legitimate 401/400 — do NOT try to refresh a
        // (nonexistent) session token here.
        skipAuthRefresh: true,
      }),

    resendOtp: (input: {email: string}) =>
      request<ResendOtpResponseData>('/auth/ott/resend-otp', {
        method: 'POST',
        body: input,
      }),

    login: (input: {email: string; password: string}) =>
      request<AuthTokenResponseData>('/auth/login', {
        method: 'POST',
        body: input,
        skipAuthRefresh: true,
      }),

    // Social OAuth. Backend accepts { idToken, email?, name? } and returns
    // the standard login token envelope. See docs/MOBILE_API.md.
    oauthGoogle: (input: {idToken: string; email?: string; name?: string}) =>
      request<AuthTokenResponseData>('/auth/oauth/google', {
        method: 'POST',
        body: input,
        skipAuthRefresh: true,
      }),

    oauthApple: (input: {
      identityToken: string;
      email?: string;
      name?: string;
    }) =>
      request<AuthTokenResponseData>('/auth/oauth/apple', {
        method: 'POST',
        body: input,
        skipAuthRefresh: true,
      }),

    // Exchanges a refresh token for a new access + refresh pair. Rarely
    // called directly — the request pipeline handles this transparently on
    // 401. Exposed for completeness / edge cases.
    refresh: (input: {refreshToken: string}) =>
      request<RefreshResponseData>('/auth/refresh', {
        method: 'POST',
        body: input,
        skipAuthRefresh: true,
      }),

    logout: (input: {token: string}) =>
      request<MessageResponseData | Record<string, never>>('/auth/logout', {
        method: 'POST',
        token: input.token,
        // If the token is already invalid we don't want to loop through
        // refresh — the user is logging out anyway.
        skipAuthRefresh: true,
      }),

    // Current authenticated user. Role-aware — for MOBILE_USER returns
    // fullName + phone + subscriptionStatus etc.
    me: (input: {token: string}) =>
      request<MeResponseData>('/auth/me', {
        method: 'GET',
        token: input.token,
      }),

    changePassword: (input: {
      token: string;
      currentPassword: string;
      newPassword: string;
    }) =>
      request<MessageResponseData | Record<string, never>>(
        '/auth/change-password',
        {
          method: 'POST',
          token: input.token,
          body: {
            currentPassword: input.currentPassword,
            newPassword: input.newPassword,
          },
        },
      ),

    forgotPassword: (input: {email: string}) =>
      request<ForgotPasswordResponseData>('/auth/forgot-password', {
        method: 'POST',
        body: input,
      }),

    resetPassword: (input: {email: string; otp: string; password: string}) =>
      request<MessageResponseData | Record<string, never>>(
        '/auth/reset-password',
        {
          method: 'POST',
          body: input,
        },
      ),
  },

  profile: {
    // GET /mobile-users/profile — full composed profile.
    get: (input: {token: string; signal?: AbortSignal}) =>
      request<MobileUserProfile>('/mobile-users/profile', {
        method: 'GET',
        token: input.token,
        signal: input.signal,
      }),

    // PUT /mobile-users/profile — update fullName and/or phone. At least
    // one field must be provided; backend returns 400 on empty body.
    update: (input: {
      token: string;
      fullName?: string;
      phone?: string;
    }) => {
      const body: Record<string, string> = {};
      if (input.fullName !== undefined) {
        body.fullName = input.fullName;
      }
      if (input.phone !== undefined) {
        body.phone = input.phone;
      }
      return request<MobileUserProfile>('/mobile-users/profile', {
        method: 'PUT',
        token: input.token,
        body,
      });
    },
  },

  webseries: {
    list: (input: {
      token: string;
      status?: WebseriesStatus;
      genre?: string;
      search?: string;
      page?: number;
      limit?: number;
      signal?: AbortSignal;
    }) =>
      requestPaginated<Webseries>('/webseries', {
        method: 'GET',
        token: input.token,
        signal: input.signal,
        query: {
          status: input.status,
          genre: input.genre,
          search: input.search,
          page: input.page,
          limit: input.limit,
        },
      }),

    get: (input: {token: string; id: string; signal?: AbortSignal}) =>
      request<Webseries>(`/webseries/${encodeURIComponent(input.id)}`, {
        method: 'GET',
        token: input.token,
        signal: input.signal,
      }),
  },

  episodes: {
    list: (input: {
      token: string;
      webSeriesId: string;
      page?: number;
      limit?: number;
      signal?: AbortSignal;
    }) =>
      requestPaginated<Episode>('/episodes', {
        method: 'GET',
        token: input.token,
        signal: input.signal,
        query: {
          webSeriesId: input.webSeriesId,
          page: input.page,
          limit: input.limit,
        },
      }),

    get: (input: {token: string; id: string; signal?: AbortSignal}) =>
      request<Episode>(`/episodes/${encodeURIComponent(input.id)}`, {
        method: 'GET',
        token: input.token,
        signal: input.signal,
      }),
  },

  actors: {
    list: (input: {
      token: string;
      page?: number;
      limit?: number;
      search?: string;
      signal?: AbortSignal;
    }) =>
      requestPaginated<Actor>('/actors', {
        method: 'GET',
        token: input.token,
        signal: input.signal,
        query: {
          page: input.page,
          limit: input.limit,
          search: input.search,
        },
      }),

    get: (input: {token: string; id: string; signal?: AbortSignal}) =>
      request<Actor>(`/actors/${encodeURIComponent(input.id)}`, {
        method: 'GET',
        token: input.token,
        signal: input.signal,
      }),
  },
};

// ------------------------------
// Adapters
// ------------------------------

export function toPublicUser(u: AuthUser): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    provider: 'email',
    emailVerified: u.status === 'active',
    status: u.status,
    instituteId: u.instituteId ?? null,
  };
}

// /auth/me is role-aware. For MOBILE_USER the backend returns fullName +
// phone in place of the flat `name` field.
export function mePayloadToPublicUser(payload: MeResponseData): PublicUser {
  if ('fullName' in payload && payload.fullName) {
    return {
      id: payload.userId,
      name: payload.fullName,
      email: payload.email,
      role: payload.role,
      provider: 'email',
      emailVerified: payload.emailVerified ?? payload.status === 'active',
      status: payload.status,
      instituteId: null,
    };
  }
  return toPublicUser(payload as AuthUser);
}
