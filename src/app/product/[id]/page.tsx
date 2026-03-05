'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetSkinByIdQuery, useGetSkinsQuery } from '@/store/api/skinvaultApi';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getExteriorClass, getQualityClass, getPopularityScore } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import SkinCard from '@/components/home/SkinCard';

export default function SkinDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const skinId = parseInt(id, 10);

  const [activeTab, setActiveTab] = useState<'specs' | 'similar'>('specs');
  const { addToCart, removeFromCart, isInCart } = useCart();

  const { data: skin, isLoading, isError } = useGetSkinByIdQuery(skinId);
  const { data: similar } = useGetSkinsQuery(
    { type: skin?.type, pageSize: 6 },
    { skip: !skin?.type }
  );

  const inCart = skin ? isInCart(skin.id) : false;

  if (isLoading) return <PageLoader />;
  if (isError || !skin) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-xl mb-4">Skin not found</p>
        <Link href="/" className="text-[#06b6d4] hover:underline">← Back to market</Link>
      </div>
    );
  }

  const popularity = getPopularityScore(skin.price);
  const similarSkins = similar?.items.filter((s) => s.id !== skin.id).slice(0, 5) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-[#06b6d4] transition-colors">Market</Link>
        <span>/</span>
        <span className="text-slate-400">{skin.type}</span>
        <span>/</span>
        <span className="text-white truncate max-w-48">{skin.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Image */}
        <div>
          <div className="glass-card rounded-2xl p-8 flex items-center justify-center relative overflow-hidden" style={{ minHeight: '360px' }}>
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url(${skin.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(40px)' }}
            />
            <Image
              src={skin.imageUrl}
              alt={skin.title}
              width={320}
              height={240}
              className="relative z-10 object-contain max-h-56 w-auto drop-shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/320x240?text=No+Image'; }}
              unoptimized
            />

            {/* Availability badge */}
            <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold ${
              skin.isAvailable ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {skin.isAvailable ? '● Available' : '● Sold Out'}
            </div>
          </div>

          {/* Popularity */}
          <div className="mt-4 glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Popularity</span>
              <span className="text-sm text-[#06b6d4] font-semibold">{popularity}%</span>
            </div>
            <div className="w-full h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${popularity}%`, background: 'linear-gradient(90deg, #0ea5e9, #06b6d4)' }}
              />
            </div>
          </div>
        </div>

        {/* Right — Info */}
        <div className="space-y-5">
          {/* Quality + title */}
          <div>
            <p className={`text-sm font-medium mb-1 ${getQualityClass(skin.quality)}`}>{skin.quality}</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white leading-tight">{skin.title}</h1>
          </div>

          {/* Price card */}
          <div className="glass-card-enhanced rounded-xl p-5">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-[#06b6d4] font-sans">{formatPrice(skin.price)}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">1 coin = €1.00 · Instant delivery</p>

            {skin.isAvailable ? (
              <button
                onClick={() => inCart ? removeFromCart(skin.id) : addToCart(skin)}
                className={`btn-shimmer btn-press w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  inCart
                    ? 'bg-[rgba(6,182,212,0.15)] text-[#06b6d4] border border-[rgba(6,182,212,0.4)] hover:bg-[rgba(6,182,212,0.2)]'
                    : 'bg-[#06b6d4] text-[#0a0e1a] hover:bg-[#0ea5e9]'
                }`}
                style={!inCart ? { boxShadow: '0 0 20px rgba(6,182,212,0.3)' } : undefined}
              >
                {inCart ? '✓ Remove from Cart' : 'Add to Cart'}
              </button>
            ) : (
              <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-[rgba(255,255,255,0.04)] text-slate-600 cursor-not-allowed">
                Sold Out
              </button>
            )}

            {inCart && (
              <Link
                href="/cart"
                className="mt-3 w-full flex items-center justify-center py-2.5 rounded-xl border border-[rgba(6,182,212,0.3)] text-[#06b6d4] text-sm font-semibold hover:bg-[rgba(6,182,212,0.08)] transition-colors"
              >
                View Cart →
              </Link>
            )}
          </div>

          {/* Exterior badge */}
          {skin.exterior && skin.exterior !== 'Not Painted' && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${getExteriorClass(skin.exterior)}`}>
              <span className="font-medium">{skin.exterior}</span>
            </div>
          )}

          {/* Delivery timeline */}
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">Delivery Timeline</p>
            <div className="space-y-2">
              {[
                { label: 'Payment Confirmed', time: 'Instant' },
                { label: 'Steam Trade Sent', time: '5–15 min' },
                { label: 'Skins Delivered', time: '15–30 min' },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[rgba(6,182,212,0.15)] border border-[rgba(6,182,212,0.3)] flex items-center justify-center text-[#06b6d4] text-[10px] font-bold">{i + 1}</div>
                    <span className="text-xs text-slate-400">{step.label}</span>
                  </div>
                  <span className="text-xs text-[#06b6d4] font-medium">{step.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 mb-6 border-b border-[rgba(255,255,255,0.05)]">
          {(['specs', 'similar'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-[#06b6d4] border-[#06b6d4]'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab === 'specs' ? 'Specifications' : `Similar Items (${similarSkins.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'specs' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
            {[
              { label: 'Type',     value: skin.type },
              { label: 'Quality',  value: skin.quality },
              { label: 'Exterior', value: skin.exterior || 'N/A' },
              { label: 'Category', value: skin.category },
              { label: 'Price',    value: formatPrice(skin.price) },
              { label: 'Status',   value: skin.isAvailable ? 'Available' : 'Sold Out' },
            ].map((spec) => (
              <div key={spec.label} className="glass-card rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">{spec.label}</p>
                <p className="text-sm font-semibold text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
            {similarSkins.map((s, i) => (
              <SkinCard key={s.id} skin={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
