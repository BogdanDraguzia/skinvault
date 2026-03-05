'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGetProfileQuery, useCreateDepositMutation } from '@/store/api/skinvaultApi';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export default function BalancePage() {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [createDeposit, { isLoading: depositing }] = useCreateDepositMutation();

  const [amount, setAmount] = useState('');
  const [error,  setError]  = useState('');

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const val = parseFloat(amount);
    if (!val || val < 5) { setError('Minimum deposit is €5.00'); return; }
    try {
      const res = await createDeposit({ amount: val }).unwrap();
      window.location.href = res.redirectUrl;
    } catch {
      setError('Failed to initiate deposit. Please try again.');
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="glass-card-enhanced rounded-2xl p-8 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">Current Balance</p>
          <div className="flex items-center gap-3">
            <Image src="/images/coin-cyan.svg" alt="Balance" width={36} height={36} />
            <span className="text-4xl font-bold font-sans text-[#06b6d4]">
              {profile ? formatPrice(profile.balance) : '…'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">1 coin = €1.00</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-slate-500 mb-1">Exchange Rate</p>
          <p className="text-white font-semibold">1 € = 1 coin</p>
        </div>
      </div>

      {/* Deposit form */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-white font-semibold mb-5">Add Funds</h3>
        <form onSubmit={handleDeposit} className="space-y-5">
          {/* Preset amounts */}
          <div>
            <label className="block text-xs text-slate-400 mb-3 font-medium">Quick Select</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(preset))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    amount === String(preset)
                      ? 'bg-[#06b6d4] text-[#0a0e1a]'
                      : 'bg-[rgba(255,255,255,0.05)] text-slate-400 hover:text-white border border-[rgba(255,255,255,0.08)]'
                  }`}
                >
                  €{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Custom Amount (€)</label>
            <input
              type="number"
              min={5}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum €5.00"
              className="w-full max-w-xs px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
            />
          </div>

          {/* Payment methods */}
          <div>
            <label className="block text-xs text-slate-400 mb-3 font-medium">Payment Method</label>
            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              {['Visa / Mastercard', 'Google Pay', 'Apple Pay'].map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {error && <div className="hn-alert">{error}</div>}

          <button
            type="submit"
            disabled={depositing || !amount}
            className="btn-shimmer btn-press px-8 py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60 flex items-center gap-2"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
          >
            {depositing && <span className="spinner !w-4 !h-4" />}
            {depositing ? 'Redirecting…' : `Deposit ${amount ? `€${parseFloat(amount).toFixed(2)}` : 'Funds'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
