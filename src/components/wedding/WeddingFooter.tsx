'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface WeddingFooterProps {
  groom: string;
  bride: string;
  date: string;
}

export default function WeddingFooter({ groom, bride, date }: WeddingFooterProps) {
  const year = new Date().getFullYear();
  const formatted = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <footer className="py-12 sm:py-14 px-4 text-center border-t" style={{ borderColor: '#C9A96E30' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-serif text-2xl sm:text-3xl" style={{ color: '#3D2B1F' }}>
          {groom}
          <span className="font-serif italic text-lg mx-2" style={{ color: '#C9A96E' }}>
            &
          </span>
          {bride}
        </p>

        <p className="text-xs tracking-[0.25em] uppercase mt-3" style={{ color: '#8B6F5C' }}>
          {formatted}
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs" style={{ color: '#8B6F5C' }}>
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-current" style={{ color: '#C9A96E' }} />
          <span>love</span>
        </div>

        <p className="text-[11px] mt-4 opacity-60" style={{ color: '#8B6F5C' }}>
          © {year}
        </p>
      </motion.div>
    </footer>
  );
}
