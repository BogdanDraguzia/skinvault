import LegalPage from '@/components/ui/LegalPage';

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" updated="March 2026">
      <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device. They help websites remember information about your visit to improve your experience.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Cookies We Use</h2>
          <table className="w-full text-xs mt-3 border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                <th className="text-left py-2 text-white pr-4">Cookie</th>
                <th className="text-left py-2 text-white pr-4">Purpose</th>
                <th className="text-left py-2 text-white">Duration</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['skinvault_token', 'Authentication JWT token', 'Session'],
                ['skinvault_cart', 'Shopping cart contents', 'Persistent'],
                ['skinvault_cookie_consent', 'Cookie consent preference', '1 year'],
              ].map(([name, purpose, duration]) => (
                <tr key={name} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="py-2 pr-4 font-mono text-[#06b6d4]">{name}</td>
                  <td className="py-2 pr-4">{purpose}</td>
                  <td className="py-2">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Note that disabling essential cookies may affect platform functionality.</p>
        </div>
      </div>
    </LegalPage>
  );
}
