'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpeningScreenProps {
  onOpen: () => void;
}

export default function OpeningScreen({ onOpen }: OpeningScreenProps) {
  const [leaving, setLeaving] = useState(false);

  const handleTap = () => {
    if (leaving) return;
    setLeaving(true);
    onOpen();
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          onClick={handleTap}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
          style={{
            background:
              'linear-gradient(160deg, #FDF8F0 0%, #F5E6D3 40%, #E8D5B8 70%, #F5E6D3 100%)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: '#C9A96E' }} />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-25 blur-3xl" style={{ backgroundColor: '#C9A96E' }} />
            <div className="absolute top-1/4 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: '#8B6F5C' }} />
            <div className="absolute bottom-1/4 -left-10 w-28 h-28 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: '#8B6F5C' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center px-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 sm:w-16" style={{ backgroundColor: '#C9A96E' }} />
              <div className="flex gap-1.5">
                <span className="text-[10px]" style={{ color: '#C9A96E' }}>✦</span>
                <span className="text-sm" style={{ color: '#C9A96E' }}>✧</span>
                <span className="text-[10px]" style={{ color: '#C9A96E' }}>✦</span>
              </div>
              <div className="h-px w-12 sm:w-16" style={{ backgroundColor: '#C9A96E' }} />
            </div>

            <p
              className="text-[11px] sm:text-xs tracking-[0.4em] uppercase mb-5"
              style={{ color: '#8B6F5C' }}
            >
              The Wedding Of
            </p>

            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center leading-tight"
              style={{ color: '#3D2B1F' }}
            >
              Christian
            </h1>
            <p
              className="font-serif italic text-2xl sm:text-3xl md:text-4xl my-2"
              style={{ color: '#C9A96E' }}
            >
              and
            </p>
            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center leading-tight"
              style={{ color: '#3D2B1F' }}
            >
              Joya
            </h1>

            <div className="flex items-center gap-3 mt-8 mb-4">
              <div className="h-px w-10 sm:w-14" style={{ backgroundColor: '#C9A96E' }} />
              <div className="relative w-4 h-4">
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: '#C9A96E' }}
                />
                <div
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: '#C9A96E' }}
                />
              </div>
              <div className="h-px w-10 sm:w-14" style={{ backgroundColor: '#C9A96E' }} />
            </div>

            <p
              className="text-[10px] sm:text-xs tracking-[0.3em] uppercase"
              style={{ color: '#8B6F5C' }}
            >
              June 20, 2027
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
            transition={{
              opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 1, delay: 0.6 },
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: '#C9A96E' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E' }} />
            </div>
            <span
              className="text-[11px] sm:text-xs tracking-[0.35em] uppercase"
              style={{ color: '#8B6F5C' }}
            >
              Tap to Start
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
