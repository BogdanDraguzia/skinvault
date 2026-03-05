'use client';

import { useState } from 'react';
import { useContactSupportMutation } from '@/store/api/skinvaultApi';

export default function ContactPage() {
  const [contactSupport, { isLoading }] = useContactSupportMutation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState('');

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await contactSupport(form).unwrap();
      setSent(true);
    } catch {
      setError('Failed to send message. Please try again or email us directly.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold font-sans text-white mb-2">Contact Us</h1>
      <p className="text-slate-400 mb-10">
        Have a question or need help? We typically respond within 24 hours.
      </p>

      {sent ? (
        <div className="hn-success text-center py-8">
          <p className="text-2xl mb-3">✓</p>
          <p className="text-white font-semibold mb-1">Message sent!</p>
          <p className="text-sm">We&apos;ll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name"  value={form.name}  onChange={(v) => update('name', v)} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} />
          </div>
          <Field label="Subject" value={form.subject} onChange={(v) => update('subject', v)} />
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors resize-none"
              required
            />
          </div>
          {error && <div className="hn-alert">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-shimmer btn-press px-8 py-3 rounded-xl bg-[#06b6d4] text-[#0a0e1a] font-bold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60"
            style={{ boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
          >
            {isLoading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, type = 'text', value, onChange }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
        required
      />
    </div>
  );
}
