'use client';

import { useState, useCallback } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FilterBar from '@/components/home/FilterBar';
import SkinCard from '@/components/home/SkinCard';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { useGetSkinsQuery } from '@/store/api/skinvaultApi';
import { getPaginationRange } from '@/lib/utils';
import type { FilterState } from '@/types';

const PAGE_SIZE = 30;

export default function HomePage() {
  const [page, setPage]       = useState(1);
  const [filters, setFilters] = useState<FilterState>({});

  const { data, isLoading, isFetching } = useGetSkinsQuery({
    page,
    pageSize: PAGE_SIZE,
    ...filters,
  });

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const skins      = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;
  const paginationRange = getPaginationRange(page, totalPages);

  return (
    <>
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {!isLoading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">
              {totalCount > 0 ? (
                <>
                  Showing{' '}
                  <span className="text-white font-medium">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)}
                  </span>{' '}
                  of <span className="text-white font-medium">{totalCount}</span> skins
                </>
              ) : (
                'No skins found'
              )}
            </p>
          </div>
        )}

        {isLoading ? (
          <PageLoader />
        ) : skins.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-medium text-white mb-2">No skins found</p>
            <p className="text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-opacity duration-200 ${
              isFetching ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {skins.map((skin, i) => (
              <SkinCard key={skin.id} skin={skin} index={i} featured={i % 8 === 0} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <PageButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PageButton>
            {paginationRange.map((p, i) =>
              p === '...' ? (
                <span key={`e${i}`} className="w-9 text-center text-slate-600">…</span>
              ) : (
                <PageButton key={p} onClick={() => setPage(p as number)} active={page === p}>{p}</PageButton>
              )
            )}
            <PageButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PageButton>
          </div>
        )}
      </div>
    </>
  );
}

function PageButton({
  children, onClick, active, disabled,
}: {
  children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
        active   ? 'bg-[#06b6d4] text-[#0a0e1a]' :
        disabled ? 'text-slate-700 cursor-not-allowed' :
                   'text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
      }`}
    >
      {children}
    </button>
  );
}
