import AccountTabs from '@/components/account/AccountTabs';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountTabs>{children}</AccountTabs>;
}
