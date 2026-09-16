'use client';

import { AlertTriangle } from 'lucide-react';
import { t, Language } from '@/lib/translations';

interface ErrorStateProps {
  message?: string;
  language?: Language;
}

export default function ErrorState({ message, language = 'en' }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white px-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-gold/50 mx-auto mb-4" />
        <p className="text-charcoal font-medium">
          {message || t('somethingWrong', language)}
        </p>
      </div>
    </div>
  );
}
