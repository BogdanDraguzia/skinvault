import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-8xl font-bold font-sans text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="btn-shimmer px-8 py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold hover:bg-[#0ea5e9] transition-colors"
          style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
        >
          Back to Marketplace
        </Link>
      </div>
    </div>
  );
}
