'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    nameAr: 'مجاني',
    price: 0,
    highlighted: false,
    features: [
      'Basic template',
      'Limited customization',
      'RSVP tracking',
      'Platform branding',
      '1 event',
      'Up to 50 guests',
    ],
  },
  {
    name: 'Premium',
    nameAr: 'مميز',
    price: 49,
    highlighted: true,
    features: [
      'All templates',
      'Custom music',
      'Photo gallery',
      'Full RSVP',
      'Custom URL',
      'No branding',
      'Unlimited guests',
      'QR code generation',
    ],
  },
  {
    name: 'Luxury',
    nameAr: 'فاخر',
    price: 99,
    highlighted: false,
    features: [
      'Everything in Premium',
      'Personalized design',
      'Guest personalization',
      'Advanced RSVP',
      'Priority support',
      'Custom animations',
      'Multiple languages',
      'Analytics dashboard',
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-medium uppercase tracking-wider"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-charcoal mt-4 mb-6"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/60 max-w-2xl mx-auto"
          >
            Start for free and upgrade when you need more features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={cn(
                'relative rounded-2xl p-8 border-2 transition-all duration-300',
                plan.highlighted
                  ? 'border-gold bg-gradient-to-b from-gold/5 to-white shadow-xl shadow-gold/10 scale-105'
                  : 'border-charcoal/10 bg-white hover:border-gold/30 hover:shadow-lg'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold font-serif text-charcoal mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-charcoal">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-charcoal">
                        ${plan.price}
                      </span>
                      <span className="text-charcoal/50">/year</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-charcoal/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={cn(
                  'block text-center px-6 py-3 rounded-full font-medium transition-all duration-300',
                  plan.highlighted
                    ? 'bg-gold text-white hover:bg-gold-dark shadow-lg shadow-gold/25'
                    : 'border-2 border-charcoal/15 text-charcoal hover:border-gold hover:text-gold'
                )}
              >
                {plan.price === 0 ? 'Get Started' : 'Choose Plan'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
