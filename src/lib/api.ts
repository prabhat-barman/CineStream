import {API_URL} from './config';

// ------------------------------
// Backend contract
// Ref: https://vertical-admin-backend.onrender.com/api-docs
// ------------------------------

export type UserRole = 'MOBILE_USER' | 'STUDENT';
export type UserStatus = 'active' | 'locked' | 'pending_verification';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  instituteId?: string;
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
  instituteId?: string;
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
  // Present only in dev mode (EXPOSE_OTP_IN_RESPONSE=true)
  otp?: string;
};

export type AuthTokenResponseData = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  message?: string;
};

export type ForgotPasswordResponseData = {
  message: string;
  email: string;
  emailSent: boolean;
  otpExpiresInMinutes: number;
  // Present only in dev mode (EXPOSE_OTP_IN_RESPONSE=true)
  otp?: string;
};

export type MessageResponseData = {
  message: string;
};

// Envelope returned by the backend
type ApiSuccessEnvelope<T> = {
  success: true;
  message?: string;
  data: T;
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
  // Overall timeout in ms. Backend is on Render free tier which cold-starts
  // in ~30-60s, so default is generous.
  timeoutMs?: number;
};

async function request<T>(
  path: string,
  {method = 'GET', body, token, signal, timeoutMs = 75_000}: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {Accept: 'application/json'};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Compose the caller-supplied AbortSignal with our own timeout so the
  // request cannot hang forever if the server never responds.
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
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (controller.signal.aborted && !signal?.aborted) {
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
  return okPayload.data;
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
      }),

    login: (input: {email: string; password: string}) =>
      request<AuthTokenResponseData>('/auth/login', {
        method: 'POST',
        body: input,
      }),

    // Social OAuth. NOTE: these endpoints are NOT documented in the current
    // backend Swagger. The frontend calls them assuming this contract; the
    // backend team is expected to implement them as:
    //   POST /auth/oauth/google  { idToken, email?, name? }        -> AuthTokenResponseData
    //   POST /auth/oauth/apple   { identityToken, email?, name? }  -> AuthTokenResponseData
    // Until the backend ships these, calls will fail with a 404 which we
    // surface as a friendly "not enabled yet" message in AuthContext.
    oauthGoogle: (input: {idToken: string; email?: string; name?: string}) =>
      request<AuthTokenResponseData>('/auth/oauth/google', {
        method: 'POST',
        body: input,
      }),

    oauthApple: (input: {
      identityToken: string;
      email?: string;
      name?: string;
    }) =>
      request<AuthTokenResponseData>('/auth/oauth/apple', {
        method: 'POST',
        body: input,
      }),

    // Invalidates the current session server-side (bumps tokenVersion so all
    // existing access + refresh tokens for this user become invalid).
    logout: (input: {token: string}) =>
      request<MessageResponseData | Record<string, never>>('/auth/logout', {
        method: 'POST',
        token: input.token,
      }),

    // Authenticated. Changes password for the current user; server bumps
    // tokenVersion so other sessions get logged out.
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

    // Sends a 6-digit OTP to the email (if account exists). OTP expires in
    // ~10 min. Response is intentionally generic to avoid account enumeration.
    forgotPassword: (input: {email: string}) =>
      request<ForgotPasswordResponseData>('/auth/forgot-password', {
        method: 'POST',
        body: input,
      }),

    // Verifies the OTP from forgot-password and sets a new password.
    resetPassword: (input: {email: string; otp: string; password: string}) =>
      request<MessageResponseData | Record<string, never>>(
        '/auth/reset-password',
        {
          method: 'POST',
          body: input,
        },
      ),
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
    instituteId: u.instituteId,
  };
}
