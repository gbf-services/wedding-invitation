'use client';

import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { t, Language } from '@/lib/translations';

interface OpeningScreenProps {
  groom: string;
  bride: string;
  groomAr?: string;
  brideAr?: string;
  date: string;
  language: Language;
  primaryColor: string;
  onOpen: () => void;
  guestName?: string;
}

export default function OpeningScreen({
  groom,
  bride,
  groomAr,
  brideAr,
  date,
  language,
  primaryColor,
  onOpen,
  guestName,
}: OpeningScreenProps) {
  const displayName = language === 'ar' && groomAr && brideAr ? `${groomAr} & ${brideAr}` : `${groom} & ${bride}`;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05, white)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 max-w-lg"
      >
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <span className="text-sm tracking-widest uppercase" style={{ color: primaryColor }}>
              {t('dear', language)} {guestName}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: primaryColor }}>
            {t('youAreInvited', language)}
          </span>
          <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-3"
        >
          {displayName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 mb-8"
        >
          {new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-medium shadow-lg transition-shadow hover:shadow-xl"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 10px 30px ${primaryColor}30`,
          }}
        >
          <Mail className="w-5 h-5" />
          {t('openInvitation', language)}
        </motion.button>
      </motion.div>
    </div>
  );
}
