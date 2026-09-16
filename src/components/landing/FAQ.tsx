'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How does it work?',
    answer:
      'Sign up for free, choose a template, customize your invitation with your details, photos, and music, then share it with your guests via a unique link or QR code.',
  },
  {
    question: 'Is it really free to start?',
    answer:
      'Yes! You can create a beautiful invitation with our Free plan. It includes a basic template, RSVP tracking, and everything you need to get started. Upgrade to Premium for advanced features.',
  },
  {
    question: 'Can I use my own custom URL?',
    answer:
      'Premium and Luxury plans include custom URL slugs. You can set a personalized URL like yourdomain.com/wedding/sarah-and-ahmad to share with your guests.',
  },
  {
    question: 'How does RSVP tracking work?',
    answer:
      'Guests can respond directly through your invitation. You can track attendance, meal preferences, number of guests, and personal messages all from your dashboard in real-time.',
  },
  {
    question: 'Can I add background music?',
    answer:
      'Yes! Premium and Luxury plans let you upload custom background music. Your invitation will play the music when guests open it, setting the perfect mood.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Absolutely. We use Firebase for secure data storage and authentication. You can set your invitation to private (password-protected) and only you have access to guest data.',
  },
  {
    question: 'Do you support Arabic invitations?',
    answer:
      'Yes! We offer full Arabic language support with beautiful Arabic fonts, RTL layout, and the ability to have both Arabic and English on the same invitation.',
  },
  {
    question: 'Can I download a QR code?',
    answer:
      'Yes! You can generate and download a beautiful QR code for your invitation. This is perfect for including on printed cards or displaying at your venue.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-cream/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-medium uppercase tracking-wider"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-charcoal mt-4 mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-gold/10 bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-charcoal pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-charcoal/60 leading-relaxed border-t border-gold/10 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
