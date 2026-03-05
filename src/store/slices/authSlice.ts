import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = 'skinvault_token';

function loadToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function parseJwtPayload(token: string): { exp?: number; fullName?: string; email?: string } {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function isTokenValid(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

const savedToken = loadToken();
const validToken = savedToken && isTokenValid(savedToken) ? savedToken : null;

// Sync localStorage token to cookie on startup (needed for proxy route guard)
if (typeof window !== 'undefined') {
  if (validToken) {
    document.cookie = `${TOKEN_KEY}=${validToken}; path=/; SameSite=Lax`;
  } else {
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

const initialState: AuthState = {
  token: validToken,
  user: null,
  isAuthenticated: !!validToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user?: UserProfile }>
    ) {
      const { token, user } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      if (user) state.user = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        // Also set a cookie so the server-side proxy can read it
        document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
      }
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
