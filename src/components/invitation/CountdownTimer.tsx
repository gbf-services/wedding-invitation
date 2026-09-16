'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { t, Language } from '@/lib/translations';
import { getTimeRemaining } from '@/lib/utils';

interface CountdownTimerProps {
  date: string;
  time: string;
  language: Language;
  primaryColor: string;
}

export default function CountdownTimer({ date, time, language, primaryColor }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(getTimeRemaining(`${date}T${time}`));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(`${date}T${time}`));
    }, 1000);
    return () => clearInterval(timer);
  }, [date, time]);

  const units = [
    { value: remaining.days, label: t('days', language) },
    { value: remaining.hours, label: t('hours', language) },
    { value: remaining.minutes, label: t('minutes', language) },
    { value: remaining.seconds, label: t('seconds', language) },
  ];

  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-serif text-charcoal mb-6">{t('weddingCountdown', language)}</h3>
      <div className="flex justify-center gap-4">
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <span className="text-2xl font-bold" style={{ color: primaryColor }}>
              {unit.value}
            </span>
            <span className="text-xs text-gray-500">{unit.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
