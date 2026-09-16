'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import { StoryEvent } from '@/lib/types';

interface CoupleStoryProps {
  events: StoryEvent[];
  language: Language;
  primaryColor: string;
}

export default function CoupleStory({ events, language, primaryColor }: CoupleStoryProps) {
  const sorted = [...events].sort((a, b) => a.order - b.order);

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">
        {t('ourStory', language)}
      </h3>
      <div className="max-w-md mx-auto relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gold/20" />
        <div className="space-y-6">
          {sorted.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 pl-2"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 bg-white"
                style={{ border: `2px solid ${primaryColor}` }}
              >
                <Heart className="w-3 h-3" style={{ color: primaryColor }} />
              </div>
              <div className="pt-1">
                <span className="text-xs font-medium" style={{ color: primaryColor }}>
                  {event.year}
                </span>
                <p className="font-medium text-charcoal text-sm mt-1">
                  {language === 'ar' && event.titleAr ? event.titleAr : event.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ar' && event.descriptionAr ? event.descriptionAr : event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
