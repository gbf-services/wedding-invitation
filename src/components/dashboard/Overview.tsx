'use client';

import { motion } from 'framer-motion';
import {
  Eye,
  Users,
  UserCheck,
  UserX,
  UsersRound,
  Heart,
  MessageSquare,
} from 'lucide-react';
import type { Invitation } from '@/lib/types';

interface OverviewProps {
  invitation: Invitation;
  rsvpCount: number;
  attendingCount: number;
  notAttendingCount: number;
  totalGuests: number;
  wishesCount: number;
  views: number;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Overview({
  invitation,
  rsvpCount,
  attendingCount,
  notAttendingCount,
  totalGuests,
  wishesCount,
  views,
}: OverviewProps) {
  const stats = [
    {
      label: 'Views',
      value: views,
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'RSVP Count',
      value: rsvpCount,
      icon: Users,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      label: 'Attending',
      value: attendingCount,
      icon: UserCheck,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Not Attending',
      value: notAttendingCount,
      icon: UserX,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      label: 'Total Guests',
      value: totalGuests,
      icon: UsersRound,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      label: 'Wishes Received',
      value: wishesCount,
      icon: Heart,
      color: 'text-pink-500',
      bg: 'bg-pink-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-charcoal">
            Overview
          </h1>
          <p className="text-sm text-charcoal/50 mt-1">
            {invitation.bride} & {invitation.groom} &mdash; {invitation.slug}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              invitation.status === 'published'
                ? 'bg-green-100 text-green-700'
                : invitation.status === 'draft'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {invitation.status}
          </span>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="p-4 rounded-2xl bg-white border border-gold/10 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
            <p className="text-xs text-charcoal/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
