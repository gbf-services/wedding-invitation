'use client';

import { motion } from 'framer-motion';
import {
  Palette,
  Users,
  Image,
  Music,
  Share2,
  QrCode,
  Globe,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description:
      'Choose from professionally designed templates that match your wedding style.',
  },
  {
    icon: Users,
    title: 'RSVP Tracking',
    description:
      'Manage guest responses, meal preferences, and attendance in real-time.',
  },
  {
    icon: Image,
    title: 'Photo Gallery',
    description:
      'Share your favorite moments with a stunning photo gallery.',
  },
  {
    icon: Music,
    title: 'Custom Music',
    description:
      'Set the mood with your own background music or choose from our collection.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description:
      'Share your invitation via link, QR code, WhatsApp, or social media.',
  },
  {
    icon: QrCode,
    title: 'QR Codes',
    description:
      'Generate beautiful QR codes for your printed invitations.',
  },
  {
    icon: Globe,
    title: 'Arabic Support',
    description:
      'Full Arabic language support with RTL layout and beautiful Arabic fonts.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description:
      'Designed for mobile devices first, ensuring a perfect experience everywhere.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-sm font-medium uppercase tracking-wider"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-charcoal mt-4 mb-6"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/60 max-w-2xl mx-auto"
          >
            All the tools you need to create and manage a stunning digital wedding invitation.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 rounded-2xl bg-cream/50 border border-gold/10 hover:border-gold/30 hover:bg-white hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-charcoal/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
