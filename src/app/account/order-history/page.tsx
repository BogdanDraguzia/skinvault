'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGetOrdersQuery } from '@/store/api/skinvaultApi';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import type { OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Paid:      'bg-[#06b6d4]/20 text-[#06b6d4] border-[#06b6d4]/30',
  Failed:    'bg-red-500/20 text-red-400 border-red-500/30',
  Cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading } = useGetOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) return <PageLoader />;

  const items = orders ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">Order History</h3>
        <span className="text-xs text-slate-500">{items.length} order{items.length !== 1 ? 's' : ''}</span>
      </div>

      {items.length === 0 ? (
        <div className="glass-card rounded-xl text-center py-16 text-slate-500">
          <p className="text-3xl mb-3">📦</p>
          <p className="mb-4">No orders yet</p>
          <Link href="/" className="text-[#06b6d4] hover:underline text-sm">Browse skins →</Link>
        </div>
      ) : (
        items.map((order) => (
          <div key={order.id} className="glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-mono">{order.id.slice(0, 8)}…</p>
                <p className="text-xs text-slate-500 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
                <span className="text-[#06b6d4] font-bold font-sans">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="p-4 flex flex-wrap gap-3">
              {order.items.map((item) => (
                <div key={item.skinId} className="flex items-center gap-3 glass-card rounded-lg px-3 py-2">
                  <Image
                    src={item.skinImage}
                    alt={item.skinName}
                    width={48}
                    height={36}
                    className="object-contain max-h-9 w-auto"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x36?text=?'; }}
                    unoptimized
                  />
                  <div>
                    <p className="text-xs text-white font-medium leading-snug">{item.skinName}</p>
                    <p className="text-xs text-[#06b6d4]">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
