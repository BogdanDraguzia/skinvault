import LegalPage from '@/components/ui/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="March 2026">
      <Section title="1. Acceptance of Terms">
        By accessing or using SkinVault, you agree to be bound by these Terms of Use. If you do not agree, please do not use our platform.
      </Section>
      <Section title="2. Account Registration">
        You must register an account to purchase skins. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
      </Section>
      <Section title="3. Purchases & Payments">
        All purchases are final once a trade offer has been sent. Prices are displayed in EUR. We reserve the right to cancel orders in case of system errors or fraud.
      </Section>
      <Section title="4. Prohibited Activities">
        You may not use our platform for money laundering, market manipulation, unauthorized access, or any activity that violates applicable law.
      </Section>
      <Section title="5. Limitation of Liability">
        SkinVault is not affiliated with Valve Corporation. CS2 skins are virtual items. We are not responsible for Steam trade failures caused by Steam&apos;s systems.
      </Section>
      <Section title="6. Changes to Terms">
        We may update these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.
      </Section>
    </LegalPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <p className="text-slate-400 leading-relaxed text-sm">{children}</p>
    </div>
  );
}
