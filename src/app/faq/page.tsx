'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  { q: 'How do I buy a skin?', a: 'Browse the marketplace, click "Add to Cart" on a skin you like, then proceed to checkout. You can pay with card or your account balance.' },
  { q: 'How fast is delivery?', a: 'After payment confirmation, your Steam trade offer is typically sent within 5–15 minutes. Most deliveries complete within 30 minutes.' },
  { q: 'Is my payment secure?', a: 'Yes. All payments are processed via Transferty, a secure payment gateway. We never store your card details.' },
  { q: 'Can I get a refund?', a: 'We offer refunds for items that were incorrectly described. Contact our support team within 48 hours of purchase.' },
  { q: 'What is a Steam Trade Link?', a: 'A trade link allows us to send items directly to your Steam inventory without a friend request. You can find it in your Steam inventory settings.' },
  { q: 'What currencies are supported?', a: 'We currently support EUR. Your account balance is in euros, and 1 coin = €1.00.' },
  { q: 'How do I top up my balance?', a: 'Go to Account → Balance and enter the amount you want to add. You can use Visa, Mastercard, Google Pay, or Apple Pay.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold font-sans text-white mb-2">Frequently Asked Questions</h1>
      <p className="text-slate-400 mb-10">Everything you need to know about SkinVault.</p>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="glass-card rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium text-sm hover:text-[#06b6d4] transition-colors"
            >
              {item.q}
              <span className={`flex-shrink-0 ml-4 text-[#06b6d4] transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed animate-fade-in border-t border-[rgba(255,255,255,0.04)] pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
