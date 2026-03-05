'use client';

import { useState, useCallback } from 'react';
import type { FilterState } from '@/types';

const WEAPON_TYPES = ['Knife', 'Pistol', 'Rifle', 'SMG', 'Shotgun', 'Sniper Rifle', 'Machinegun'];
const QUALITIES    = ['Consumer Grade', 'Industrial Grade', 'Mil-Spec Grade', 'Restricted', 'Classified', 'Covert'];
const EXTERIORS    = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterBar({ filters, onFilterChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  const update = useCallback(
    (patch: Partial<FilterState>) => {
      onFilterChange({ ...filters, ...patch });
    },
    [filters, onFilterChange]
  );

  const activeCount = [
    filters.type,
    filters.quality,
    filters.exterior,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      {/* Top row — search + sort + toggle */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search skins…"
            value={filters.search ?? ''}
            onChange={(e) => update({ search: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 rounded-lg input-glass placeholder-slate-500 text-sm"
          />
        </div>

        {/* Sort */}
        <select
          value={filters.sort ?? ''}
          onChange={(e) => update({ sort: (e.target.value as FilterState['sort']) || undefined })}
          className="px-3 py-2 rounded-lg input-glass text-slate-300 text-sm"
        >
          <option value="">Sort: Default</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            expanded
              ? 'bg-cyan-glow border-[rgba(6,182,212,0.3)] text-trade-blue'
              : 'border-glass-border text-slate-400 hover:text-white hover:border-glass-strong'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 flex items-center justify-center bg-[#06b6d4] text-[#0a0e1a] text-[9px] font-bold rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter pills */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.type && (
            <FilterPill label={`Type: ${filters.type}`} onRemove={() => update({ type: undefined, subType: undefined })} />
          )}
          {filters.quality && (
            <FilterPill label={`Quality: ${filters.quality}`} onRemove={() => update({ quality: undefined })} />
          )}
          {filters.exterior && (
            <FilterPill label={`Exterior: ${filters.exterior}`} onRemove={() => update({ exterior: undefined })} />
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <FilterPill
              label={`Price: €${filters.minPrice ?? 0}–€${filters.maxPrice ?? '∞'}`}
              onRemove={() => update({ minPrice: undefined, maxPrice: undefined })}
            />
          )}
          <button
            onClick={() => onFilterChange({})}
            className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Expanded filters */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-glass-subtle grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
          {/* Weapon type */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 font-medium">Weapon Type</label>
            <div className="flex flex-wrap gap-1.5">
              {WEAPON_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => update({ type: filters.type === t ? undefined : t })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filters.type === t
                      ? 'bg-trade-blue text-trade-bg'
                      : 'bg-glass-subtle text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 font-medium">Quality</label>
            <select
              value={filters.quality ?? ''}
              onChange={(e) => update({ quality: e.target.value || undefined })}
              className="w-full px-3 py-2 rounded-lg input-glass text-slate-300 text-xs"
            >
              <option value="">All qualities</option>
              {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

          {/* Exterior */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 font-medium">Exterior</label>
            <select
              value={filters.exterior ?? ''}
              onChange={(e) => update({ exterior: e.target.value || undefined })}
              className="w-full px-3 py-2 rounded-lg input-glass text-slate-300 text-xs"
            >
              <option value="">All exteriors</option>
              {EXTERIORS.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>

          {/* Price range */}
          <div>
            <label className="block text-xs text-slate-500 mb-2 font-medium">Price Range (€)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                min={0}
                value={filters.minPrice ?? ''}
                onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-2 py-2 rounded-lg input-glass text-xs"
              />
              <span className="text-slate-600 text-xs">–</span>
              <input
                type="number"
                placeholder="Max"
                min={0}
                value={filters.maxPrice ?? ''}
                onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-2 py-2 rounded-lg input-glass text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-glow border border-cyan-border text-trade-blue text-xs">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors leading-none">×</button>
    </span>
  );
}
