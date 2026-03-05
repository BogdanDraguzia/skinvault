import Link from 'next/link';

const LINKS = {
  Marketplace: [
    { href: '/', label: 'Browse Skins' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ],
  Legal: [
    { href: '/terms', label: 'Terms of Use' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-[rgba(6,182,212,0.1)] bg-[rgba(10,14,26,0.8)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                <circle cx="16" cy="16" r="8"  stroke="#06b6d4" strokeWidth="1.5" opacity="0.8" />
                <circle cx="16" cy="16" r="2"  fill="#06b6d4" />
                <line x1="2" y1="16" x2="8"  y2="16" stroke="#06b6d4" strokeWidth="1.5" />
                <line x1="24" y1="16" x2="30" y2="16" stroke="#06b6d4" strokeWidth="1.5" />
                <line x1="16" y1="2"  x2="16" y2="8"  stroke="#06b6d4" strokeWidth="1.5" />
                <line x1="16" y1="24" x2="16" y2="30" stroke="#06b6d4" strokeWidth="1.5" />
              </svg>
              <span className="font-sans font-bold text-white text-lg tracking-wide">SkinVault</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              The trusted marketplace for CS2 skins. Buy and sell with confidence.
            </p>
            <a
              href="mailto:support@skinvault.gg"
              className="text-sm text-[#06b6d4] hover:text-[#0ea5e9] transition-colors"
            >
              support@skinvault.gg
            </a>

            {/* Social proof */}
            <div className="flex gap-4 mt-5">
              {[
                { value: '10K+', label: 'Skins' },
                { value: '50K+', label: 'Traders' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-[#06b6d4] font-bold text-sm">{stat.value}</div>
                  <div className="text-slate-600 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {year} SkinVault. All rights reserved.
          </p>
          {/* Payment method badges */}
          <div className="flex items-center gap-3 text-slate-600 text-xs">
            {['Visa', 'Mastercard', 'Google Pay', 'Apple Pay'].map((method) => (
              <span
                key={method}
                className="px-2 py-1 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-slate-500"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
