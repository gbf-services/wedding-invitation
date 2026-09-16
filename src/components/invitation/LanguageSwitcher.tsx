'use client';

import { Globe } from 'lucide-react';
import { Language } from '@/lib/translations';

interface LanguageSwitcherProps {
  language: Language;
  onToggle: () => void;
}

export default function LanguageSwitcher({ language, onToggle }: LanguageSwitcherProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md border border-gold/20 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-charcoal hover:bg-white transition-colors shadow-sm"
    >
      <Globe className="w-4 h-4 text-gold" />
      {language === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
