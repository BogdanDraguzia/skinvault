'use client';

import { useState, useEffect } from 'react';
import {
  useGetProfileQuery,
  useUpdatePersonalMutation,
  useUpdateBillingMutation,
  useUpdateSteamMutation,
  useChangePasswordMutation,
} from '@/store/api/skinvaultApi';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PersonalPage() {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { data: profile, isLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  const [updatePersonal, { isLoading: savingPersonal }] = useUpdatePersonalMutation();
  const [updateBilling,  { isLoading: savingBilling  }] = useUpdateBillingMutation();
  const [updateSteam,    { isLoading: savingSteam    }] = useUpdateSteamMutation();
  const [changePassword, { isLoading: savingPassword }] = useChangePasswordMutation();

  const [personal, setPersonal] = useState({ firstName: '', lastName: '', email: '', phoneCode: '', phone: '' });
  const [billing,  setBilling]  = useState({ country: '', city: '', zipCode: '', addressLine: '' });
  const [steam,    setSteam]    = useState({ steamId: '', tradeLink: '' });
  const [pwForm,   setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg,   setErrorMsg]   = useState('');

  useEffect(() => {
    if (!profile) return;
    const [firstName = '', ...rest] = profile.fullName.split(' ');
    setPersonal({ firstName, lastName: rest.join(' '), email: profile.email, phoneCode: profile.phoneCode ?? '', phone: profile.phone ?? '' });
    setBilling({ country: profile.country ?? '', city: profile.city ?? '', zipCode: profile.zipCode ?? '', addressLine: profile.addressLine ?? '' });
    setSteam({ steamId: profile.steamId ?? '', tradeLink: profile.tradeLink ?? '' });
  }, [profile]);

  async function handlePersonal(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await updatePersonal(personal).unwrap();
      dispatch(setUser(res));
      setSuccessMsg('Personal info updated!');
    } catch { setErrorMsg('Failed to update personal info.'); }
  }

  async function handleBilling(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateBilling(billing).unwrap();
      setSuccessMsg('Billing address updated!');
    } catch { setErrorMsg('Failed to update billing.'); }
  }

  async function handleSteam(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateSteam(steam).unwrap();
      setSuccessMsg('Steam settings updated!');
    } catch { setErrorMsg('Failed to update Steam settings.'); }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await changePassword(pwForm).unwrap();
      setSuccessMsg('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { setErrorMsg('Password change failed.'); }
  }

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {successMsg && <div className="hn-success" onClick={() => setSuccessMsg('')}>{successMsg}</div>}
      {errorMsg   && <div className="hn-alert"   onClick={() => setErrorMsg('')}>{errorMsg}</div>}

      {/* Personal info */}
      <Section title="Personal Information">
        <form onSubmit={handlePersonal} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" value={personal.firstName} onChange={(v) => setPersonal((f) => ({ ...f, firstName: v }))} />
          <Field label="Last Name"  value={personal.lastName}  onChange={(v) => setPersonal((f) => ({ ...f, lastName: v  }))} />
          <Field label="Email" type="email" value={personal.email} onChange={(v) => setPersonal((f) => ({ ...f, email: v }))} className="sm:col-span-2" />
          <Field label="Phone" value={personal.phone} onChange={(v) => setPersonal((f) => ({ ...f, phone: v }))} />
          <SaveButton isLoading={savingPersonal} />
        </form>
      </Section>

      {/* Billing */}
      <Section title="Billing Address">
        <form onSubmit={handleBilling} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Country"     value={billing.country}     onChange={(v) => setBilling((f) => ({ ...f, country: v }))} />
          <Field label="City"        value={billing.city}        onChange={(v) => setBilling((f) => ({ ...f, city: v }))} />
          <Field label="ZIP Code"    value={billing.zipCode}     onChange={(v) => setBilling((f) => ({ ...f, zipCode: v }))} />
          <Field label="Address"     value={billing.addressLine} onChange={(v) => setBilling((f) => ({ ...f, addressLine: v }))} className="sm:col-span-2" />
          <SaveButton isLoading={savingBilling} />
        </form>
      </Section>

      {/* Steam */}
      <Section title="Steam Settings">
        <form onSubmit={handleSteam} className="grid grid-cols-1 gap-4">
          <Field label="Steam ID"    value={steam.steamId}   onChange={(v) => setSteam((f) => ({ ...f, steamId: v }))} />
          <Field label="Trade Link"  value={steam.tradeLink} onChange={(v) => setSteam((f) => ({ ...f, tradeLink: v }))} />
          <SaveButton isLoading={savingSteam} />
        </form>
      </Section>

      {/* Change password */}
      <Section title="Change Password">
        <form onSubmit={handlePassword} className="grid grid-cols-1 gap-4 max-w-md">
          {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((key) => (
            <Field
              key={key}
              label={key === 'currentPassword' ? 'Current Password' : key === 'newPassword' ? 'New Password' : 'Confirm New Password'}
              type="password"
              value={pwForm[key]}
              onChange={(v) => setPwForm((f) => ({ ...f, [key]: v }))}
            />
          ))}
          <SaveButton isLoading={savingPassword} label="Change Password" />
        </form>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-white font-semibold mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label, type = 'text', value, onChange, className = '',
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#06b6d4] transition-colors"
      />
    </div>
  );
}

function SaveButton({ isLoading, label = 'Save Changes' }: { isLoading: boolean; label?: string }) {
  return (
    <div className="sm:col-span-2 flex justify-end">
      <button
        type="submit"
        disabled={isLoading}
        className="btn-press px-6 py-2.5 rounded-lg bg-[#06b6d4] text-[#0a0e1a] font-semibold text-sm hover:bg-[#0ea5e9] transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {isLoading && <span className="spinner !w-4 !h-4" />}
        {label}
      </button>
    </div>
  );
}
