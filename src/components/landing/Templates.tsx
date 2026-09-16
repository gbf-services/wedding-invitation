'use client';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { themes } from '@/lib/themes';
import type { ThemeId } from '@/lib/types';

const templateOrder: ThemeId[] = ['elegant', 'luxury', 'romantic', 'minimal', 'arabic-luxury'];

const colorMap: Record<ThemeId, string> = {
  elegant: 'from-[#FDF8F0] to-[#F5F0E8]',
  luxury: 'from-[#0F0F23] to-[#1A1A2E]',
  romantic: 'from-[#FFFAF0] to-[#FFF0F5]',
  minimal: 'from-[#FFFFFF] to-[#F8F8F8]',
  'arabic-luxury': 'from-[#0D0D0D] to-[#1C1C1C]',
};

const textColorMap: Record<ThemeId, string> = {
  elegant: 'text-charcoal',
  luxury: 'text-white',
  romantic: 'text-charcoal',
  minimal: 'text-charcoal',
  'arabic-luxury': 'text-white',
};

export default function Templates() {
  return (
    <section id="templates" className="py-20 md:py-28 bg-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-medium uppercase tracking-wider"
          >
            Templates
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-charcoal mt-4 mb-6"
          >
            Choose Your Style
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/60 max-w-2xl mx-auto"
          >
            Select from our curated collection of beautiful wedding invitation templates.
          </motion.p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible snap-x snap-mandatory lg:snap-none scrollbar-hide">
          {templateOrder.map((id, index) => {
            const theme = themes[id];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex-shrink-0 w-64 lg:w-auto snap-center"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <div
                    className={`bg-gradient-to-b ${colorMap[id]} h-72 sm:h-80 flex items-center justify-center p-6`}
                  >
                    <div className={`text-center ${textColorMap[id]}`}>
                      <p
                        className="text-2xl font-serif font-bold mb-2"
                        style={{ color: theme.defaults.primaryColor }}
                      >
                        Sarah & Ahmad
                      </p>
                      <p className="text-sm opacity-60">
                        {theme.defaults.background === '#0F0F23' ||
                        theme.defaults.background === '#0D0D0D' ||
                        theme.defaults.background === '#1C1C1C'
                          ? 'October 15, 2026'
                          : '15 October 2026'}
                      </p>
                      <div
                        className="mt-4 w-16 h-px mx-auto"
                        style={{ backgroundColor: theme.defaults.primaryColor }}
                      />
                      <p className="mt-4 text-xs opacity-40">
                        {theme.name}
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-charcoal text-sm font-medium rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-white">
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-charcoal">{theme.name}</h3>
                  <p className="text-sm text-charcoal/50 mt-1">
                    {theme.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
