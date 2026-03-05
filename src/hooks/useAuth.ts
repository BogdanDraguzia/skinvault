'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '@/store/slices/authSlice';
import { selectCurrentUser, selectIsAuthenticated, selectToken } from '@/store/slices/authSlice';
import type { LoginResponse, UserProfile } from '@/types';

export function useAuth() {
  const dispatch        = useAppDispatch();
  const router          = useRouter();
  const user            = useAppSelector(selectCurrentUser);
  const token           = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  function login(response: LoginResponse) {
    const profile: UserProfile = {
      id:       response.userId,
      email:    response.email,
      fullName: response.fullName,
      balance:  0,
    };
    dispatch(setCredentials({ token: response.token, user: profile }));
  }

  function logout() {
    dispatch(logoutAction());
    router.push('/login');
  }

  return { user, token, isAuthenticated, login, logout };
}
