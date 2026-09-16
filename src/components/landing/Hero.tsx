'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream via-white to-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-rose/10 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-4 h-4 text-gold/40"
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/4 w-3 h-3 text-gold/30"
          animate={{ y: [10, -10, 10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <Heart className="w-full h-full fill-current" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-5 h-5 text-rose/30"
          animate={{ y: [-8, 8, -8], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Create Beautiful Digital Invitations
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold font-serif text-charcoal leading-tight mb-6"
        >
          Your Wedding. Your Story.{' '}
          <span className="gold-gradient">Your Invitation.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-charcoal/60 max-w-2xl mx-auto mb-10"
        >
          Create a beautiful digital wedding invitation that your guests will
          remember. Elegant templates, RSVP tracking, photo galleries, and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gold text-white font-medium rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/30"
          >
            Create Your Invitation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#templates"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-charcoal/15 text-charcoal font-medium rounded-full hover:border-gold hover:text-gold transition-all duration-300"
          >
            View Examples
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-charcoal/40"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Free to start
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Setup in minutes
          </div>
        </motion.div>
      </div>
    </section>
  );
}
