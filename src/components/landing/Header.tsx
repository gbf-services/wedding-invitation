'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { t } from '@/lib/translations';
import { useAppStore } from '@/lib/store';

interface HeaderProps {
  onNavigate: (id: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useAppStore();

  const navItems = [
    { id: 'features', label: t('features', language) },
    { id: 'templates', label: t('templates', language) },
    { id: 'pricing', label: t('pricing', language) },
    { id: 'faq', label: t('faq', language) },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-xl font-bold text-gold">
            ✦ WeddingInvite
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="text-sm text-gray-600 hover:text-gold transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gold transition-colors"
            >
              {t('login', language)}
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gold text-white px-5 py-2 rounded-full text-sm hover:bg-gold-dark transition-colors"
            >
              {t('signup', language)}
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gold/10 px-4 pb-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className="block w-full text-left py-3 text-gray-600 hover:text-gold transition-colors"
            >
              {item.label}
            </button>
          ))}
          <Link
            href="/auth/login"
            className="block py-3 text-gray-600 hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {t('login', language)}
          </Link>
          <Link
            href="/auth/signup"
            className="block bg-gold text-white text-center px-5 py-3 rounded-full hover:bg-gold-dark transition-colors mt-2"
            onClick={() => setMobileOpen(false)}
          >
            {t('signup', language)}
          </Link>
        </div>
      )}
    </header>
  );
}
