'use client';

import { motion } from 'framer-motion';

interface CoupleIntroSectionProps {
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  groom: string;
  bride: string;
}

function GoldDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center gap-3 my-8"
    >
      <div className="h-px w-14 sm:w-20" style={{ backgroundColor: '#C9A96E' }} />
      <div
        className="w-2 h-2 rotate-45"
        style={{ backgroundColor: '#C9A96E' }}
      />
      <div className="h-px w-14 sm:w-20" style={{ backgroundColor: '#C9A96E' }} />
    </motion.div>
  );
}

export default function CoupleIntroSection({
  groomFather,
  groomMother,
  brideFather,
  brideMother,
  groom,
  bride,
}: CoupleIntroSectionProps) {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-6" style={{ color: '#8B6F5C' }}>
            Together with their families
          </p>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#3D2B1F' }}>
            {groomFather}
            <span className="mx-1" style={{ color: '#C9A96E' }}>&amp;</span>
            {groomMother}
          </p>
          <p className="text-xs mt-1 tracking-wide" style={{ color: '#8B6F5C' }}>
            Parents of the Groom
          </p>

          <div className="my-5">
            <span className="font-serif italic text-lg" style={{ color: '#C9A96E' }}>
              and
            </span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#3D2B1F' }}>
            {brideFather}
            <span className="mx-1" style={{ color: '#C9A96E' }}>&amp;</span>
            {brideMother}
          </p>
          <p className="text-xs mt-1 tracking-wide" style={{ color: '#8B6F5C' }}>
            Parents of the Bride
          </p>
        </motion.div>

        <GoldDivider />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase leading-relaxed px-2"
          style={{ color: '#8B6F5C' }}
        >
          Request the honor of your presence
          <br />
          at the wedding of their son and daughter
        </motion.p>

        <GoldDivider />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
          className="mt-4"
        >
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl" style={{ color: '#3D2B1F' }}>
            {groom}
          </h2>
          <p className="font-serif italic text-2xl sm:text-3xl my-3" style={{ color: '#C9A96E' }}>
            and
          </p>
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl" style={{ color: '#3D2B1F' }}>
            {bride}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <div className="h-px w-20 sm:w-28" style={{ backgroundColor: '#C9A96E' }} />
          <div className="relative w-5 h-5">
            <div
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: '#C9A96E' }}
            />
            <div
              className="absolute inset-[3px] rounded-full"
              style={{ backgroundColor: '#C9A96E' }}
            />
          </div>
          <div className="h-px w-20 sm:w-28" style={{ backgroundColor: '#C9A96E' }} />
        </motion.div>
      </div>
    </section>
  );
}
