'use client';

import { useGetTransactionsQuery } from '@/store/api/skinvaultApi';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import type { TransactionType, TransactionStatus } from '@/types';

const TYPE_STYLES: Record<TransactionType, { icon: string; color: string }> = {
  Deposit:    { icon: '↓', color: 'text-emerald-400' },
  Withdrawal: { icon: '↑', color: 'text-red-400' },
  Purchase:   { icon: '🛒', color: 'text-[#06b6d4]' },
  Sale:       { icon: '💰', color: 'text-yellow-400' },
};

const STATUS_STYLES: Record<TransactionStatus, string> = {
  Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Failed:    'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function PaymentHistoryPage() {
  const { isAuthenticated } = useAuth();
  const { data: transactions, isLoading } = useGetTransactionsQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) return <PageLoader />;

  const items = transactions ?? [];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[rgba(255,255,255,0.05)]">
        <h3 className="text-white font-semibold">Payment History</h3>
        <p className="text-xs text-slate-500 mt-0.5">{items.length} transaction{items.length !== 1 ? 's' : ''}</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-3xl mb-3">💳</p>
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          {items.map((tx) => {
            const { icon, color } = TYPE_STYLES[tx.type] ?? { icon: '?', color: 'text-slate-400' };
            const statusClass     = STATUS_STYLES[tx.status] ?? '';
            return (
              <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-sm ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${color}`}>{tx.type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusClass}`}>
                    {tx.status}
                  </span>
                  <span className={`font-bold font-sans ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.type === 'Deposit' ? '+' : ''}{formatPrice(tx.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
