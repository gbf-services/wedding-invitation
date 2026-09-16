'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Shield, Users, FileText, Image, Music, CreditCard, Settings, BarChart3, Menu, X, Heart } from 'lucide-react';

const navItems = [
  { href: '/super-admin', icon: BarChart3, label: 'overview' },
  { href: '/super-admin/users', icon: Users, label: 'allUsers' },
  { href: '/super-admin/invitations', icon: FileText, label: 'allInvitations' },
  { href: '/super-admin/templates', icon: Image, label: 'manageTemplates' },
  { href: '/super-admin/music', icon: Music, label: 'music' },
  { href: '/super-admin/pricing', icon: CreditCard, label: 'managePricing' },
  { href: '/super-admin/settings', icon: Settings, label: 'settings' },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace('/auth/login');
      setAuthChecked(true);
    });
    return () => unsub();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gold/10 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gold/10">
          <Shield className="w-5 h-5 text-gold" />
          <span className="font-serif font-bold text-charcoal">{t('superAdmin', language)}</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-gold/10 text-gold' : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {t(item.label, language)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gold/10 h-16 flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-semibold text-charcoal">{t('superAdmin', language)}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
