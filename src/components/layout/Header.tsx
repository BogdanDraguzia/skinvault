'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useGetProfileQuery } from '@/store/api/skinvaultApi';
import { formatPrice, getInitials } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',     label: 'Market' },
  { href: '/faq',  label: 'FAQ' },
  { href: '/contact', label: 'Support' },
];

export default function Header() {
  const pathname        = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const { count }       = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-[rgba(6,182,212,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.slice(0, 1).map((link) => (
              <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Center logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo-aim.svg"
              alt="SkinVault"
              width={32}
              height={32}
              className="group-hover:opacity-80 transition-opacity"
            />
            <span className="font-sans font-bold text-lg tracking-wide text-white group-hover:text-[#06b6d4] transition-colors">
              SkinVault
            </span>
          </Link>

          {/* Right nav */}
          <div className="hidden md:flex items-center gap-4">
            {NAV_LINKS.slice(1).map((link) => (
              <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </NavLink>
            ))}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-400 hover:text-[#06b6d4] transition-colors"
            >
              <CartIcon />
              {count > 0 && (
                <span className="badge-pulse absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#06b6d4] text-trade-bg text-[10px] font-bold rounded-full">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {isAuthenticated && profile ? (
              <div className="flex items-center gap-3">
                {/* Balance */}
                <Link
                  href="/account/balance"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] hover:bg-[rgba(6,182,212,0.15)] transition-colors text-sm"
                >
                  <Image src="/images/coin-cyan.svg" alt="Balance" width={16} height={16} />
                  <span className="text-[#06b6d4] font-semibold">
                    {formatPrice(profile.balance)}
                  </span>
                </Link>

                {/* Avatar dropdown */}
                <Link
                  href="/account/personal"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4] text-xs font-bold">
                    {getInitials(profile.fullName)}
                  </div>
                  <span className="text-white hidden lg:block max-w-24 truncate">
                    {profile.fullName.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Logout"
                >
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-shimmer px-4 py-1.5 text-sm font-semibold rounded-lg bg-[#06b6d4] text-[#0a0e1a] hover:bg-[#0ea5e9] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-[rgba(6,182,212,0.1)] animate-fade-in-down">
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-slate-300 hover:text-[#06b6d4] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
              <Link
                href="/cart"
                className="flex items-center gap-2 text-slate-300 hover:text-[#06b6d4] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <CartIcon /> Cart {count > 0 && `(${count})`}
              </Link>
            </div>
            {!isAuthenticated && (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 rounded-lg border border-[rgba(6,182,212,0.3)] text-[#06b6d4] text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2 rounded-lg bg-[#06b6d4] text-[#0a0e1a] font-semibold text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors pb-1 ${
        active ? 'text-[#06b6d4]' : 'text-slate-400 hover:text-white'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#06b6d4]" />
      )}
    </Link>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
