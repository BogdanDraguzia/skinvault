'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/store/api/skinvaultApi';
import FloatingInput from '@/components/ui/FloatingInput';
import { getApiErrorMessage } from '@/lib/utils';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (password.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: 'Weak',   color: 'bg-red-500' },
    { label: 'Fair',   color: 'bg-orange-500' },
    { label: 'Good',   color: 'bg-yellow-500' },
    { label: 'Strong', color: 'bg-emerald-500' },
  ];
  return { score, ...map[score - 1] ?? map[0] };
}

export default function RegisterPage() {
  const router = useRouter();
  const [doRegister, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phoneCode: '+1', phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed]             = useState(false);
  const [error, setError]               = useState('');

  const strength = getPasswordStrength(form.password);

  function updateField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please accept the Terms of Use.'); return; }
    try {
      await doRegister({
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneCode: form.phoneCode || undefined,
        phoneNumber: form.phoneNumber || undefined,
      }).unwrap();
      router.push('/login?registered=1');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left banner */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <Image src="/images/auth-banner-tech.svg" alt="SkinVault" fill className="object-cover" />
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

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[#06b6d4] hover:text-[#0ea5e9] text-sm mb-6 transition-colors">
              ← Back to market
            </Link>
            <h1 className="text-2xl font-bold font-sans text-white">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Join thousands of traders on SkinVault</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput label="First Name" value={form.firstName} onChange={(v) => updateField('firstName', v)} />
              <FloatingInput label="Last Name"  value={form.lastName}  onChange={(v) => updateField('lastName', v)} />
            </div>

            <FloatingInput label="Email" type="email" value={form.email} onChange={(v) => updateField('email', v)} autoComplete="email" />

            {/* Password */}
            <div>
              <div className="relative">
                <FloatingInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(v) => updateField('password', v)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-4 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-[rgba(255,255,255,0.06)]'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{strength.label} password</p>
                </div>
              )}
            </div>

            <FloatingInput
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(v) => updateField('confirmPassword', v)}
            />

            {/* T&C */}
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-[#06b6d4]" />
              <span className="text-sm text-slate-400">
                I agree to the{' '}
                <Link href="/terms" className="text-[#06b6d4] hover:underline">Terms of Use</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-[#06b6d4] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {error && <div className="hn-alert">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-shimmer btn-press w-full py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60 mt-2"
              style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
            >
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#06b6d4] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

