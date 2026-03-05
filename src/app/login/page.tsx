'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/store/api/skinvaultApi';
import { useAuth } from '@/hooks/useAuth';
import FloatingInput from '@/components/ui/FloatingInput';

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isAuthenticated } = useAuth();
  const [doLogin, { isLoading }] = useLoginMutation();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');

  // If already authenticated, redirect away
  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, redirect, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const result = await doLogin({ email, password }).unwrap();
      login(result);
      router.push(redirect);
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Auth banner */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <Image
          src="/images/auth-banner-tech.svg"
          alt="SkinVault"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/60 to-transparent" />
        <div className="relative z-10 p-12 text-center">
          <div
            className="text-[#06b6d4] font-sans font-bold text-2xl tracking-[0.2em] uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.3em' }}
          >
            SkinVault
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[#06b6d4] hover:text-[#0ea5e9] text-sm mb-6 transition-colors">
              ← Back to market
            </Link>
            <h1 className="text-2xl font-bold font-sans text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your SkinVault account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatingInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />

            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-[#06b6d4] hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && <div className="hn-alert">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-shimmer btn-press w-full py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#06b6d4] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
