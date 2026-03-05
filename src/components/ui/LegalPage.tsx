interface Props {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, updated, children }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sans text-white mb-2">{title}</h1>
        <p className="text-xs text-slate-500">Last updated: {updated}</p>
      </div>
      <div className="glass-card rounded-xl p-8">{children}</div>
    </div>
  );
}
