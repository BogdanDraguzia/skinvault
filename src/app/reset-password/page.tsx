'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useResetPasswordMutation } from '@/store/api/skinvaultApi';
import FloatingInput from '@/components/ui/FloatingInput';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [done, setDone]               = useState(false);
  const [error, setError]             = useState('');
  const [doReset, { isLoading }]      = useResetPasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    try {
      await doReset({ token, newPassword: password, confirmPassword: confirm }).unwrap();
      setDone(true);
    } catch {
      setError('Reset failed. The link may have expired.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold font-sans text-white mb-2">Set new password</h1>
        <p className="text-slate-400 text-sm mb-8">Choose a strong password for your account.</p>

        {done ? (
          <div className="space-y-4">
            <div className="hn-success">✓ Password updated successfully!</div>
            <Link href="/login" className="block text-center py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors">
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <FloatingInput
              label="New Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            <FloatingInput
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />

            {error && <div className="hn-alert">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-shimmer btn-press w-full py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60"
              style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
            >
              {isLoading ? 'Saving…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
