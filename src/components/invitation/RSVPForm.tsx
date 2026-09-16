'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Users } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import { RSVP } from '@/lib/types';
import toast from 'react-hot-toast';

interface RSVPFormProps {
  invitationId: string;
  language: Language;
  primaryColor: string;
  maxGuestsPerRsvp?: number;
  guestName?: string;
  onSubmit: (data: Omit<RSVP, 'id' | 'invitationId' | 'createdAt'>) => Promise<void>;
}

export default function RSVPForm({ invitationId, language, primaryColor, maxGuestsPerRsvp = 4, guestName, onSubmit }: RSVPFormProps) {
  const [name, setName] = useState(guestName || '');
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [meal, setMeal] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ guestName: name, guestCount, attending, meal: meal || '', message: message || '' });
      setSubmitted(true);
      toast.success(t('thankYouRsvp', language));
    } catch {
      toast.error(t('somethingWrong', language));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-12 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <Check className="w-8 h-8" style={{ color: primaryColor }} />
        </motion.div>
        <p className="font-medium text-charcoal">{t('thankYouRsvp', language)}</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">{t('rsvp', language)}</h3>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{t('fullName', language)}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{t('numberOfGuests', language)}</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min={1}
              max={maxGuestsPerRsvp}
              value={guestCount}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= maxGuestsPerRsvp) setGuestCount(val);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Max {maxGuestsPerRsvp} guests</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">{t('attendance', language)}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['yes', 'no', 'maybe'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAttending(opt)}
                className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                  attending === opt
                    ? 'text-white border-transparent'
                    : 'border-gold/20 text-gray-600 hover:border-gold/40'
                }`}
                style={attending === opt ? { backgroundColor: primaryColor } : {}}
              >
                {opt === 'yes' ? t('willAttend', language) : opt === 'no' ? t('cannotAttend', language) : t('maybeAttend', language)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{t('mealPreference', language)}</label>
          <select
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white"
          >
            <option value="">-</option>
            <option value="chicken">Chicken</option>
            <option value="beef">Beef</option>
            <option value="fish">Fish</option>
            <option value="vegetarian">Vegetarian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{t('messageOptional', language)}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? '...' : t('submit', language)}
        </button>
      </form>
    </div>
  );
}
