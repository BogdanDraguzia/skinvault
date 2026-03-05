'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForgotPasswordMutation } from '@/store/api/skinvaultApi';
import FloatingInput from '@/components/ui/FloatingInput';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [doForgot, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      await doForgot({ email }).unwrap();
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-[#06b6d4] hover:text-[#0ea5e9] text-sm mb-8 transition-colors">
          ← Back to login
        </Link>

        <h1 className="text-2xl font-bold font-sans text-white mb-2">Forgot password?</h1>
        <p className="text-slate-400 text-sm mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <div className="hn-success">
            ✓ Reset link sent! Check your inbox and follow the instructions.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatingInput
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />

            {error && <div className="hn-alert">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-shimmer btn-press w-full py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60"
              style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
            >
              {isLoading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
