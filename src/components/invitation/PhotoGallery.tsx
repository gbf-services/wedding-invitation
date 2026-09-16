'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import { GalleryImage } from '@/lib/types';

interface PhotoGalleryProps {
  images: GalleryImage[];
  language: Language;
  primaryColor: string;
}

export default function PhotoGallery({ images, language, primaryColor }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const sorted = [...images].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) return null;

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">
        {t('photoGallery', language)}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
        {sorted.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square rounded-xl overflow-hidden cursor-pointer gallery-item"
            onClick={() => setLightbox(i)}
          >
            <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {lightbox > 0 && (
              <button
                className="absolute left-4 text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(lightbox - 1);
                }}
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            <img
              src={sorted[lightbox].imageUrl}
              alt={sorted[lightbox].caption || ''}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {lightbox < sorted.length - 1 && (
              <button
                className="absolute right-4 text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(lightbox + 1);
                }}
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
