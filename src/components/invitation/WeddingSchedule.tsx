'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import { WeddingEvent } from '@/lib/types';

interface WeddingScheduleProps {
  events: WeddingEvent[];
  language: Language;
  primaryColor: string;
}

export default function WeddingSchedule({ events, language, primaryColor }: WeddingScheduleProps) {
  const sorted = [...events].sort((a, b) => a.order - b.order);

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">
        {t('weddingSchedule', language)}
      </h3>
      <div className="max-w-md mx-auto space-y-4">
        {sorted.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gold/10"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Clock className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <p className="font-medium text-charcoal text-sm">
                {language === 'ar' && event.titleAr ? event.titleAr : event.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">{event.time}</p>
              {event.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ar' && event.descriptionAr ? event.descriptionAr : event.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
