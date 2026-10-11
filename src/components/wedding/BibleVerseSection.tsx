'use client';

import { motion } from 'framer-motion';

interface BibleVerseSectionProps {
  verse: string;
  ref: string;
}

export default function BibleVerseSection({ verse, ref }: BibleVerseSectionProps) {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: '#C9A96E' }} />
          <div className="flex gap-1.5">
            <span className="text-[10px]" style={{ color: '#C9A96E' }}>✦</span>
            <span className="text-sm" style={{ color: '#C9A96E' }}>✧</span>
            <span className="text-[10px]" style={{ color: '#C9A96E' }}>✦</span>
          </div>
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: '#C9A96E' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <span
            className="absolute -top-8 -left-2 sm:left-4 font-serif text-7xl sm:text-8xl leading-none opacity-30 select-none"
            style={{ color: '#C9A96E' }}
            aria-hidden
          >
            &ldquo;
          </span>

          <p className="font-serif italic text-lg sm:text-xl md:text-2xl leading-relaxed px-6 sm:px-10" style={{ color: '#3D2B1F' }}>
            {verse}
          </p>

          <span
            className="absolute -bottom-10 -right-2 sm:right-4 font-serif text-7xl sm:text-8xl leading-none opacity-30 select-none"
            style={{ color: '#C9A96E' }}
            aria-hidden
          >
            &rdquo;
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 text-xs sm:text-sm tracking-[0.25em] uppercase"
          style={{ color: '#8B6F5C' }}
        >
          {ref}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: '#C9A96E' }} />
          <div className="flex gap-1.5">
            <span className="text-[10px]" style={{ color: '#C9A96E' }}>✦</span>
            <span className="text-sm" style={{ color: '#C9A96E' }}>✧</span>
            <span className="text-[10px]" style={{ color: '#C9A96E' }}>✦</span>
          </div>
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: '#C9A96E' }} />
        </motion.div>
      </div>
    </section>
  );
}
