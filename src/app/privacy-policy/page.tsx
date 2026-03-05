import LegalPage from '@/components/ui/LegalPage';

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="March 2026">
      <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Information We Collect</h2>
          <p>We collect information you provide during registration (name, email, phone), transaction data, and standard server logs (IP address, browser type).</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">How We Use Your Information</h2>
          <p>Your information is used to process transactions, provide customer support, send transactional emails, and improve our platform. We do not sell your data to third parties.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Cookies</h2>
          <p>We use essential cookies for authentication and functional cookies to remember your preferences. See our Cookie Policy for details.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Your Rights</h2>
          <p>Under GDPR, you have the right to access, rectify, or delete your personal data. Contact us at support@skinvault.gg to exercise these rights.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Data Retention</h2>
          <p>We retain transaction records for 7 years as required by law. Account data is retained until you request deletion.</p>
        </div>
      </div>
    </LegalPage>
  );
}
