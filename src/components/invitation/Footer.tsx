'use client';

import { Heart } from 'lucide-react';
import { Language } from '@/lib/translations';

interface FooterProps {
  bride: string;
  groom: string;
  language: Language;
  primaryColor?: string;
}

export default function Footer({
  bride,
  groom,
  language,
  primaryColor = '#d4a574',
}: FooterProps) {
  const isArabic = language === 'ar';
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 text-center border-t border-gray-100">
      <div className="max-w-md mx-auto px-6">
        <p
          className={`text-xl font-serif mb-2 ${isArabic ? 'font-amiri' : ''}`}
          style={{ color: primaryColor }}
        >
          {groom} & {bride}
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-2">
          <span>{isArabic ? 'صنع بـ' : 'Made with'}</span>
          <Heart size={14} className="text-red-400 fill-current" />
          <span>{isArabic ? 'حب' : 'love'}</span>
        </div>

        <p className="text-gray-400 text-xs">&copy; {year}</p>
      </div>
    </footer>
  );
}