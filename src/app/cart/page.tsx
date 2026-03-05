'use client';

import { useReducer } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useGetProfileQuery, useCreateOrderMutation, useCheckoutMutation } from '@/store/api/skinvaultApi';
import { formatPrice } from '@/lib/utils';

type PaymentMethod = 'balance' | 'card';

interface CheckoutState {
  step: 1 | 2;
  tradeLink: string;
  payment: PaymentMethod;
  agreed: boolean;
  error: string;
}

type CheckoutAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_TRADE_LINK'; value: string }
  | { type: 'SET_PAYMENT'; value: PaymentMethod }
  | { type: 'TOGGLE_AGREED' }
  | { type: 'SET_ERROR'; message: string };

const initialCheckoutState: CheckoutState = {
  step: 1, tradeLink: '', payment: 'card', agreed: false, error: '',
};

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'NEXT_STEP':      return { ...state, step: 2, error: '' };
    case 'PREV_STEP':      return { ...state, step: 1, error: '' };
    case 'SET_TRADE_LINK': return { ...state, tradeLink: action.value };
    case 'SET_PAYMENT':    return { ...state, payment: action.value };
    case 'TOGGLE_AGREED':  return { ...state, agreed: !state.agreed };
    case 'SET_ERROR':      return { ...state, error: action.message };
  }
}

export default function CartPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const { step, tradeLink, payment, agreed, error } = state;

  const { items, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const { data: profile }   = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  const [createOrder, { isLoading: placingBalance }] = useCreateOrderMutation();
  const [checkout, { isLoading: placingCard }]       = useCheckoutMutation();
  const isPlacing = placingBalance || placingCard;

  const hasEnoughBalance = profile ? profile.balance >= total : false;

  async function handlePlaceOrder() {
    dispatch({ type: 'SET_ERROR', message: '' });
    if (!tradeLink.trim()) { dispatch({ type: 'SET_ERROR', message: 'Please enter your Steam trade link.' }); return; }
    if (!agreed) { dispatch({ type: 'SET_ERROR', message: 'Please accept the Terms of Use.' }); return; }

    const skinIds = items.map((i) => i.id);

    try {
      if (payment === 'balance') {
        await createOrder({ skinIds, steamTradeLink: tradeLink }).unwrap();
        clearCart();
        router.push('/account/order-history');
      } else {
        const res = await checkout({ skinIds, steamTradeLink: tradeLink }).unwrap();
        window.location.href = res.redirectUrl; // external payment provider redirect
      }
    } catch {
      dispatch({ type: 'SET_ERROR', message: 'Order failed. Please try again.' });
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Browse the marketplace and add some skins!</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold hover:bg-[#0ea5e9] transition-colors"
        >
          Browse Skins
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold font-sans text-white mb-8">Shopping Cart</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(['Review Cart', 'Checkout'] as const).map((label, i) => {
          const stepNum = (i + 1) as 1 | 2;
          const active  = step === stepNum;
          const done    = step > stepNum;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm font-medium ${
                active ? 'text-[#06b6d4]' : done ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                <div className={`w-7 h-7 flex items-center justify-center rounded-full border text-xs font-bold ${
                  active ? 'bg-[#06b6d4] border-[#06b6d4] text-[#0a0e1a]' :
                  done   ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                           'border-[rgba(255,255,255,0.1)] text-slate-500'
                }`}>
                  {done ? '✓' : stepNum}
                </div>
                {label}
              </div>
              {i === 0 && <div className="w-12 h-px bg-[rgba(255,255,255,0.08)]" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — items / checkout form */}
        <div className="lg:col-span-2 space-y-4">
          {step === 1 ? (
            <>
              {items.map((item) => (
                <div key={item.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-shrink-0 w-20 h-16 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={80}
                      height={60}
                      className="object-contain max-h-14 w-auto"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x60?text=?'; }}
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-snug truncate">{item.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.exterior} · {item.quality}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#06b6d4] font-bold">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-600 hover:text-red-400 text-xs mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => dispatch({ type: 'NEXT_STEP' })}
                className="btn-shimmer btn-press w-full py-3.5 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm mt-4 hover:bg-[#0ea5e9] transition-colors"
                style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
              >
                Proceed to Checkout →
              </button>
            </>
          ) : (
            <div className="glass-card rounded-xl p-6 space-y-6 animate-fade-in">
              <h3 className="text-white font-semibold">Checkout Details</h3>

              {/* Trade link */}
              <div>
                <label className="block text-xs text-slate-400 mb-2 font-medium">Steam Trade Link</label>
                <input
                  type="url"
                  placeholder="https://steamcommunity.com/tradeoffer/new/?partner=…"
                  value={tradeLink}
                  onChange={(e) => dispatch({ type: 'SET_TRADE_LINK', value: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white placeholder-slate-600 text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-xs text-slate-400 mb-3 font-medium">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'card' as PaymentMethod, label: 'Credit / Debit Card', icon: '💳' },
                    {
                      id: 'balance' as PaymentMethod,
                      label: `Account Balance (€${profile?.balance.toFixed(2) ?? '0.00'})`,
                      icon: '🪙',
                      disabled: !hasEnoughBalance,
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => !m.disabled && dispatch({ type: 'SET_PAYMENT', value: m.id })}
                      disabled={m.disabled}
                      className={`p-3 rounded-xl border text-sm text-left transition-colors ${
                        payment === m.id
                          ? 'border-[#06b6d4] bg-[rgba(6,182,212,0.1)] text-white'
                          : m.disabled
                          ? 'border-[rgba(255,255,255,0.04)] text-slate-700 cursor-not-allowed'
                          : 'border-[rgba(255,255,255,0.08)] text-slate-400 hover:border-[rgba(255,255,255,0.15)]'
                      }`}
                    >
                      <span className="block text-lg mb-1">{m.icon}</span>
                      <span className="block font-medium leading-snug">{m.label}</span>
                      {m.disabled && <span className="text-xs text-red-400 mt-0.5 block">Insufficient balance</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* T&C */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => dispatch({ type: 'TOGGLE_AGREED' })}
                  className="mt-0.5 accent-[#06b6d4]"
                />
                <span className="text-sm text-slate-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#06b6d4] hover:underline">Terms of Use</Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="text-[#06b6d4] hover:underline">Privacy Policy</Link>
                </span>
              </label>

              {error && <div className="hn-alert">{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => dispatch({ type: 'PREV_STEP' })}
                  className="px-5 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] text-slate-400 text-sm hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || !isAuthenticated}
                  className="btn-shimmer btn-press flex-1 py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
                >
                  {isPlacing ? 'Processing…' : !isAuthenticated ? 'Login to Checkout' : 'Place Order'}
                </button>
              </div>

              {!isAuthenticated && (
                <p className="text-center text-sm text-slate-500">
                  <Link href="/login" className="text-[#06b6d4] hover:underline">Log in</Link> to complete your purchase
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right — Order summary */}
        <div>
          <div className="glass-card-enhanced rounded-xl p-5 sticky top-20">
            <h3 className="text-white font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-400 truncate max-w-36">{item.title}</span>
                  <span className="text-white font-medium flex-shrink-0 ml-2">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-4">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#06b6d4] text-lg">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
