'use client';

import { motion } from 'framer-motion';

interface WeddingCalendarProps {
  date: string;
  primaryColor?: string;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeddingCalendar({ date, primaryColor = '#C9A96E' }: WeddingCalendarProps) {
  const wedding = new Date(`${date}T12:00:00`);
  const year = wedding.getFullYear();
  const month = wedding.getMonth();
  const day = wedding.getDate();

  const monthName = wedding.toLocaleDateString('en-US', { month: 'long' });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="rounded-3xl border p-6 sm:p-8 text-center"
          style={{
            borderColor: `${primaryColor}30`,
            backgroundColor: 'rgba(255,255,255,0.85)',
            boxShadow: '0 20px 50px rgba(61, 43, 31, 0.08)',
          }}
        >
          <p
            className="text-[11px] tracking-[0.35em] uppercase mb-1"
            style={{ color: primaryColor }}
          >
            Save the Date
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl mb-1" style={{ color: '#3D2B1F' }}>
            {monthName}
          </h3>
          <p className="text-sm mb-6" style={{ color: '#8B6F5C' }}>
            {year}
          </p>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="text-[10px] sm:text-xs tracking-wider uppercase py-1"
                style={{ color: primaryColor }}
              >
                {wd.slice(0, 1)}
                <span className="hidden sm:inline">{wd.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className="h-px w-full mb-2" style={{ backgroundColor: `${primaryColor}25` }} />

          <div className="space-y-1">
            {weeks.map((week, wi) => (
              <motion.div
                key={wi}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + wi * 0.06 }}
                className="grid grid-cols-7 gap-1"
              >
                {week.map((d, di) => {
                  const isWeddingDay = d === day;
                  return (
                    <div key={di} className="flex items-center justify-center h-8 sm:h-9">
                      {d === null ? (
                        <span />
                      ) : isWeddingDay ? (
                        <div
                          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-white"
                          style={{
                            backgroundColor: primaryColor,
                            boxShadow: `0 6px 16px ${primaryColor}55`,
                          }}
                        >
                          {d}
                          <span
                            className="absolute -top-1 -right-1 text-[8px]"
                            style={{ color: primaryColor }}
                            aria-hidden
                          >
                            ♥
                          </span>
                        </div>
                      ) : (
                        <span
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm"
                          style={{ color: '#3D2B1F' }}
                        >
                          {d}
                        </span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 pt-5 border-t flex items-center justify-center gap-2"
            style={{ borderColor: `${primaryColor}20` }}
          >
            <span className="text-sm" style={{ color: primaryColor }}>♥</span>
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#8B6F5C' }}>
              {wedding.toLocaleDateString('en-US', { weekday: 'long' })}, {monthName} {day}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
