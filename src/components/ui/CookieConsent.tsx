'use client';

import { useState, useEffect } from 'react';

const COOKIE_KEY = 'skinvault_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-sm animate-slide-up">
      <div className="glass-card-enhanced rounded-xl p-4 shadow-2xl">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          We use cookies to enhance your experience.{' '}
          <a href="/cookie-policy" className="text-[#06b6d4] hover:underline">
            Cookie Policy
          </a>
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 py-1.5 rounded-lg bg-[#06b6d4] text-[#0a0e1a] text-sm font-semibold hover:bg-[#0ea5e9] transition-colors"
          >
            Accept
          </button>
          <button
            onClick={reject}
            className="flex-1 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-slate-400 text-sm hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
