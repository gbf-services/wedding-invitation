'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { t, Language } from '@/lib/translations';

interface PasswordGateProps {
  onSubmit: (password: string) => Promise<boolean>;
  language: Language;
  primaryColor?: string;
}

export default function PasswordGate({ onSubmit, language, primaryColor = '#C9A96E' }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await onSubmit(password);
    if (!ok) {
      setError(t('incorrectPassword', language));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white px-4">
      <div className="w-full max-w-sm text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <Lock className="w-8 h-8" style={{ color: primaryColor }} />
        </div>

        <h2 className="text-xl font-serif font-bold text-charcoal mb-2">
          {t('enterPassword', language)}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {t('password', language)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-center text-lg tracking-widest"
            placeholder="••••••••"
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? '...' : t('unlock', language)}
          </button>
        </form>
      </div>
    </div>
  );
}
