/**
 * Merge class names — lightweight cn() utility
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a price as currency string
 */
export function formatPrice(price: number, currency = '€'): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format ISO date string to human-readable
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * Truncate a string to a max length
 */
export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/**
 * Get user initials (up to 2 chars)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/**
 * Exterior badge colour class
 */
export const exteriorColors: Record<string, string> = {
  'Factory New':   'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Minimal Wear':  'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Field-Tested':  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Well-Worn':     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Battle-Scarred':'bg-red-500/20 text-red-400 border-red-500/30',
  'Not Painted':   'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export function getExteriorClass(exterior: string): string {
  return exteriorColors[exterior] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

/**
 * Quality badge colour class
 */
export const qualityColors: Record<string, string> = {
  'Consumer Grade':   'text-slate-400',
  'Industrial Grade': 'text-sky-400',
  'Mil-Spec Grade':   'text-blue-400',
  'Restricted':       'text-purple-400',
  'Classified':       'text-pink-400',
  'Covert':           'text-red-400',
  'Contraband':       'text-yellow-400',
};

export function getQualityClass(quality: string): string {
  return qualityColors[quality] ?? 'text-slate-400';
}

/**
 * Derive a popularity score (0–100) from price
 */
export function getPopularityScore(price: number): number {
  if (price >= 500) return 95;
  if (price >= 100) return 80;
  if (price >= 50)  return 65;
  if (price >= 10)  return 50;
  return 30;
}

/**
 * Build a pagination range array with ellipsis
 */
export function getPaginationRange(
  current: number,
  total: number,
  delta = 2
): (number | '...')[] {
  const range: (number | '...')[] = [];
  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return range;
}

/**
 * Extracts a human-readable message from an RTK Query error.
 * Replaces the scattered `(err as { data?: { message?: string } })` pattern.
 */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (typeof err !== 'object' || err === null) return fallback;
  const data = (err as Record<string, unknown>).data;
  if (typeof data === 'object' && data !== null) {
    const msg = (data as Record<string, unknown>).message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return fallback;
}
