'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import { Wish } from '@/lib/types';
import toast from 'react-hot-toast';

interface WishesSectionProps {
  wishes: Wish[];
  language: Language;
  primaryColor: string;
  onSubmit: (data: { name: string; message: string }) => Promise<void>;
}

export default function WishesSection({ wishes, language, primaryColor, onSubmit }: WishesSectionProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const approved = wishes.filter((w) => w.approved);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, message });
      setName('');
      setMessage('');
      toast.success(t('thankYouWish', language));
    } catch {
      toast.error(t('somethingWrong', language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">{t('wishes', language)}</h3>

      {approved.length > 0 && (
        <div className="max-w-md mx-auto space-y-3 mb-8">
          {approved.map((wish, i) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white border border-gold/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3 h-3" style={{ color: primaryColor }} />
                <span className="text-xs font-medium text-charcoal">{wish.name}</span>
              </div>
              <p className="text-sm text-gray-600">{wish.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{t('yourName', language)}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">{t('yourMessage', language)}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
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
          {loading ? '...' : t('submitWish', language)}
        </button>
      </form>
    </div>
  );
}
