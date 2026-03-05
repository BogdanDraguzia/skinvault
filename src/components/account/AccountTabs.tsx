'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useGetProfileQuery } from '@/store/api/skinvaultApi';
import { getInitials } from '@/lib/utils';

const TABS = [
  { href: '/account/personal',        label: 'Account' },
  { href: '/account/balance',         label: 'Balance' },
  { href: '/account/payment-history', label: 'Payments' },
  { href: '/account/order-history',   label: 'Orders' },
];

export default function AccountTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth();
  const { data: profile } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero greeting */}
      <div className="glass-card rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[rgba(6,182,212,0.15)] border-2 border-[rgba(6,182,212,0.3)] flex items-center justify-center text-[#06b6d4] text-xl font-bold font-sans">
            {profile ? getInitials(profile.fullName) : '?'}
          </div>
          <div>
            <p className="text-slate-400 text-sm">Welcome back,</p>
            <h2 className="text-white font-bold text-xl font-sans">
              {profile?.fullName ?? '…'}
            </h2>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-white hover:border-[rgba(255,255,255,0.15)] text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-[rgba(255,255,255,0.05)] overflow-x-auto">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                active
                  ? 'text-[#06b6d4] border-[#06b6d4]'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div className="animate-fade-in">{children}</div>
    </div>
  );
}
