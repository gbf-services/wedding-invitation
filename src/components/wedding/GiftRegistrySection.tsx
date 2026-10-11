'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, Check, Landmark } from 'lucide-react';

interface GiftRegistrySectionProps {
  title: string;
  message: string;
  bank: string;
  account: string;
  primaryColor?: string;
}

export default function GiftRegistrySection({
  title,
  message,
  bank,
  account,
  primaryColor = '#C9A96E',
}: GiftRegistrySectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = account;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl border overflow-hidden"
          style={{
            borderColor: `${primaryColor}25`,
            background: `linear-gradient(160deg, rgba(255,255,255,0.95), ${primaryColor}12)`,
            boxShadow: '0 20px 50px rgba(61, 43, 31, 0.08)',
          }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: primaryColor }} />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: primaryColor }} />

          <div className="relative px-6 sm:px-8 py-10 sm:py-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${primaryColor}18` }}
            >
              <Gift className="w-7 h-7" style={{ color: primaryColor }} />
            </motion.div>

            <h2 className="font-serif text-2xl sm:text-3xl mb-4" style={{ color: '#3D2B1F' }}>
              {title}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-8 px-2" style={{ color: '#8B6F5C' }}>
              {message}
            </p>

            <div
              className="rounded-2xl border px-5 py-6"
              style={{
                borderColor: `${primaryColor}30`,
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Landmark className="w-4 h-4" style={{ color: primaryColor }} />
                <p className="text-sm tracking-[0.15em] uppercase" style={{ color: primaryColor }}>
                  {bank}
                </p>
              </div>

              <p
                className="font-serif text-xl sm:text-2xl tracking-wider mb-5 break-all"
                style={{ color: '#3D2B1F' }}
              >
                {account}
              </p>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Account
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
