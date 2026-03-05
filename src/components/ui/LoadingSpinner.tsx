import { cn } from '@/lib/utils';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: Props) {
  return (
    <div
      className={cn(
        'spinner',
        size === 'lg' && 'spinner-lg',
        size === 'sm' && '!w-4 !h-4',
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-500 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
