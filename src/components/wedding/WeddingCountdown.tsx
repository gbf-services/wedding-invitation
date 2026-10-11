'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTimeRemaining } from '@/lib/utils';

interface WeddingCountdownProps {
  date: string;
  time?: string;
  primaryColor?: string;
}

export default function WeddingCountdown({
  date,
  time = '00:00',
  primaryColor = '#C9A96E',
}: WeddingCountdownProps) {
  const target = `${date}T${time}`;
  const [remaining, setRemaining] = useState(() => getTimeRemaining(target));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getTimeRemaining(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  const isWeddingDayOrPast = remaining.total <= 0;

  if (isWeddingDayOrPast) {
    return (
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="rounded-3xl border px-6 py-12 sm:py-14"
            style={{
              borderColor: `${primaryColor}30`,
              backgroundColor: 'rgba(255,255,255,0.85)',
              boxShadow: '0 20px 50px rgba(61, 43, 31, 0.08)',
            }}
          >
            <p className="font-serif text-3xl sm:text-4xl" style={{ color: '#3D2B1F' }}>
              Today is the day!
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-12" style={{ backgroundColor: primaryColor }} />
              <span className="text-lg" style={{ color: primaryColor }}>♥</span>
              <div className="h-px w-12" style={{ backgroundColor: primaryColor }} />
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const units = [
    { value: remaining.days, label: 'Days' },
    { value: remaining.hours, label: 'Hours' },
    { value: remaining.minutes, label: 'Minutes' },
    { value: remaining.seconds, label: 'Seconds' },
  ];

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-[11px] tracking-[0.35em] uppercase mb-8"
          style={{ color: '#8B6F5C' }}
        >
          Counting down to forever
        </motion.p>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="rounded-2xl border px-1.5 py-4 sm:py-6 flex flex-col items-center justify-center"
              style={{
                borderColor: `${primaryColor}25`,
                backgroundColor: 'rgba(255,255,255,0.9)',
                boxShadow: '0 12px 30px rgba(61, 43, 31, 0.06)',
              }}
            >
              <span
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tabular-nums"
                style={{ color: primaryColor }}
              >
                {unit.value.toString().padStart(2, '0')}
              </span>
              <span
                className="text-[9px] sm:text-[11px] tracking-[0.15em] uppercase mt-1 sm:mt-2"
                style={{ color: '#8B6F5C' }}
              >
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
